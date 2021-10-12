import {
	copyObject,
	CustomElement,
	CustomJSX,
	cutMatrix,
	MatrixDirection,
	OutputStream,
	SetState
} from "../../modules/utils";
import {useEffect, useState} from "react";
import {Loading} from "../../components/loading";
import Head from "next/head";
import Config from "../../config";
import {GoBack} from "../../components/goBack";

const execute = (setContent: SetState<CustomJSX>) => {
	Promise.all([
		new Promise<CustomJSX>(resolve => {
			const output: OutputStream = new OutputStream();

			const globalMatrix: Matrix = [
				[1,3,3,8],
				[8,6,2,6],
				[7,7,3,8],
				[5,2,4,5]
			]

			const globalStores: Array<number> = [20,20,40,45];
			const globalTakers: Array<number> = [25,30,40,15];

			type Matrix = Array<Array<number>>;

			interface MethodResult {
				methodName: string
				result: number
			}

			interface Fine {
				direction: MatrixDirection
				minX: number
				minY: number
				value: number
				minValue: number
			}

			const storesSum: number = globalStores.reduce((acc, item) => acc += item);
			const takersSum: number = globalTakers.reduce((acc, item) => acc += item);

			if(storesSum-takersSum > 0) {
				globalMatrix.forEach(arr => arr.push(0));
				globalTakers.push(storesSum-takersSum);
			} else if(storesSum-takersSum < 0) {
				let newLine: Array<number> = [], i: number;
				for(i = 0; i < globalMatrix[0].length; i++) newLine.push(0);
				globalMatrix.push(newLine);
				globalStores.push(takersSum-storesSum);
			}

			interface TransactionProps {
				matrix: Matrix
				stores: Array<number>
				takers: Array<number>
				x?: number
				y?: number
			}

			function executeTransaction({matrix, stores, takers, x = 0, y = 0}: TransactionProps): [number, Matrix] {
				let targetItem: number = matrix[y][x];
				let storeAmount: number = stores[y];
				let requiredAmount: number = takers[x];
				let transitAmount: number;
				if(storeAmount > requiredAmount) {
					transitAmount = requiredAmount;
					stores[y] = storeAmount-requiredAmount;
					takers.splice(x, 1);
					matrix = cutMatrix(matrix, MatrixDirection.COLUMN, x);
				} else {
					transitAmount = storeAmount;
					takers[x] = requiredAmount-storeAmount;
					stores.splice(y, 1);
					matrix = cutMatrix(matrix, MatrixDirection.LINE, y);
					if(!takers[x]) {
						takers.splice(x, 1);
						matrix = cutMatrix(matrix, MatrixDirection.COLUMN, x);
					}
				}
				output.value = "   " + targetItem + "*" + transitAmount;
				return [targetItem*transitAmount, matrix];
			}

			function getMethodResult_1(): MethodResult {
				let methodName: string = "the northwest bridge method";
				let matrix: Matrix = copyObject(globalMatrix);
				let takers: Array<number> = copyObject(globalTakers);
				let stores: Array<number> = copyObject(globalStores);
				let history: Array<number> = [];
				output.value = `1. First method - ${methodName}:`;
				do {
					let [cost, newMatrix] = executeTransaction({matrix, stores, takers});
					history.push(cost);
					matrix = newMatrix;
				} while(typeof matrix[0][0] === "number");
				let result: number = history.reduce((acc, item) => acc += item);
				output.value = "   As a result, " + result + " conventional units were required.";
				return {methodName, result};
			}

			function getMethodResult_2(): MethodResult {
				let methodName: string = "the least cost method";
				let matrix: Matrix = copyObject(globalMatrix);
				let takers: Array<number> = copyObject(globalTakers);
				let stores: Array<number> = copyObject(globalStores);
				let history: Array<number> = [];
				output.value = `\n2. Second method - ${methodName}:`;
				do {
					let i: number;
					let column: Array<number> = [];
					for(i = 0; i < matrix.length; i++) column.push(matrix[i][0]);
					let [cost, newMatrix] = executeTransaction({
						matrix,
						stores,
						takers,
						y: column.indexOf(Math.min(...column))
					})
					history.push(cost);
					matrix = newMatrix;
				} while(typeof matrix[0][0] === "number");
				let result: number = history.reduce((acc, item) => acc += item);
				output.value = "   As a result, " + result + " conventional units were required.";
				return {methodName, result};
			}

			function getMethodResult_3(): MethodResult {
				let methodName: string = "the penalty method";
				let matrix: Matrix = copyObject(globalMatrix);
				let takers: Array<number> = copyObject(globalTakers);
				let stores: Array<number> = copyObject(globalStores);
				let history: Array<number> = [];
				output.value = `\n3. Third method - ${methodName}:`;
				do {
					let fines: Array<Fine> = [], i: number, j: number;
					for(i = 0; i < matrix.length; i++) {
						let line: Array<number> = copyObject(matrix[i]).sort((a, b) => a - b);
						let value: number = line[1]-line[0];
						let minValue: number = Math.min(...line);
						fines.push({
							direction: MatrixDirection.LINE,
							minY: i,
							minX: matrix[i].indexOf(minValue),
							value,
							minValue
						})
					}
					for(i = 0; i < matrix[0].length; i++) {
						let column: Array<number> = [];
						for(j = 0; j < matrix.length; j++) column.push(matrix[j][i]);
						let sortedColumn: Array<number> = copyObject(column).sort((a, b) => a - b);
						let value: number = sortedColumn[1]-sortedColumn[0];
						let minValue: number = Math.min(...column);
						fines.push({
							direction: MatrixDirection.COLUMN,
							minY: column.indexOf(minValue),
							minX: i,
							value,
							minValue
						})
					}
					fines.sort((a, b) => a.minValue - b.minValue);
					fines.sort((a, b) => b.value - a.value);
					let [cost, newMatrix] = executeTransaction({
						matrix,
						stores,
						takers,
						x: fines[0].minX,
						y: fines[0].minY
					})
					history.push(cost);
					matrix = newMatrix;
				} while(typeof matrix[0][0] === "number");
				let result: number = history.reduce((acc, item) => acc += item);
				output.value = "   As a result, " + result + " conventional units were required.";
				return {methodName, result};
			}

			function compareResults(results: Array<MethodResult>): void {
				let bestMethod: MethodResult = results[0];
				let minResult: number = results[0].result;
				results.forEach(item => {
					if(minResult > item.result) {
						minResult = item.result;
						bestMethod = item;
					}
				})
				output.value = `\nBest method: ${bestMethod.methodName} (with the result: ${bestMethod.result}).`;
			}

			const $1: MethodResult = getMethodResult_1();
			const $2: MethodResult = getMethodResult_2();
			const $3: MethodResult = getMethodResult_3();
			compareResults([$1, $2, $3]);

			resolve(<>{output.value}<p style={{marginTop: "10px"}}><a href="https://github.com/LanGvest/system-analysis/blob/main/pages/task/1.tsx">goto GitHub repository</a></p></>);
		}),
		new Promise<void>(resolve => setTimeout(resolve, 2000))
	]).then(dataStore => setContent(() => dataStore[0]));
}

export default function Task1(): CustomElement {
	const [content, setContent] = useState<CustomJSX>(() => <Loading/>);
	useEffect(execute.bind(null, setContent), []);
	return (
		<>
			<Head>
				<title>Task 1 | {Config.TITLE}</title>
			</Head>
			<GoBack style={{marginBottom: "26px"}}/>
			<h1 style={{marginBottom: "10px", textAlign: "center"}}>Task 1</h1>
			<p style={{marginBottom: "26px", textAlign: "center", fontSize: "20px", color: "var(--color-primary)", textTransform: "uppercase", fontWeight: "bold"}}>Transport model</p>
			<pre>{content}</pre>
		</>
	);
}