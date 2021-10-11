// noinspection JSUnusedGlobalSymbols

import {Dispatch, SetStateAction} from "react";
import Config from "../config";

const $cl = console.log;

declare global {
	interface String {
		replaceFull(s: V, t: V): string
		vacuum(): string
		spaceTrim(): string
		ucFirst(): string
		format(vs: FV|Array<V>): string
		getAmountOf(s: V): number
		toRandomCase(): string
		reverse(): string
		toggle(fV: V, sV: V): string
	}
	interface Array<T> {
		for(c: (v: T, i: number) => void): void
		forMap<U>(c: (v: T, i: number) => U): Array<U>
	}
}

type Matrix = Array<Array<number>>;
type V = string | number;
type CustomElement = JSX.Element;
type CustomJSX = CustomElement | null;
type CustomJSXs = CustomJSX | Array<CustomJSX>;
type SetState<T> = Dispatch<SetStateAction<T>>;

Array.prototype.for = function<T>(c:(v:T,i:number)=>T):void{let i:number=0;for(;i<this.length;)c(this[i],i++)};
Array.prototype.forMap = function<U,T>(c:(v:T,index:number)=>U):Array<U>{let i:number=0,n:Array<U>=[];for(;i<this.length;)n[i]=c(this[i],i++);return n};

String.prototype.replaceFull = function(search: V, to: V): string {
	let value: string = this.toString(); search = search.toString(); to = to.toString();
	if(to.includes(search)) return value;
	let regexp: RegExp = new RegExp(search, "g");
	for(;;) {value = value.replace(regexp, to); if(!value.includes(search)) return value;}
};

String.prototype.vacuum = function(): string {
	return this.replace(/\s/g, "");
};

String.prototype.spaceTrim = function(): string {
	return this.trim().replace(/[\f\r\v\u00A0\u2028\u2029]/g, "").replaceFull("\n\n\n", "\n\n").replace(/\t/g, " ").replaceFull("  ", " ").replace(/^ /gm, "").replace(/ $/gm, "");
};

String.prototype.ucFirst = function(): string {
	return this && this[0].toUpperCase()+this.substring(1);
};

String.prototype.getAmountOf = function(search: V): number {
	return (this.match(new RegExp(escapeRegexpOperators(search.toString()), "g"))||[]).length;
};

interface FV {[key: string]: any}

String.prototype.format = function(values: FV|Array<V>): string {
	let params: FV = (values instanceof Array ? {...values} : values) as FV, value: string = this.toString();
	Array.from(new Set(value.match(/(?<={)(\d+|[a-z_][a-z_\d]*)(?=})/gi))).for(parameter => {
		if(/^\d+$/.test(parameter)) parameter = Number(parameter).toString();
		value = value.replace(new RegExp(`\\{${parameter}\\}`, "g"), params[parameter].toString());
	});
	return value;
};

String.prototype.toRandomCase = function(): string {
	let i: number = 0, value: string = this.toString(), result: string = "";
	for(; i < this.length; i++) {if(getRandomBoolean()) result += value[i].toUpperCase(); else result += value[i].toLowerCase();}
	return result;
};

String.prototype.reverse = function(): string {
	return this.split("").reverse().join("");
};

String.prototype.toggle = function(firstValue: V, secondValue: V): string {
	return this.replace(new RegExp(escapeRegexpOperators(firstValue.toString()), "g"), "%TOGGLE%").replace(new RegExp(escapeRegexpOperators(secondValue.toString()), "g"), firstValue.toString()).replace(new RegExp("%TOGGLE%", "g"), secondValue.toString());
};

function escapeRegexpOperators(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

let prevRandom: number;
function getRandomInt(min: number, max: number): number {
	let random: number; for(;;) {random = ~~(Math.random()*(1+max-min)+min); if(max-1 === min || prevRandom !== random) return prevRandom = random;}
}

enum HashType {
	H,
	P
}

function getRandomHash(length: number = 5, type: HashType = HashType.H): string {
	let value: string = "", symbols: string = Config.SHS;
	if(type === HashType.P) {symbols += Config.SSS; if(length < Config.MPL) length = Config.MPL;}
	let i: number = 0; for(; i < length; i++) value += symbols[getRandomInt(0, symbols.length-1)];
	return value;
}

function getRandomBoolean(): boolean {
	return Boolean(~~(Math.random()*2));
}

function isEmpty(value: any): boolean {
	return value === undefined || value === null || typeof value === "number" && isNaN(value);
}

function sleep(ms: number): Promise<void> {
	return new Promise<void>(resolve => setTimeout(resolve, ms));
}

function isClient(): boolean {
	return !isServer();
}

function isServer(): boolean {
	return !globalThis.window;
}

function isDevelopment(): boolean {
	return !isProduction();
}

function isProduction(): boolean {
	return process.env.NODE_ENV === "production";
}

interface Events {
	[event: string]: Array<() => void>
}

let events: Events = {};
function subscribeToWindowEvent(event: string, callback: (event?: any) => void): void {
	if(!events[event]) events[event] = [];
	events[event].push(callback);
	window.addEventListener(event, callback);
}

function unsubscribeFromWindowEvents(): void {
	Object.keys(events).for(event => events[event].for(callback => window.removeEventListener(event, callback)));
}

class OutputStream {
	private _value: string = "";

	get value(): string {
		return this._value;
	}

	set value(newValue: string) {
		this._value += this._value?`\n${newValue}`:newValue;
	}
}

function copyObject<T>(object: T): T {
	return JSON.parse(JSON.stringify(object));
}

enum MatrixDirection {
	LINE,
	COLUMN
}

function replaceMatrix(matrix: Matrix, direction: MatrixDirection, index: number, value: number): Matrix {
	console.error(matrix)
	if(direction === MatrixDirection.LINE) {
		let newMatrix: Matrix = [], i: number;
		let newLine: Array<number> = [];
		matrix[0].for(() => newLine.push(value));
		for(i = 0; i < matrix.length; i++) {
			newMatrix.push(i === index ? newLine: matrix[i]);
		}

		console.warn(newMatrix)
		return newMatrix;
	} else {
		let len: number = matrix[0].length;
		let newMatrix: Matrix = [], i: number, j: number;
		for(i = 0; i < matrix.length; i++) {
			let newLine: Array<number> = [];
			for(j = 0; j < len; j++) {
				if(j === index) newLine.push(value);
				else newLine.push(matrix[i][j]);
			}
			newMatrix.push(newLine);
		}
		console.warn(newMatrix)
		return newMatrix;
	}
}

function cutMatrix(matrix: Matrix, direction: MatrixDirection, index: number): Matrix {
	if(direction === MatrixDirection.LINE) {
		matrix.splice(index, 1);
		return typeof matrix[0] === "undefined" ? [[]] : matrix;
	} else {
		let len: number = matrix[0].length;
		let newMatrix: Matrix = [], i: number, j: number;
		for(i = 0; i < matrix.length; i++) {
			let newLine: Array<number> = [];
			for(j = 0; j < len; j++) if(j !== index) newLine.push(matrix[i][j]);
			newMatrix.push(newLine);
		}
		return typeof newMatrix[0] === "undefined" ? [[]] : newMatrix;
	}
}

export {HashType};
export {
	getRandomInt,
	getRandomHash,
	getRandomBoolean,
	isEmpty,
	sleep,
	isClient,
	isServer,
	isDevelopment,
	isProduction,
	subscribeToWindowEvent,
	unsubscribeFromWindowEvents,
	cutMatrix,
	replaceMatrix,
	copyObject,
	MatrixDirection,
	OutputStream,
	$cl
};
export type {CustomElement, CustomJSX, CustomJSXs, SetState, Matrix};