import {
	copyObject,
	CustomElement,
	CustomJSX,
	cutMatrix, isEmpty, Matrix,
	MatrixDirection,
	OutputStream, replaceMatrix,
	SetState
} from "../../modules/utils";
import {useEffect, useState} from "react";
import {Loading} from "../../components/loading";
import Head from "next/head";
import Config from "../../config";
import {GoBack} from "../../components/goBack";
import cytoscape from "cytoscape";
import {match} from "assert";

const N: number = Infinity;
const globalMatrix: Matrix = [
	[N,7,1,5,N,N],
	[7,N,8,6,3,5],
	[6,4,N,N,2,4],
	[3,1,N,N,2,N],
	[N,3,1,5,N,2],
	[N,6,4,N,3,N]
]

const execute = (setter: SetState<CustomJSX>) => {
	Promise.all([
		new Promise<[Array<cytoscape.ElementDefinition>, CustomJSX]>(resolve => {
			const output: OutputStream = new OutputStream();
			let results: Array<Array<number>> = [];
			function getMeta(way: Array<number>): Meta {
				let matrix: Matrix = copyObject(globalMatrix);
				let L: number = 0, i: number, j: number;
				for(i = 0; i < matrix.length; i++) for(j = 0; j < matrix[i].length; j++) if(isEmpty(matrix[i][j])) matrix[i][j] = Infinity;
				for(i = 0; i < way.length-1; i++) L += matrix[way[i]-1][way[i+1]-1];
				return {L, way};
			}

			interface Meta {
				L: number
				way: Array<number>
			}

			~function go(way: Array<number>): void {
				let toGo: Array<number> = [];
				globalMatrix[0].for((v,i) => !way.includes(i+1) && toGo.push(i+1));
				if(!toGo.length) {
					results.push([...way, 1]);
					return;
				}
				let metaStore: Array<Meta> = [];
				toGo.for(id => metaStore.push(getMeta([...way, id])));
				metaStore.sort((a, b) => a.L - b.L);
				let bestResult: Meta = metaStore[0];
				for(let meta of metaStore) if(meta.L === bestResult.L) go(meta.way);
			}([1]);
			results.for(way => output.value = way.join(" -> "));
			let nodes: Array<cytoscape.NodeDefinition> = globalMatrix.forMap((v, i) => {
				return {group: "nodes", data: {id: `n${i+1}`, name: `Город ${i+1}`}}
			})
			let firstResult: string = results[0].join("->");
			let edges: Array<cytoscape.EdgeDefinition> = [], i: number, j: number, len: number = globalMatrix.length;
			for(i = 0; i < len; i++) {
				for(j = 0; j < len; j++) {
					if(globalMatrix[i][j] !== Infinity) {
						edges.push({group: "edges", data: {id: `e${i+1}-${j+1}`, source: `n${i+1}`, target: `n${j+1}`, label: globalMatrix[i][j]}, style: {
							...(firstResult.includes(`${i+1}->${j+1}`) ? {"line-color": "#247ee5", "target-arrow-color": "#247ee5", "line-opacity": 1} : {})
						}});
					}
					if(globalMatrix[j][i] !== Infinity) {
						edges.push({group: "edges", data: {id: `e${j+1}-${i+1}`, source: `n${j+1}`, target: `n${i+1}`, label: globalMatrix[j][i]}, style: {
							...(firstResult.includes(`${j+1}->${i+1}`) ? {"line-color": "#247ee5", "target-arrow-color": "#247ee5", "line-opacity": 1} : {})
						}});
					}
				}
			}
			resolve([[...nodes, ...edges], <>{output.value}</>]);
		}),
		new Promise<void>(res => setTimeout(res,2000))
	]).then(store => {
		cytoscape({
			container: document.getElementById("cy"),
			style: [
				{
					selector: 'node',
					style: {
						'label': 'data(name)',
						"font-weight": "bold",
						"background-color": "#247ee5"
					}
				},
				{
					selector: 'edge',
					style: {
						'label': 'data(label)',
						"line-opacity": 0.4,
						"font-weight": "bold",
						'target-arrow-shape': 'triangle',
						'curve-style': 'bezier'
					}
				}
			],
			elements: store[0][0],
			layout: {
				padding: 50,
				name: "grid"
			}
		})
		setter(() => store[0][1]);
	})
}

export default function Task3():CustomElement {
	const t: string = "Task 3";
	const st: string = "Finding the optimal path";
	const [ctn,setCtn] = useState <CustomJSX>(() => <Loading/>);
	useEffect(execute.bind(null,setCtn),[]);
	return (
		<>
			<Head><title>{t} | {Config.TITLE}</title></Head>
			<GoBack style={{marginBottom: "26px"}}/>
			<h1 style={{marginBottom: "10px", textAlign: "center"}}>{t}</h1>
			<p style={{marginBottom: "26px", textAlign: "center", fontSize: "20px", color: "var(--color-primary)", textTransform: "uppercase", fontWeight: "bold"}}>{st}</p>
			<pre>{ctn}</pre>
			<div id="cy" style={{marginTop: "10px"}}/>
		</>
	);
}