/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   graphics.component.ts                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afarapon <afarapon@student.unit.ua>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 18:21:01 by afarapon          #+#    #+#             */
/*   Updated: 2017/12/18 15:35:51 by afarapon         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {
	Component,
	OnDestroy,
	OnInit,
	ViewChild
} from '@angular/core';
import {
	FormControl
} from '@angular/forms';
import {
	ContractInfo,
	GraphicsService
} from './graphics.service';
import {
	Chart
} from 'chart.js';
import {
	SourcesService
} from './sources.service';
import {
	MatSelectChange,
	MatAutocompleteTrigger
} from '@angular/material';
import {
	Observable
} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {
	ChartElement
} from 'chart.js';
import {
	AfterViewInit
} from '@angular/core/src/metadata/lifecycle_hooks';
import {
	Login
} from '../login.service';

@Component({
	selector: 'app-graphics',
	templateUrl: './graphics.component.html',
	styleUrls: ['./graphics.component.scss']
})
export class GraphicsComponent implements OnInit, AfterViewInit, OnDestroy {
	
	colorsArray = [
		'rgba(0, 36, 238, 0.65)',
		'rgba(194, 0, 0, 0.65)',
		'rgba(0, 0, 0, 0.65)',
		'rgba(181, 194, 0, 0.65)',
		'rgba(194, 87, 0, 0.65)',
		'rgba(94, 87, 0, 0.65)',
		'rgba(19, 8, 0, 0.65)',
		'rgba(194, 0, 200, 0.65)',
		'rgba(0, 36, 238, 0.65)',
		'rgba(194, 0, 0, 0.65)',
		'rgba(0, 0, 0, 0.65)',
		'rgba(181, 194, 0, 0.65)',
		'rgba(194, 87, 0, 0.65)',
		'rgba(94, 87, 0, 0.65)',
		'rgba(19, 8, 0, 0.65)',
		'rgba(194, 0, 200, 0.65)'
	];
	currentUser;
	
	skillCtrl: FormControl = new FormControl();
	roleCtrl: FormControl = new FormControl();
	filteredSkills: Observable < string[] > ;
	filteredRoles: Observable < string[] > ;
	
	//  					CHANGE VIEW
	dataSelectedValue = 0;
	dataSource = [{
		value: 0,
		viewValue: 'Aplicant Source'
	},
	{
		value: 1,
		viewValue: 'Job Offered Source'
	},
	{
		value: 2,
		viewValue: 'Hired Source'
	}
];
checkboxValue: boolean;
graphicType = 1;
selectedValue: number;
selectedStyle = 'polarArea';
styles = [{
	value: 0,
	viewValue: 'Polar Area'
},
{
	value: 1,
	viewValue: 'Pie'
}
];
//  					FOR BUTTONS ACTIVE/NOT
isSelected = 90;
unlockButtons = true;

//  					GRAPHIC ARRAYS
names = new Array();
sourceCount: number[] = new Array(); //   for Pie Chart
appTimes: number[] = new Array();
offerTimes: number[] = new Array();
hiredTimes: number[] = new Array();
createdAt: Date[] = new Array();
closed_h: boolean[] = new Array();
closed_o: boolean[] = new Array();
closed_a: boolean[] = new Array();
nameForGrid: any[] = new Array();
contractIds = new Array();
stepSize = 1;
chartOptions;
my1Chart: Chart;
my2Chart: Chart;
my3Chart: Chart;

//  				DATA FOR SKILLS && ROLES
rolesArray = new Array();
skillsArray = new Array();

compareSkill = '';
compareRole = '';
//  				DATA FOR COMPARE
dateForCmp = new Date();

//  				COLORS OF GRAPHIC
hirLineColor = '#65b3b3';
offLineColor = '#3a4240';
appLineColor = '#385a53';

//  				LINE AND COLOR SETTINGS
borderWidth = 1.5;

//          VARS FOR CUSTOMTOOLTIPS
tempArrSk = new Array();
tempArrRl = new Array();
tempArrOwn = new Array();
ind = 0;
colorO = this.colorsArray[this.ind];

tempErps = new Array();
tempEmps = new Array();

private _currentUserSubscription;

constructor(private _graphicService: GraphicsService, private _sourceService: SourcesService, private _login: Login) {
	this.currentUser = _graphicService.getCurrentuser();
	this.graphicType = 1;
	this.checkboxValue = true;
	this.selectedValue = 0;
	this.compareSkill = '';
	this.compareRole = '';
}

//  				KEY SEARCH LISTENERS
keyPressSkill(event) {
	if (event.target != null && event.target !== undefined) {
		this.searchAndUpdate(this.isSelected);
	}
	event.preventDefault();
}
selectClickSkill(event) {
	if (event.target != null && event.target.textContent !== undefined) {
		this.compareSkill = (event.target.textContent as string).trim();
		this.searchAndUpdate(this.isSelected);
	}
	event.preventDefault();
}
keyPressRole(event) {
	if (event.target != null && event.target !== undefined) {
		this.searchAndUpdate(this.isSelected);
	}
	event.preventDefault();
}
selectClickRole(event) {
	if (event.target != null && event.target.textContent !== undefined) {
		this.compareRole = (event.target.textContent as string).trim();
		this.searchAndUpdate(this.isSelected);
	}
	event.preventDefault();
}
loadAndReloadGraphic(val: number) {
	if (this.currentUser) {
		this.graphicType = val;
		const first = document.getElementById('first_graphic');
		const second = document.getElementById('second_graphic');
		const third = document.getElementById('third_graphic');
		if (first && second && third) {
			first.style.position = 'relative';
			second.style.position = 'relative';
			third.style.position = 'relative';
			if (this.graphicType === 1) {
				first.style.display = 'block';
				second.style.display = 'none';
				third.style.display = 'none';
			} else if (this.graphicType === 2) {
				second.style.display = 'block';
				first.style.display = 'none';
				third.style.display = 'none';
			} else if (this.graphicType === 3) {
				third.style.display = 'block';
				first.style.display = 'none';
				second.style.display = 'none';
			}
		}
		this.searchAndUpdate(this.isSelected);
	}
}
ngOnInit() {}
ngAfterViewInit() {
	this.skillCtrl.disable();
	this.roleCtrl.disable();
	const skillsWhen = this._graphicService.getSkillsForError();
	const rolesWhen = this._graphicService.getRoles();
	this._graphicService._parse.Parse.Promise.when(skillsWhen, rolesWhen).then((res1, res2) => {
		this.skillsArray = res1;
		this.rolesArray = res2;
		this.filteredSkills = this.skillCtrl.valueChanges
		.startWith(null)
		.map(skill => {
			if (skill && skill !== '') {
				return skill ? this.filterA(skill) : this.skillsArray.slice();
			}
		});
		this.filteredRoles = this.roleCtrl.valueChanges
		.startWith(null)
		.map(role => {
			if (role && role !== '') {
				return role ? this.filterForRoles(role) : this.rolesArray.slice();
			}
		});
		
		this._currentUserSubscription = this._login.profile.subscribe(profile => {
			this.currentUser = profile;
			if (this.currentUser) {
				this.loadAndReloadGraphic(1);
				this._currentUserSubscription = null;
			}
		});
	});
}
	lookAtTheTops(val: number) {
		const skills = document.getElementById('panelForSkills');
		const roles = document.getElementById('panelForRoles');
		const owners = document.getElementById('panelForOwners');
		turnOffer();
		if (val === 1) {
			skills.style.opacity = '1';
			skills.style.pointerEvents = 'all';
		}
		if (val === 2) {
			roles.style.opacity = '1';
			roles.style.pointerEvents = 'all';
		}
		if (val === 3) {
			owners.style.opacity = '1';
			owners.style.pointerEvents = 'all';
		}
		
		function turnOffer() {
			skills.style.opacity = '0';
			skills.style.pointerEvents = 'none';
			roles.style.opacity = '0';
			roles.style.pointerEvents = 'none';
			owners.style.opacity = '0';
			owners.style.pointerEvents = 'none';
		}
	}
	lookAtTheTopsRC(val: number) {
		const skills = document.getElementById('panelForSkills2');
		const roles = document.getElementById('panelForRoles2');
		const owners = document.getElementById('panelForOwners2');
		let programs;
		let employees;
		if (this.ind === (this.names.length - 1) && this.names[this.names.length - 1] === 'Employee Referral') {
			programs = document.getElementById('panelForPrograms');
			employees = document.getElementById('panelForEmployees');
		}
		turnOffer();
		if (val == 1) {
			skills.style.opacity = '1';
			skills.style.pointerEvents = 'all';
		}
		if (val == 2) {
			roles.style.opacity = '1';
			roles.style.pointerEvents = 'all';
		}
		if (val == 3) {
			owners.style.opacity = '1';
			owners.style.pointerEvents = 'all';
		}
		if (val == 4) {
			programs.style.opacity = '1';
			programs.style.pointerEvents = 'all';
		}
		if (val == 5) {
			employees.style.opacity = '1';
			employees.style.pointerEvents = 'all';
		}
		
		function turnOffer() {
			skills.style.opacity = '0';
			skills.style.pointerEvents = 'none';
			roles.style.opacity = '0';
			roles.style.pointerEvents = 'none';
			owners.style.opacity = '0';
			owners.style.pointerEvents = 'none';
			if (programs != undefined && employees != undefined) {
				programs.style.opacity = '0';
				programs.style.pointerEvents = 'none';
				employees.style.opacity = '0';
				employees.style.pointerEvents = 'none';
			}
		}
	}
	changeView(event) {
		let val = document.getElementById('statsBlock').style;
		if (val.display == 'flex') {
			let skills = document.getElementById('panelForSkills');
			let roles = document.getElementById('panelForRoles');
			let owners = document.getElementById('panelForOwners');
			let employees = document.getElementById('panelForEmployees');
			let programs = document.getElementById('panelForPrograms');
			skills.style.opacity = '0';
			skills.style.pointerEvents = 'none';
			roles.style.opacity = '0';
			roles.style.pointerEvents = 'none';
			owners.style.opacity = '0';
			owners.style.pointerEvents = 'none';
			employees.style.opacity = '0';
			employees.style.pointerEvents = 'none';
			programs.style.opacity = '0';
			programs.style.pointerEvents = 'none';
			val.display = 'none';
		} else {
			val.left = 150 + 'px';
			val.display = 'flex';
			this.ind = this.names.indexOf(document.getElementById('tooltipTitle').innerText.split(':')[0]);
			this.colorO = this.colorsArray[this.ind];
		}
	}
	changeView2(event) {
		const val = document.getElementById('statsBlock2').style;
		if (val.display === 'flex') {
			const skills = document.getElementById('panelForSkills2');
			const roles = document.getElementById('panelForRoles2');
			const owners = document.getElementById('panelForOwners2');
			const employees = document.getElementById('panelForEmployees');
			const programs = document.getElementById('panelForPrograms');
			skills.style.opacity = '0';
			skills.style.pointerEvents = 'none';
			roles.style.opacity = '0';
			roles.style.pointerEvents = 'none';
			owners.style.opacity = '0';
			owners.style.pointerEvents = 'none';
			employees.style.opacity = '0';
			employees.style.pointerEvents = 'none';
			programs.style.opacity = '0';
			programs.style.pointerEvents = 'none';
			val.display = 'none';
		} else {
			val.left = 150 + 'px';
			val.display = 'flex';
			this.ind = this.names.indexOf(document.getElementById('tooltipTitle2').innerText.split(':')[0].trim());
			this.colorO = this.colorsArray[this.ind];
		}
	}
	filterA(val: string): string[] {
		return this.skillsArray.filter(option =>
			option.toLowerCase().indexOf(val.toLowerCase()) >= 0);
	}
	filterForRoles(val: string): string[] {
			return this.rolesArray.filter(role =>
				role.toLowerCase().indexOf(val.toLowerCase()) >= 0);
	}
		//  						GRAPHIC DRAW
		graphicRedrawWithCompare(cmpData: number) {
			this.isSelected = cmpData;
			this.dateForCmp = this.cmpParseDataCalc(cmpData);
			let max = 2;
			this.destroyArrays();
			this.allocArrays();
			if (this.my1Chart != undefined) {
				this.my1Chart.destroy();
			}
			if (this.my2Chart != undefined) {
				this.my2Chart.destroy();
			}
			if (this.my3Chart != undefined) {
				this.my3Chart.destroy();
			}
			if (this.graphicType == 1) {
				this._graphicService.contractsReturn().then((res: ContractInfo[]) => {
					res.forEach(el => {
						if (this.dateForCmp.getTime() <= el.createdAt.getTime() &&
						(el.skills.indexOf(this.compareSkill) >= 0 || this.compareSkill == '') &&
						(el.roles.indexOf(this.compareRole) >= 0 || this.compareRole == '')) {
							this.contractIds.push(el.id);
							this.nameForGrid.push(' ');
							//  			All lets
							this.names.push(el.name);
							this.appTimes.push(el.appTime / 7);
							this.offerTimes.push(el.offerTime / 7);
							this.hiredTimes.push(el.hirTime / 7);
							this.createdAt.push(el.createdAt);
							this.closed_h.push(el.closed_hired);
							if (el.hirTime / 7 > max) {
								max = Math.floor(el.hirTime / 7) + 2;
								if (max > 21) {
									this.stepSize = 2;
								}
								if (max > 40) {
									this.stepSize = 3;
								}
							}
							this.closed_o.push(el.closed_offer);
							this.closed_a.push(el.closed_apply);
						}
					});
					this.nameForGrid[0] = 'Weeks';
					this.forSettingChartLine();
					
					Chart.scaleService.updateScaleDefaults('linear', {
						ticks: {
							min: 0,
							max: max + 2,
							stepSize: this.stepSize
						}
					});
					//   APPLICANT DATA SET (RED[ROSE])
					const aplicant = this.applicantSettings(this.funcPointSettings());
					//   OFFERED DATA SET (YELLOW[ORANGE])
					const offered = this.offeredSettings(this.funcPointSettings());
					//   HIRED DATA SET (GREEN[LIGHTGREEN])
					const hired = this.hiredSettings(this.funcPointSettings());
					//   CHART OPTIONS
					const local_names = this.names;
					const local_closed_h = this.closed_h;
					const local_closed_o = this.closed_o;
					const local_closed_a = this.closed_a;
					const local_created = this.createdAt;
					const plugWithDots = {
						afterDatasetsDraw: (chart, easing) => {
							//   To only draw at the end of animation, check for easing === 1
							const ctx = chart.ctx;
							chart.data.datasets.forEach((dataset, i) => {
								const meta = chart.getDatasetMeta(i);
								if (!meta.hidden && i == 0) {
									meta.data.forEach((element, index) => {
										//   Draw the text in black, with the specified font
										ctx.fillStyle = 'rgb(140, 0, 0)';
										const fontSize = 14;
										const fontStyle = 'normal';
										const fontFamily = 'FontAwesome';
										ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
										//   Just naively convert to string for now
										let dataString: string;
										if (this.closed_h[index] == false) {
											//   data string = new string('0xf06a');
											dataString = String.fromCharCode(0xf111);
										} else {
											dataString = ' ';
										}
										//   Make sure alignment settings are correct
										ctx.textAlign = 'center';
										ctx.textBaseline = 'middle';
										const padding = 10;
										const position = element.tooltipPosition();
										ctx.fillText(dataString, position.x, position.y); //   - (fontSize / 2) - padding);
									});
								}
							});
						}
					};
					this.chartOptions = {
						title: {
							display: false,
						},
						tooltips: {
							titleFontSize: 16,
							enabled: true,
							mode: 'index',
							intersect: false,
							backgroundColor: 'rgba(0, 10, 100, 0.9)',
							callbacks: {
								labelColor: (tooltipItem, chart) => {
									switch (tooltipItem.datasetIndex) {
										case 0:
										return {
											borderColor: this.hirLineColor,
											backgroundColor: this.hirLineColor
										};
										case 1:
										return {
											borderColor: this.offLineColor,
											backgroundColor: this.offLineColor
										}
										case 2:
										return {
											borderColor: this.appLineColor,
											backgroundColor: this.appLineColor
										}
										default:
										return {
											borderColor: 'white',
											backgroundColor: 'gray'
										};
									}
								},
								labelTextColor: function (tooltipItem, chart) {
									tooltipItem.xLabel = local_names[tooltipItem.index];
									if (local_closed_h[tooltipItem.index] === false && tooltipItem.datasetIndex === 0) {
										tooltipItem.yLabel = 'N/A';
									} else if (local_closed_o[tooltipItem.index] === false && tooltipItem.datasetIndex === 1) {
										tooltipItem.yLabel = 'N/A';
									} else if (local_closed_a[tooltipItem.index] === false && tooltipItem.datasetIndex === 2) {
										tooltipItem.yLabel = 'N/A';
									} else {
										tooltipItem.yLabel = Math.floor(parseFloat(tooltipItem.yLabel) * 7);
									}
									return '#fff';
								},
								footer: (arr, data) => {
									return local_created[arr[0].index].toLocaleString();
								},
								label: (tooltipItems, data) => {
									let prefix;
									let suffix;
									
									switch (tooltipItems.datasetIndex) {
										//   '       ' spaces memory
										case 0:
										prefix = 'HLT:       ';
										break;
										case 1:
										prefix = 'JOLT:     ';
										break;
										default:
										prefix = 'ALT:        ';
										break;
									}
									if (this.closed_h[tooltipItems.index] === false && tooltipItems.datasetIndex === 0) {
										suffix = '';
									} else if (this.closed_o[tooltipItems.index] === false && tooltipItems.datasetIndex === 1) {
										suffix = '';
									} else if (this.closed_a[tooltipItems.index] === false && tooltipItems.datasetIndex === 2) {
										suffix = '';
									} else if (Math.floor(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] * 7) === 1) {
										suffix = ' day';
									} else {
										suffix = ' days';
									}
									return prefix + tooltipItems.yLabel + suffix;
								}
							}
						},
						legend: {
							display: true,
							position: 'bottom',
							labels: {
								usePointStyle: true,
								pointStyle: 'point',
								strokeStyle: 'red'
							}
						},
						responsive: true
					};
					if (this.my1Chart !== undefined) {
						this.my1Chart.destroy();
					}
					const canvasOne = < HTMLCanvasElement > document.getElementById('chart1Canv');
					let ctxOne;
					if (canvasOne !== undefined && canvasOne != null) {
						ctxOne = canvasOne.getContext('2d');
					}
					setTimeout(() => {
						this.skillCtrl.enable();
						this.roleCtrl.enable();
						this.unlockButtons = false;
					}, 700);
					this.my1Chart = new Chart(ctxOne, {
						type: 'LineWithLine',
						data: {
							labels: this.nameForGrid,
							datasets: [hired, offered, aplicant]
						},
						plugins: [plugWithDots],
						options: this.chartOptions
					});
				});
			} else if (this.graphicType === 2) {
				const cTooltip = document.getElementById('bestTooltip');
				const panel = document.getElementById('radarArea');
				document.getElementById('bestTooltip').onmouseleave = function (event) {
					this.style.opacity = '0';
					this.style.pointerEvents = 'none';
					const skills = document.getElementById('panelForSkills');
					const roles = document.getElementById('panelForRoles');
					const owners = document.getElementById('panelForOwners');
					skills.style.opacity = '0';
					skills.style.pointerEvents = 'none';
					roles.style.opacity = '0';
					roles.style.pointerEvents = 'none';
					owners.style.opacity = '0';
					owners.style.pointerEvents = 'none';
				};
				document.getElementById('bestTooltip').onmouseenter = function (event) {
					event.stopPropagation();
				};
				document.getElementById('radarArea').onmouseleave = function (event) {
					const tooltip = document.getElementById('bestTooltip');
					tooltip.style.opacity = '0';
					tooltip.style.pointerEvents = 'none';
				};
				const canvasTwo = < HTMLCanvasElement > document.getElementById('chart2Canv');
				let ctxTwo;
				if (canvasTwo !== undefined && canvasTwo != null) {
					ctxTwo = canvasTwo.getContext('2d');
				}
				Chart.scaleService.defaults.radialLinear.ticks.backdropColor = 'rgba(0, 0, 0, 0)';
				if (this.dataSelectedValue === 0) {
					this._sourceService.getAllApplyes(this.dateForCmp, this.compareSkill, this.compareRole).then(sources => {
						sources.forEach(src => {
							this.names.push(src.name);
							this.sourceCount.push(src.count);
							const tmpSrcOwn = src.owner.sort((a, b) => {
								return b.count - a.count;
							});
							this.tempArrOwn.push(tmpSrcOwn);
							
							const tmpSrcRl = src.roles.sort((a, b) => {
								return b.count - a.count;
							});
							this.tempArrRl.push(tmpSrcRl);
							
							const tmpSrcSk = src.skills.sort((a, b) => {
								return b.count - a.count;
							});
							this.tempArrSk.push(tmpSrcSk);
						});
						setTimeout(() => {
							this.skillCtrl.enable();
							this.roleCtrl.enable();
							this.unlockButtons = false;
						}, 700);
						// const canvasTwo = < HTMLCanvasElement > document.getElementById('chart2Canv');
						// let ctxTwo;
						if (canvasTwo !== undefined && canvasTwo != null) {
							ctxTwo = canvasTwo.getContext('2d');
						}
						this.my2Chart = new Chart(ctxTwo, {
							config: {
								plugins: {
									redPointers: false
								}
							},
							type: this.selectedStyle,
							labels: this.names,
							data: {
								datasets: [{
									data: this.sourceCount,
									backgroundColor: [
										'rgba(0, 36, 238, 0.65)',
										'rgba(194, 0, 0, 0.65)',
										'rgba(0, 0, 0, 0.65)',
										'rgba(181, 194, 0, 0.65)',
										'rgba(194, 87, 0, 0.65)',
										'rgba(94, 87, 0, 0.65)',
										'rgba(19, 8, 0, 0.65)',
										'rgba(194, 0, 200, 0.65)',
									]
								}],
								labels: this.names,
							},
							tooltipEvents: ['click'],
							options: {
								title: {
									display: true,
									text: ''
								},
								legend: {
									display: true,
									position: 'right'
								},
								responsive: true,
								tooltips: {
									enabled: false,
									mode: 'point',
									custom: this.aplicantCustomTooltips
								}
							}
						});
					});
				}
				if (this.dataSelectedValue === 1) {
					this._sourceService.getAllOfferedOrHired(this.dateForCmp, 3, this.compareSkill, this.compareRole).then(sources => {
						sources.forEach(src => {
							this.names.push(src.name);
							this.sourceCount.push(src.count);
							const tmpSrcOwn = src.owner.sort((a, b) => {
								return b.count - a.count;
							});
							this.tempArrOwn.push(tmpSrcOwn);
							
							const tmpSrcRl = src.roles.sort((a, b) => {
								return b.count - a.count;
							});
							this.tempArrRl.push(tmpSrcRl);
							
							const tmpSrcSk = src.skills.sort((a, b) => {
								return b.count - a.count;
							});
							
							this.tempArrSk.push(tmpSrcSk);
						});
						setTimeout(() => {
							this.skillCtrl.enable();
							this.roleCtrl.enable();
							this.unlockButtons = false;
						}, 700);
						// const canvasTwo = < HTMLCanvasElement > document.getElementById('chart2Canv');
						// let ctxTwo;
						if (canvasTwo !== undefined && canvasTwo != null) {
							ctxTwo = canvasTwo.getContext('2d');
						}
						this.my2Chart = new Chart(ctxTwo, {
							config: {
								plugins: {
									redPointers: false
								}
							},
							type: this.selectedStyle,
							labels: this.names,
							data: {
								datasets: [{
									data: this.sourceCount,
									backgroundColor: [
										'rgba(0, 36, 238, 0.65)',
										'rgba(194, 0, 0, 0.65)',
										'rgba(0, 0, 0, 0.65)',
										'rgba(181, 194, 0, 0.65)',
										'rgba(194, 87, 0, 0.65)',
										'rgba(94, 87, 0, 0.65)',
										'rgba(19, 8, 0, 0.65)',
										'rgba(194, 0, 200, 0.65)'
									]
								}],
								labels: this.names,
							},
							options: {
								title: {
									display: true,
									text: ''
								},
								legend: {
									display: true,
									position: 'right'
								},
								responsive: true,
								tooltips: {
									enabled: false,
									mode: 'point',
									custom: this.forOfferedCustomTooltips
								}
							}
						});
					});
				}
				if (this.dataSelectedValue === 2) {
					this._sourceService.getAllOfferedOrHired(this.dateForCmp, 4, this.compareSkill, this.compareRole).then(sources => {
						sources.forEach(src => {
							this.names.push(src.name);
							this.sourceCount.push(src.count);
							const tmpSrcOwn = src.owner.sort((a, b) => {
								return b.count - a.count;
							});
							this.tempArrOwn.push(tmpSrcOwn);
							
							const tmpSrcRl = src.roles.sort((a, b) => {
								return b.count - a.count;
							});
							this.tempArrRl.push(tmpSrcRl);
							
							const tmpSrcSk = src.skills.sort((a, b) => {
								return b.count - a.count;
							});
							this.tempArrSk.push(tmpSrcSk);
						});
						setTimeout(() => {
							this.skillCtrl.enable();
							this.roleCtrl.enable();
							this.unlockButtons = false;
						}, 700);
						// const canvasTwo = < HTMLCanvasElement > document.getElementById('chart2Canv');
						// let ctxTwo;
						if (canvasTwo != undefined && canvasTwo != null) {
							ctxTwo = canvasTwo.getContext('2d');
						}
						this.my2Chart = new Chart(ctxTwo, {
							config: {
								plugins: {
									redPointers: false
								}
							},
							type: this.selectedStyle,
							labels: this.names,
							data: {
								datasets: [{
									data: this.sourceCount,
									backgroundColor: [
										'rgba(0, 36, 238, 0.65)',
										'rgba(194, 0, 0, 0.65)',
										'rgba(0, 0, 0, 0.65)',
										'rgba(181, 194, 0, 0.65)',
										'rgba(194, 87, 0, 0.65)',
										'rgba(94, 87, 0, 0.65)',
										'rgba(19, 8, 0, 0.65)',
										'rgba(194, 0, 200, 0.65)'
									]
								}],
								labels: this.names,
							},
							options: {
								title: {
									display: true,
									text: ''
								},
								legend: {
									display: true,
									position: 'right'
								},
								responsive: true,
								tooltips: {
									enabled: false,
									mode: 'point',
									custom: this.forHiredCustomTooltips
								}
							}
						});
					});
				}
			} else if (this.graphicType === 3) {
				//   let cTooltip = document.getElementById('bestTooltip2');
				document.getElementById('bestTooltip2').onmouseleave = function (event) {
					this.style.opacity = '0';
					this.style.pointerEvents = 'none';
					const skills = document.getElementById('panelForSkills2');
					const roles = document.getElementById('panelForRoles2');
					const employees = document.getElementById('panelForEmployees');
					const programs = document.getElementById('panelForPrograms');
					const owners = document.getElementById('panelForOwners2')
					employees.style.opacity = '0';
					employees.style.pointerEvents = 'none';
					programs.style.opacity = '0';
					programs.style.pointerEvents = 'none';
					skills.style.opacity = '0';
					skills.style.pointerEvents = 'none';
					roles.style.opacity = '0';
					roles.style.pointerEvents = 'none';
					owners.style.opacity = '0';
					owners.style.pointerEvents = 'none';
				};
				document.getElementById('bestTooltip2').onmouseenter = function (event) {
					event.stopPropagation();
				};
				document.getElementById('radarArea2').onmouseleave = function (event) {
					const tooltip = document.getElementById('bestTooltip2');
					tooltip.style.opacity = '0';
					tooltip.style.pointerEvents = 'none';
				};
				const canvasTwo = < HTMLCanvasElement > document.getElementById('chart3Canv');
				let ctxTwo;
				if (canvasTwo !== undefined && canvasTwo != null) {
					ctxTwo = canvasTwo.getContext('2d');
				}
				Chart.scaleService.defaults.radialLinear.ticks.backdropColor = 'rgba(0, 0, 0, 0)';
				if (this.dataSelectedValue === 0) {
					this._sourceService.getAllApplyesRC(this.dateForCmp, this.compareSkill, this.compareRole).then(sources => {
						sources.forEach(src => {
							this.names.push(src.name);
							this.sourceCount.push(src.count);
							const tmpSrcOwn = src.owner.sort((a, b) => {
								return b.count - a.count;
							});
							this.tempArrOwn.push(tmpSrcOwn);
							
							const tmpSrcRl = src.roles.sort((a, b) => {
								return b.count - a.count;
							});
							this.tempArrRl.push(tmpSrcRl);
							
							const tmpSrcSk = src.skills.sort((a, b) => {
								return b.count - a.count;
							});
							this.tempArrSk.push(tmpSrcSk);
						});
						setTimeout(() => {
							this.skillCtrl.enable();
							this.roleCtrl.enable();
							this.unlockButtons = false;
						}, 700);
						// const canvasTwo = < HTMLCanvasElement > document.getElementById('chart3Canv');
						// let ctxTwo;
						if (canvasTwo != undefined && canvasTwo != null) {
							ctxTwo = canvasTwo.getContext('2d');
						}
						this.my2Chart = new Chart(ctxTwo, {
							config: {
								plugins: {
									redPointers: false
								}
							},
							type: this.selectedStyle,
							labels: this.names,
							data: {
								datasets: [{
									data: this.sourceCount,
									backgroundColor: [
										'rgba(0, 36, 238, 0.65)',
										'rgba(194, 0, 0, 0.65)',
										'rgba(0, 0, 0, 0.65)',
										'rgba(181, 194, 0, 0.65)',
										'rgba(194, 87, 0, 0.65)',
										'rgba(94, 87, 0, 0.65)',
										'rgba(19, 8, 0, 0.65)',
										'rgba(194, 0, 200, 0.65)',
									]
								}],
								labels: this.names,
							},
							tooltipEvents: ['click'],
							options: {
								title: {
									display: true,
									text: ''
								},
								legend: {
									display: true,
									position: 'right'
								},
								responsive: true,
								tooltips: {
									enabled: false,
									mode: 'point',
									custom: this.aplicantCustomTooltipsRC
								}
							}
						});
					});
				}
				if (this.dataSelectedValue === 1) {
					this._sourceService.getAllOfferedOrHiredRC(this.dateForCmp, 3, this.compareSkill, this.compareRole).then(sources => {
						if (sources[sources.length - 1].name === 'Employee Referral' && sources[sources.length - 1].count === 0) {
							sources.pop();
						}
						sources.forEach(src => {
							this.names.push(src.name);
							this.sourceCount.push(src.count);
							const tmpSrcOwn = src.owner.sort((a, b) => {
								return b.count - a.count;
							});
							this.tempArrOwn.push(tmpSrcOwn);
							
							const tmpSrcRl = src.roles.sort((a, b) => {
								return b.count - a.count;
							});
							this.tempArrRl.push(tmpSrcRl);
							
							const tmpSrcSk = src.skills.sort((a, b) => {
								return b.count - a.count;
							});
							this.tempArrSk.push(tmpSrcSk);
						});
						console.log(sources);
						if (sources[sources.length - 1].name === 'Employee Referral' && sources[sources.length - 1].count > 0) {
							this.tempEmps = sources[sources.length - 1].emps;
							this.tempErps = sources[sources.length - 1].erps;
						}
						setTimeout(() => {
							this.skillCtrl.enable();
							this.roleCtrl.enable();
							this.unlockButtons = false;
						}, 700);
						// const canvasTwo = < HTMLCanvasElement > document.getElementById('chart3Canv');
						// let ctxTwo;
						if (canvasTwo !== undefined && canvasTwo != null) {
							ctxTwo = canvasTwo.getContext('2d');
						}
						this.my2Chart = new Chart(ctxTwo, {
							config: {
								plugins: {
									redPointers: false
								}
							},
							type: this.selectedStyle,
							labels: this.names,
							data: {
								datasets: [{
									data: this.sourceCount,
									backgroundColor: [
										'rgba(0, 36, 238, 0.65)',
										'rgba(194, 0, 0, 0.65)',
										'rgba(0, 0, 0, 0.65)',
										'rgba(181, 194, 0, 0.65)',
										'rgba(194, 87, 0, 0.65)',
										'rgba(94, 87, 0, 0.65)',
										'rgba(19, 8, 0, 0.65)',
										'rgba(194, 0, 200, 0.65)'
									]
								}],
								labels: this.names,
							},
							options: {
								title: {
									display: true,
									text: ''
								},
								legend: {
									display: true,
									position: 'right'
								},
								responsive: true,
								tooltips: {
									enabled: false,
									mode: 'point',
									custom: this.forOfferedCustomTooltipsRC
								}
							}
						});
					});
				}
				if (this.dataSelectedValue === 2) {
					this._sourceService.getAllOfferedOrHiredRC(this.dateForCmp, 4, this.compareSkill, this.compareRole).then(sources => {
						if (sources[sources.length - 1].name === 'Employee Referral' && sources[sources.length - 1].count === 0) {
							sources.pop();
						}
						sources.forEach(src => {
							this.names.push(src.name);
							this.sourceCount.push(src.count);
							const tmpSrcOwn = src.owner.sort((a, b) => {
								return b.count - a.count;
							});
							this.tempArrOwn.push(tmpSrcOwn);
							
							const tmpSrcRl = src.roles.sort((a, b) => {
								return b.count - a.count;
							});
							this.tempArrRl.push(tmpSrcRl);
							
							const tmpSrcSk = src.skills.sort((a, b) => {
								return b.count - a.count;
							});
							this.tempArrSk.push(tmpSrcSk);
						});
						if (sources[sources.length - 1].name === 'Employee Referral' && sources[sources.length - 1].count > 0) {
							this.tempEmps = sources[sources.length - 1].emps;
							this.tempErps = sources[sources.length - 1].erps;
						}
						setTimeout(() => {
							this.skillCtrl.enable();
							this.roleCtrl.enable();
							this.unlockButtons = false;
						}, 700);
						// const canvasTwo = < HTMLCanvasElement > document.getElementById('chart3Canv');
						// let ctxTwo;
						if (canvasTwo !== undefined && canvasTwo != null) {
							ctxTwo = canvasTwo.getContext('2d');
						}
						this.my2Chart = new Chart(ctxTwo, {
							config: {
								plugins: {
									redPointers: false
								}
							},
							type: this.selectedStyle,
							labels: this.names,
							data: {
								datasets: [{
									data: this.sourceCount,
									backgroundColor: [
										'rgba(0, 36, 238, 0.65)',
										'rgba(194, 0, 0, 0.65)',
										'rgba(0, 0, 0, 0.65)',
										'rgba(181, 194, 0, 0.65)',
										'rgba(194, 87, 0, 0.65)',
										'rgba(94, 87, 0, 0.65)',
										'rgba(19, 8, 0, 0.65)',
										'rgba(194, 0, 200, 0.65)'
									]
								}],
								labels: this.names,
							},
							options: {
								title: {
									display: true,
									text: ''
								},
								legend: {
									display: true,
									position: 'right'
								},
								responsive: true,
								tooltips: {
									enabled: false,
									mode: 'point',
									custom: this.forHiredCustomTooltipsRC
								}
							}
						});
					});
					setTimeout(() => {
						this.skillCtrl.enable();
						this.roleCtrl.enable();
						this.unlockButtons = false;
					}, 700);
				}
			}
		}
		searchAndUpdate(num: number) {
			if (this._graphicService.getCurrentuser() !== undefined) {
				if (this.skillCtrl.value != null) {
					this.compareSkill = this.skillCtrl.value;
				}
				if (this.roleCtrl.value != null) {
					this.compareRole = this.roleCtrl.value;
				}
				this.isSelected = num;
				this.skillCtrl.disable();
				this.roleCtrl.disable();
				this.unlockButtons = true;
				this.graphicRedrawWithCompare(this.isSelected);
			}
		}
		//  						CHART OPTIONS
		changeDataForRound(event: MatSelectChange) {
			this.dataSelectedValue = event.value;
			this.searchAndUpdate(this.isSelected);
		}
		applicantSettings(pointSettings) {
			return {
				label: 'Applicant Lead time',
				data: this.appTimes,
				borderColor: [
					this.appLineColor
				],
				backgroundColor: [
					this.appLineColor
				],
				pointBackgroundColor: '#FFF',
				pointHoverRadius: pointSettings.pointHoverRadius,
				pointHoverBorderColor: this.appLineColor,
				pointHitRadius: pointSettings.pointHitRadius,
				pointBorderWidth: pointSettings.pointBorderWidth,
				fill: pointSettings.fill,
				borderWidth: pointSettings.borderWidth,
				pointRadius: pointSettings.pointRadius,
				lineTension: pointSettings.lineTension
			};
		}
		offeredSettings(pointSettings) {
			return {
				label: 'Job Offer Lead time',
				data: this.offerTimes,
				borderColor: [
					this.offLineColor
				],
				backgroundColor: [
					this.offLineColor
				],
				pointBackgroundColor: '#FFF',
				pointHoverRadius: pointSettings.pointHoverRadius,
				pointHoverBorderColor: this.offLineColor,
				pointHitRadius: pointSettings.pointHitRadius,
				pointBorderWidth: pointSettings.pointBorderWidth,
				fill: pointSettings.fill,
				borderWidth: pointSettings.borderWidth,
				pointRadius: pointSettings.pointRadius,
				lineTension: pointSettings.lineTension,
			};
		}
		hiredSettings(pointSettings) {
			return {
				label: 'Hiring Lead time',
				data: this.hiredTimes,
				borderColor: [
					this.hirLineColor
				],
				backgroundColor: [
					this.hirLineColor
				],
				pointBackgroundColor: '#FFF',
				pointHoverRadius: pointSettings.pointHoverRadius,
				pointHoverBorderColor: this.hirLineColor,
				pointHitRadius: pointSettings.pointHitRadius,
				pointBorderWidth: pointSettings.pointBorderWidth,
				fill: pointSettings.fill,
				borderWidth: pointSettings.borderWidth,
				pointRadius: pointSettings.pointRadius,
				lineTension: pointSettings.lineTension,
			};
		}
		forSettingChartLine() {
			Chart.defaults.global.defaultFontFamily = 'Comfortaa';
			Chart.defaults.LineWithLine = Chart.defaults.line;
			Chart.controllers.LineWithLine = Chart.controllers.line.extend({
				draw: function (ease) {
					Chart.controllers.line.prototype.draw.call(this, ease);
					if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
						const activePoint = this.chart.tooltip._active[0],
						ctx = this.chart.ctx,
						x = activePoint.tooltipPosition().x,
						topY = this.chart.scales['y-axis-0'].top,
						bottomY = this.chart.scales['y-axis-0'].bottom;
						
						//   draw line
						ctx.save();
						ctx.beginPath();
						ctx.moveTo(x, topY);
						ctx.lineTo(x, bottomY);
						ctx.lineWidth = 2;
						ctx.strokeStyle = '#8c8c8c';
						ctx.stroke();
						ctx.restore();
					}
				}
			});
		}
		funcPointSettings() {
			return {
				fill: false,
				pointHoverRadius: 5,
				pointHitRadius: 4,
				pointBorderWidth: 1.5,
				borderWidth: this.borderWidth,
				pointRadius: 3,
				lineTension: 0,
			};
		}
		
		//  						SERVICE FUNCTIONS
		allocArrays() {
			this.contractIds = new Array();
			this.names = new Array();
			this.appTimes = new Array();
			this.offerTimes = new Array();
			this.hiredTimes = new Array();
			this.createdAt = new Array();
			this.closed_h = new Array();
			this.closed_o = new Array();
			this.closed_a = new Array();
			this.nameForGrid = new Array();
			this.sourceCount = new Array();
			this.tempArrSk = new Array();
			this.tempArrRl = new Array();
			this.tempArrOwn = new Array();
		}
		destroyArrays() {
			this.contractIds = null;
			this.names = null;
			this.appTimes = null;
			this.offerTimes = null;
			this.hiredTimes = null;
			this.createdAt = null;
			this.closed_h = null;
			this.closed_o = null;
			this.closed_a = null;
			this.nameForGrid = null;
			this.sourceCount = null;
			this.tempArrSk = null;
			this.tempArrRl = null;
			this.tempArrOwn = null;
		}
		cmpParseDataCalc(cmp: number) {
			let dateCmp = new Date();
			switch (cmp) {
				case 7:
				dateCmp.setDate(dateCmp.getDate() - 7);
				break;
				case 30:
				dateCmp.setMonth(dateCmp.getMonth() - 1);
				break;
				case 90:
				dateCmp.setMonth(dateCmp.getMonth() - 3);
				break;
				case 180:
				dateCmp.setMonth(dateCmp.getMonth() - 6);
				break;
				case 111:
				dateCmp.setMonth(dateCmp.getMonth() - 12);
				break;
				case 555:
				dateCmp.setFullYear(dateCmp.getFullYear() - 5);
				break;
				default:
				dateCmp = new Date(2000, 1, 1, 1, 1, 1, 1);
				break;
			}
			return dateCmp;
		}
		changeRoundChartStyle(event: MatSelectChange) {
			if (event.value === 1) {
				this.selectedStyle = 'pie';
			} else if (event.value === 0) {
				this.selectedStyle = 'polarArea';
			}
			this.searchAndUpdate(this.isSelected);
		}
		
		//  					CUSTOM TOOLTIPS FOR EACH CHART
		
		aplicantCustomTooltips = function (tooltip) {
			function getLines(body) {
				return body.lines;
			}
			document.getElementById('statsBlock').style.display = 'none';
			const cTooltip = document.getElementById('bestTooltip');
			const title = document.getElementById('tooltipTitle');
			
			cTooltip.style.pointerEvents = 'all';
			cTooltip.classList.remove('above', 'below', 'no-transform');
			if (tooltip.yAlign) {
				cTooltip.classList.add(tooltip.yAlign);
			} else {
				cTooltip.classList.add('no-transform');
			}
			if (tooltip.body !== undefined) {
				title.innerText = tooltip.body.map(getLines) + ' applied';
			}
			cTooltip.style.opacity = '1';
			this.avalaible = false;
			cTooltip.style.left = this._eventPosition.x + 50 + 'px';
			cTooltip.style.top = this._eventPosition.y + 'px';
		}
		forOfferedCustomTooltips = function (tooltip) {
			function getLines(body) {
				return body.lines;
			}
			if (document.getElementById('statsBlock')) {
				document.getElementById('statsBlock').style.display = 'none';
			}
			const cTooltip = document.getElementById('bestTooltip');
			const title = document.getElementById('tooltipTitle');
			cTooltip.style.pointerEvents = 'all';
			cTooltip.classList.remove('above', 'below', 'no-transform');
			if (tooltip.yAlign) {
				cTooltip.classList.add(tooltip.yAlign);
			} else {
				cTooltip.classList.add('no-transform');
			}
			if (tooltip.body !== undefined) {
				title.innerText = tooltip.body.map(getLines) + ' offered';
			}
			cTooltip.style.opacity = '1';
			this.avalaible = false;
			cTooltip.style.left = this._eventPosition.x + 50 + 'px';
			cTooltip.style.top = this._eventPosition.y + 'px';
		}
		forHiredCustomTooltips = function (tooltip) {
			function getLines(body) {
				return body.lines;
			}
			document.getElementById('statsBlock').style.display = 'none';
			const cTooltip = document.getElementById('bestTooltip');
			const title = document.getElementById('tooltipTitle');
			cTooltip.style.pointerEvents = 'all';
			cTooltip.classList.remove('above', 'below', 'no-transform');
			if (tooltip.yAlign) {
				cTooltip.classList.add(tooltip.yAlign);
			} else {
				cTooltip.classList.add('no-transform');
			}
			if (tooltip.body !== undefined) {
				title.innerText = tooltip.body.map(getLines) + ' hired';
			}
			cTooltip.style.opacity = '1';
			this.avalaible = false;
			cTooltip.style.left = this._eventPosition.x + 50 + 'px';
			cTooltip.style.top = this._eventPosition.y + 'px';
		}
		aplicantCustomTooltipsRC = function (tooltip) {
			function getLines(body) {
				return body.lines;
			}
			document.getElementById('statsBlock2').style.display = 'none';
			const cTooltip = document.getElementById('bestTooltip2');
			const title = document.getElementById('tooltipTitle2');
			
			cTooltip.style.pointerEvents = 'all';
			cTooltip.classList.remove('above', 'below', 'no-transform');
			if (tooltip.yAlign) {
				cTooltip.classList.add(tooltip.yAlign);
			} else {
				cTooltip.classList.add('no-transform');
			}
			if (tooltip.body !== undefined) {
				title.innerText = tooltip.body.map(getLines) + ' applied';
			}
			cTooltip.style.opacity = '1';
			this.avalaible = false;
			cTooltip.style.left = this._eventPosition.x + 50 + 'px';
			cTooltip.style.top = this._eventPosition.y + 'px';
		}
		forOfferedCustomTooltipsRC = function (tooltip) {
			function getLines(body) {
				return body.lines;
			}
			document.getElementById('statsBlock2').style.display = 'none';
			const cTooltip = document.getElementById('bestTooltip2');
			const title = document.getElementById('tooltipTitle2');
			cTooltip.style.pointerEvents = 'all';
			cTooltip.classList.remove('above', 'below', 'no-transform');
			if (tooltip.yAlign) {
				cTooltip.classList.add(tooltip.yAlign);
			} else {
				cTooltip.classList.add('no-transform');
			}
			if (tooltip.body !== undefined) {
				title.innerText = tooltip.body.map(getLines) + ' offered';
			}
			cTooltip.style.opacity = '1';
			this.avalaible = false;
			cTooltip.style.left = this._eventPosition.x + 50 + 'px';
			cTooltip.style.top = this._eventPosition.y + 'px';
		};
		forHiredCustomTooltipsRC = function (tooltip) {
			function getLines(body) {
				return body.lines;
			}
			document.getElementById('statsBlock2').style.display = 'none';
			const cTooltip = document.getElementById('bestTooltip2');
			const title = document.getElementById('tooltipTitle2');
			cTooltip.style.pointerEvents = 'all';
			cTooltip.classList.remove('above', 'below', 'no-transform');
			if (tooltip.yAlign) {
				cTooltip.classList.add(tooltip.yAlign);
			} else {
				cTooltip.classList.add('no-transform');
			}
			if (tooltip.body !== undefined) {
				title.innerText = tooltip.body.map(getLines) + ' hired';
			}
			cTooltip.style.opacity = '1';
			this.avalaible = false;
			cTooltip.style.left = this._eventPosition.x + 50 + 'px';
			cTooltip.style.top = this._eventPosition.y + 'px';
		};
		
		ngOnDestroy() {
			if (this._currentUserSubscription) {
				this._currentUserSubscription.unsubscribe();
			}
		}
		clearButton(val) {
			if (val === 1) {
				this.compareSkill = '';
				this.skillCtrl.reset();
				this.loadAndReloadGraphic(this.graphicType);
			} else if (val === 2) {
				this.compareRole = '';
				this.roleCtrl.reset();
				this.loadAndReloadGraphic(this.graphicType);
			}
		}
	}
	