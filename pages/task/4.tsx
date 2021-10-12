import {
    copyObject,
    CustomElement,
    CustomJSX,
    isEmpty, Matrix,
    OutputStream,
    SetState
} from "../../modules/utils";
import {useEffect, useState} from "react";
import {Loading} from "../../components/loading";
import Head from "next/head";
import Config from "../../config";
import {GoBack} from "../../components/goBack";
import cytoscape from "cytoscape";

const N: number = 0;
const globalMatrix: Matrix = [
    [N,7,1,5,N,N],
    [7,N,8,6,3,5],
    [6,4,N,3,2,N],
    [3,1,7,N,2,7],
    [N,3,1,5,N,2],
    [N,6,N,8,3,N]
]

const execute = (setter: SetState<CustomJSX>) => {
    Promise.all([
        new Promise<[Array<cytoscape.ElementDefinition>, CustomJSX]>(resolve => {
            const output: OutputStream = new OutputStream();
            let V = globalMatrix.length;
            function bfs(rGraph: any, s: any, t: any, parent: any) {
                let visited = new Array(V);
                for(let i = 0; i < V; ++i) visited[i] = false;
                let queue = [];
                queue.push(s);
                visited[s] = true;
                parent[s] = -1;
                while(queue.length !== 0) {
                    let u = queue.shift();
                    for(let v = 0; v < V; v++) {
                        if(visited[v] == false && rGraph[u][v] > 0) {
                            if(v == t) {
                                parent[v] = u;
                                return true;
                            }
                            queue.push(v);
                            parent[v] = u;
                            visited[v] = true;
                        }
                    }
                }
                return false;
            }
            function fordFulkerson(graph: any, s: any, t: any) {
                let u, v;
                let rGraph = new Array(V);
                for(u = 0; u < V; u++) {
                    rGraph[u] = new Array(V);
                    for(v = 0; v < V; v++) rGraph[u][v] = graph[u][v];
                }
                let parent = new Array(V);
                let max_flow = 0;
                while(bfs(rGraph, s, t, parent)) {
                    let path_flow = Number.MAX_VALUE;
                    for(v = t; v != s; v = parent[v]) {
                        u = parent[v];
                        path_flow = Math.min(path_flow, rGraph[u][v]);
                    }
                    for(v = t; v != s; v = parent[v]) {
                        u = parent[v];
                        rGraph[u][v] -= path_flow;
                        rGraph[v][u] += path_flow;
                    }
                    max_flow += path_flow;
                }
                return max_flow;
            }
            output.value = "Result: " + fordFulkerson(globalMatrix, 0, globalMatrix.length-1);
            let nodes: Array<cytoscape.NodeDefinition> = globalMatrix.forMap((v, i) => {
                return {group: "nodes", data: {id: `n${i+1}`, name: i === 0 ? `Исток ${i+1}` : i === globalMatrix.length-1 ? `Сток ${i+1}` : `Узел ${i+1}`}, style: {
                        //...(firstResult.includes(`${i+1}`) ? {"background-opacity": 1, "background-color": "#247ee5"} : {}),
                        ...(i === 0 ? {"border-color": "#ff657e", "border-width": 5} : {}),
                        ...(i === globalMatrix.length-1 ? {"border-color": "#42f675", "border-width": 5} : {})
                    }}
            })
            let edges: Array<cytoscape.EdgeDefinition> = [], i: number, j: number, len: number = globalMatrix.length;
            for(i = 0; i < len; i++) {
                for(j = 0; j < len; j++) {
                    if(globalMatrix[i][j] !== N) {
                        edges.push({group: "edges", data: {id: `e${i+1}-${j+1}`, source: `n${i+1}`, target: `n${j+1}`, label: globalMatrix[i][j]}, style: {
                                ...(i < j ? {"line-color": "#247ee5", "target-arrow-color": "#247ee5", "line-opacity": 1} : {})
                            }});
                    }
                    if(globalMatrix[j][i] !== N) {
                        edges.push({group: "edges", data: {id: `e${j+1}-${i+1}`, source: `n${j+1}`, target: `n${i+1}`, label: globalMatrix[j][i]}, style: {
                               ...(j < i ? {"line-color": "#247ee5", "target-arrow-color": "#247ee5", "line-opacity": 1} : {})
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

export default function Task4():CustomElement {
    const t: string = "Task 4";
    const st: string = "Finding the maximum possible flow";
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
            <a style={{marginTop: "10px"}} href="https://github.com/LanGvest/system-analysis/blob/main/pages/task/4.tsx">goto GitHub repository</a>
        </>
    );
}