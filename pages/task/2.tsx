import {
    copyObject,
    CustomElement,
    CustomJSX,
    Matrix,
    OutputStream,
    SetState
} from "../../modules/utils";
import {useEffect, useState} from "react";
import {Loading} from "../../components/loading";
import Head from "next/head";
import Config from "../../config";
import {GoBack} from "../../components/goBack";

const execute = (setter: SetState<CustomJSX>) => {
    Promise.all([
        new Promise<CustomElement>(resolve => {
            const output: OutputStream = new OutputStream();

            const globalMatrix: Matrix = [
                [3, 7, 1, 5, 4, 3],
                [7, 5, 8, 6, 3, 5],
                [6, 4, 8, 3, 2, 4],
                [3, 1, 7, 4, 2, 7],
                [10, 3, 1, 5, 3, 2],
                [4, 6, 4, 8, 3, 2]
            ]

            interface Offers {
                [humanIndex: number]: Array<number>
            }

            interface Results {
                [humanIndex: number]: number
            }

            let matrix: Matrix = copyObject(globalMatrix);

            console.log(matrix);

            let i: number, j: number;
            for(i = 0; i < matrix.length; i++) {
                let min: number = Math.min(...matrix[i]);
                matrix[i] = matrix[i].map(item => item-min);
            }

            console.log(matrix);

            for(i = 0; i < matrix[0].length; i++) {
                let column: Array<number> = [];
                for(j = 0; j < matrix.length; j++) column.push(matrix[j][i]);
                let min: number = Math.min(...column);
                for(j = 0; j < matrix.length; j++) matrix[j][i] -= min;
            }

            console.log(matrix);

            let offers: Offers = {};
            let results: Results= {};

            for(i = 0; i < matrix.length; i++) matrix[i].forEach((item, index) => {
                if(item) return;
                if(!offers[i]) offers[i] = [];
                offers[i].push(index);
            })

            let humanIndex: string;

            while(Object.keys(offers).length) {
                for(humanIndex in offers) {
                    let occupied: Array<number> = [], index: string;
                    for(index in results) occupied.push(results[index]);
                    for(index in offers) occupied.forEach(occupiedWorkIndex => {
                        let workIndex: number = offers[index].indexOf(occupiedWorkIndex);
                        if(~workIndex) offers[index].splice(workIndex, 1);
                    })
                    results[humanIndex] = offers[humanIndex][0];
                    let newOffers: Offers = {};
                    for(index in offers) if(index !== humanIndex) newOffers[index] = offers[index];
                    offers = newOffers;
                }
            }

            for(humanIndex in results) output.value = `For worker number ${+humanIndex+1}: job number ${results[humanIndex]+1}.`;

            resolve(<>{output.value}<p style={{marginTop: "10px"}}><a href="https://github.com/LanGvest/system-analysis/blob/main/pages/task/2.tsx">goto GitHub repository</a></p></>);
        }),
        new Promise<void>(res => setTimeout(res,2000))
    ]).then(store => setter(() => store[0]))
}

export default function Task4():CustomElement {
    const title: string = "Task 2";
    const subTitle: string = "Hungarian algorithm";
    const [ctn, setCtn] = useState <CustomJSX>(() => <Loading/>);
    useEffect(execute.bind(null,setCtn),[]);
    return (
        <>
            <Head><title>{title} | {Config.TITLE}</title></Head>
            <GoBack style={{marginBottom: "26px"}}/>
            <h1 style={{marginBottom: "10px", textAlign: "center"}}>{title}</h1>
            <p style={{marginBottom: "26px", textAlign: "center", fontSize: "20px", color: "var(--color-primary)", textTransform: "uppercase", fontWeight: "bold"}}>{subTitle}</p>
            <pre>{ctn}</pre>
        </>
    )
}