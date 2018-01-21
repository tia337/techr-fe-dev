import { ElementRef, EventEmitter, TemplateRef, OnInit } from '@angular/core';
/**
 * Angular 2 Mentions.
 * https://github.com/dmacfarlane/angular2-mentions
 *
 * Copyright (c) 2016 Dan MacFarlane
 */
export declare class MentionListComponent implements OnInit {
    private _element;
    labelKey: string;
    itemTemplate: TemplateRef<any>;
    itemClick: EventEmitter<{}>;
    list: ElementRef;
    defaultItemTemplate: TemplateRef<any>;
    items: any[];
    activeIndex: number;
    hidden: boolean;
    constructor(_element: ElementRef);
    ngOnInit(): void;
    position(nativeParentElement: HTMLInputElement, iframe?: HTMLIFrameElement): void;
    readonly activeItem: any;
    activateNextItem(): void;
    activatePreviousItem(): void;
    resetScroll(): void;
}
