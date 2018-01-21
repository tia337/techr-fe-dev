import {Component, ElementRef, OnInit, QueryList, ViewChildren, Renderer2, ViewChild } from '@angular/core';
import { TestSkillsService } from './test-skills.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { MatAutocompleteTrigger } from '@angular/material';
import * as _ from 'underscore';

@Component({
	selector: 'app-test-skills',
	templateUrl: './test-skills.component.html',
	styleUrls: ['./test-skills.component.scss']
})
export class TestSkillsComponent implements OnInit {
	
	myControl: FormControl = new FormControl();
	public selected = [];
	public selectionCounter: number  = 0;
	public expPosition: number = 1;
	public active: boolean = false;
	public query = '';
	public filteredList = [];
	
	public selectedRoles = [];
	public activeForRoles: boolean = false;
	public queryRoles = '';
	
	public selectedIndustries = [];
	public activeForIndustries: boolean = false;
	public queryIndustries = '';
	
	public filteredRnIList = [];
	public selectionRnICounter: number = 0;
	
	categories;
	skills;
	
	roles;
	
	industries;
	
	dropdownVisible: boolean;
	dropdownRolesVisible: boolean;
	dropdownIndustriesVisible: boolean;
	
	@ViewChildren('categoryTitles') categoryTitles: QueryList<ElementRef>;
	@ViewChild('categoriesDropdown') categoriesDropdown: ElementRef;
	@ViewChild('scrollpanel', { read: ElementRef }) public panel: ElementRef;
	
	constructor(private _testSkillsService: TestSkillsService, private _renderer: Renderer2, private _elementRef: ElementRef) { }
	
	ngOnInit() {
		this._testSkillsService.getSkills().then( skills => {
			this.skills = skills;
		});
		
		this._testSkillsService.getCategories().then( categories => {
			this.categories = categories;
		});
		
		this._testSkillsService.getRoles().then( roles => {
			this.roles = roles;
		});
		
		this._testSkillsService.getIndustries().then( industries => {
			this.industries = industries;
		});
	}
	
	getCategorySkills(index) {
		const skillsWrap = this.categoryTitles.toArray()[index].nativeElement;
		
		if ( !skillsWrap.classList.contains('loaded') ) {
			const categorySkills = _.filter(this.skills, skill => {
				if(skill.get('categories')){
					return skill.get('categories').includes(this.categories[index].id);
				}else{
					return;
				}
				
			});
			
			categorySkills.forEach(skill => {
				const skillElement = this._renderer.createElement('div');
				const skillTitle = this._renderer.createElement('div');
				
				const experienceWrap = this._renderer.createElement('div');
				const experienceButtonOne = this._renderer.createElement('div');
				const experienceButtonTwo = this._renderer.createElement('div');
				const experienceButtonThree = this._renderer.createElement('div');
				
				skillTitle.innerHTML = skill.get('title');
				
				this._renderer.addClass(skillElement, '_' + skill.id);
				this._renderer.addClass(skillElement, 'skill-row');
				this._renderer.addClass(experienceWrap, 'experience-wrap');
				
				this._renderer.addClass(skillTitle, 'skill-title');
				this._renderer.addClass(experienceButtonOne, 'experience-button');
				this._renderer.addClass(experienceButtonTwo, 'experience-button');
				
				this._renderer.addClass(experienceButtonThree, 'experience-button');
				experienceButtonOne.innerHTML = 'Any';
				
				experienceButtonOne.addEventListener('click', event => {
					this.selectSkill(skill, 1);
				});
				experienceButtonTwo.innerHTML = '3+';
				
				experienceButtonTwo.addEventListener('click', event => {
					this.selectSkill(skill, 2);
				});
				experienceButtonThree.innerHTML = '5+';
				
				experienceButtonThree.addEventListener('click', event => {
					this.selectSkill(skill, 3);
				});
				
				this._renderer.appendChild(skillElement, skillTitle);
				this._renderer.appendChild(skillElement, experienceWrap);
				
				this._renderer.appendChild(experienceWrap, experienceButtonOne);
				this._renderer.appendChild(experienceWrap, experienceButtonTwo);
				
				this._renderer.appendChild(experienceWrap, experienceButtonThree);
				this._renderer.appendChild(skillsWrap, skillElement);
			});
			
			this._renderer.addClass(skillsWrap, 'opened');
			this._renderer.addClass(skillsWrap, 'loaded');
		} else {
			if ( skillsWrap.classList.contains('opened') ) {
				this._renderer.removeClass(skillsWrap, 'opened');
			} else {
				this._renderer.addClass(skillsWrap, 'opened');
			}
		}
	}
	
	selectSkill(skill, experience) {
		const skillComponent = this._testSkillsService.createSkillComponent(skill, experience);
		this.selected.push(skillComponent);
		
		const skillRows = this._elementRef.nativeElement.querySelectorAll('._' + skill.id);
		console.log(skillRows);
		skillRows.forEach(element => {
			this._renderer.setStyle(element, 'display', 'none');
		});
		
		this.skills = _.without(this.skills, skill);
		this.query = '';
		this.filteredList = [];
	}
	
	selectRole(role) {
		const roleComponent = this._testSkillsService.createRoleComponent(role);
		this.selectedRoles.push(roleComponent);
		console.log(this.selectedRoles);
		console.log(role);
		const roleRows = this._elementRef.nativeElement.querySelectorAll('._' + role.id);
		console.log(roleRows);
		roleRows.forEach(element => {
			this._renderer.setStyle(element, 'display', 'none');
		});
		
		this.roles = _.without(this.roles, role);
		this.queryRoles = '';
		this.filteredRnIList = [];
	}
	
	selectIndustry(industry) {
		const industryComponent = this._testSkillsService.createIndustryComponent(industry);
		this.selectedIndustries.push(industryComponent);
		const industriesRows = this._elementRef.nativeElement.querySelectorAll('._' + industry.id);
		industriesRows.forEach(element => {
			this._renderer.setStyle(element, 'display', 'none');
		});
		console.log(industry);
		this.industries = _.without(this.industries, industry);
		console.log(this.industries);
		this.queryIndustries = '';
		this.filteredRnIList = [];
	}
	
	// openDropdown() {
	//   this.categoriesDropdown.nativeElement.
	// }
	
	
	
	
	// ------------------------------------------------------------------------------
	
	
	filterRnI(query, items ){
		if(query.length  === 1){
			let char = '\\b' + query.toUpperCase();
			let exp = new RegExp(char, 'g');
			this.filteredRnIList = items.filter(el=>{
				if(el.get('title') && el.get('title').toUpperCase().match(exp)){
					return el.get('title');
				}
			}).slice(0,50);
		}else if (query !== ''){
			this.filteredRnIList = items.filter(el =>{
				if(el.get('title')){
					return el.get('title').toLowerCase().indexOf(query.toLowerCase()) > -1;
				}else{
					return;
				}
			}).slice(0,50);
			this.selectionRnICounter = 0;
		} else {
			this.filteredRnIList = [];
		}
	}
	
	
	
	filter() {
		console.log(this.query);
		if(this.query.length  === 1){
			let char = '\\b' + this.query.toUpperCase();
			let exp = new RegExp(char, 'g');
			console.log(this.skills);
			this.filteredList = this.skills.filter(el=>{
				if(el.get('title')){
					console.log(el.get('title').toUpperCase());
				}
				if(el.get('title') && el.get('title').toUpperCase().match(exp)){
					return el.get('title');
				}
			}).slice(0,50);
		}
		else if (this.query !== '') {
			console.log('filter_test');
			this.filteredList = this.skills.filter(el => {
				if(el.get('title')){
					return el.get('title').toLowerCase().indexOf(this.query.toLowerCase()) > -1;
				}else{
					return;
				}
			}).slice(0,50);
			this.selectionCounter = 0;
		} else {
			this.filteredList = [];
		}
	}
	
	keyPressing(value: any) {
		console.log(value.code);
		
		
		if (value.code === 'Enter') {
			if(this.selectionCounter >= 0 && this.filteredList.length > 0){
				this.selectSkill(this.filteredList[this.selectionCounter], this.expPosition);
			}
		}
		
		if (value.code === 'ArrowRight') {
			if(this.expPosition > 0 && this.expPosition < 3){
				this.expPosition +=1;
				console.log(this.expPosition);
			}
		}

		if (value.code === 'ArrowLeft') {
			console.log('leftTest');
			if (this.expPosition > 1 && this.expPosition <= 3){
				this.expPosition -= 1;
				console.log(this.expPosition);
			}
		} else if (value.code !== 'ArrowDown' && value.code != 'ArrowUp' && value.code != 'Enter' && value.code != 'ArrowRight' && value.code != 'Click') {
			this.filter();
		}
	}

	keyRnIPressing(value: any, name: string) {
		console.log(value.code);

		if (value.code === 'Enter') {
			if(name === 'role'){
				if(this.selectionRnICounter >= 0 && this.filteredRnIList.length > 0){
					this.selectRole(this.filteredRnIList[this.selectionRnICounter]);
				}
			}else if(name === 'industry'){
				if(this.selectionRnICounter >= 0 && this.filteredRnIList.length > 0){
					this.selectIndustry(this.filteredRnIList[this.selectionRnICounter]);
				}
			}
		} else if (value.code != 'ArrowDown' && value.code != 'ArrowUp' && value.code != 'Enter' && value.code != 'ArrowRight' && value.code != 'Click') {
			if(name === 'role'){
				this.filterRnI(this.queryRoles, this.roles);
			}else if(name ==='industry'){
				this.filterRnI(this.queryIndustries, this.industries);
			}
		}
	}
	
	prevDefRnI(value, name: string) {
		if(value.code != 'Click'){
			if(name === 'industry'){
				this.activeForIndustries = true;
			}else if(name === 'role'){
				this.activeForRoles = true;
			}
			this.dropdownVisible = false;
			this.dropdownRolesVisible = false;
			this.dropdownIndustriesVisible = false
		}
		if (value.code === 'ArrowRight') {
			value.preventDefault();
		}
		if (value.code === 'ArrowLeft') {
			value.preventDefault();
		}
		if (value.code === 'ArrowUp') {
			value.preventDefault();
			if(this.selectionRnICounter > 0){
				this.selectionRnICounter -= 1;
				// this.panel.nativeElement.scrollTop -= 35;
			}
		}
		if (value.code === 'ArrowDown') {
			value.preventDefault();
			if(this.selectionRnICounter < (this.filteredRnIList.length - 1)) {
				this.selectionRnICounter += 1;
				console.log(this.selectionRnICounter);
				// this.panel.nativeElement.scrollTop += 36.36;
			}    
		}
	}
	
	prevDef(value) {
		if(value.code != 'Click'){
			console.log('active_change');
			this.active = true;
			this.dropdownVisible = false;
			this.dropdownRolesVisible = false;
		}
		console.log(value);
		if (value.code === 'ArrowRight') {
			value.preventDefault();
		}
		if (value.code === 'ArrowLeft') {
			value.preventDefault();
		}
		if (value.code === 'ArrowUp') {
			value.preventDefault();
			if(this.selectionCounter > 0){
				this.selectionCounter -= 1;
				this.expPosition = 1;
				this.panel.nativeElement.scrollTop -= 35;
			}
		}
		if (value.code === 'ArrowDown') {
			value.preventDefault();
			if(this.selectionCounter < (this.filteredList.length - 1)) {
				this.selectionCounter += 1;
				this.expPosition = 1;
				this.panel.nativeElement.scrollTop += 36.36;
			}    
		}
	}
	
	roleRemove(role) {
		this.roles.push(role.get('role'));
		this.selectedRoles.splice(this.selectedRoles.indexOf(role), 1);
		const roleRows = this._elementRef.nativeElement.querySelectorAll('._' + role.get('role').id);
		// role.destroy(); 
		roleRows.forEach(element => {
			this._renderer.removeStyle(element, 'display');
		});
	}
	
	industryRemove(industry) {
		this.industries.push(industry.get('industry'));
		this.selectedIndustries.splice(this.selectedIndustries.indexOf(industry), 1);
		const industryRows = this._elementRef.nativeElement.querySelectorAll('._' + industry.get('industry').id);
		// industry.destroy();
		industryRows.forEach(element => {
			this._renderer.removeStyle(element, 'display');
		});
	}
	
	remove(skill) {
		console.log(skill);
		this.skills.push(skill.get('skill'));
		this.selected.splice(this.selected.indexOf(skill), 1);
		
		const skillRows = this._elementRef.nativeElement.querySelectorAll('._' + skill.get('skill').id);
		// skill.destroy();
		skillRows.forEach(element => {
			this._renderer.removeStyle(element, 'display');
		});
	}
	
	activeSet() {
		this.active = true;
	}
	
	activeUnSet(){
		setTimeout(()=>{this.active = false;}, 400);
	}
	
	activeRolesUnSet(){
		setTimeout(()=>{this.activeForRoles = false;}, 400);
	}
	
	activeIndustriesUnSet(){
		setTimeout(()=>{this.activeForIndustries = false;}, 400);
	}
	
	activeDropdown(name: string){
		if(name === 'skills' && (this.dropdownRolesVisible === true || this.dropdownIndustriesVisible === true)){
			this.dropdownRolesVisible = false;
			this.dropdownIndustriesVisible = false;
		}else if(name === 'roles' && (this.dropdownVisible === true || this.dropdownIndustriesVisible === true)){
			this.dropdownIndustriesVisible = false;
			this.dropdownVisible = false;
		}else if(name === 'industries' && (this.dropdownRolesVisible === true || this.dropdownVisible === true)){
			this.dropdownRolesVisible = false;
			this.dropdownVisible = false;
		}
	}
	
	test() {
		console.log(this.dropdownRolesVisible);
		console.log(this.activeForRoles);
	}
	
	
}
