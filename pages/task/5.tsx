import {
    copyObject,
    CustomElement,
    CustomJSX, getRandomInt,
    isEmpty, Matrix,
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
            const amount: number = Number(prompt("Please, specify the number of elements in the array."));
            if(isEmpty(amount)) return resolve(<>Incorrect number of elements specified!</>);

            const output: OutputStream = new OutputStream();
            let timestamp: number;

            output.value = `Results of execution of sorting algorithms for\nthe array of ${amount} elements.\n`;

            let randomArray: Array<number> = [];
            for(let i = 0; i < amount; i++) randomArray[i] = getRandomInt(0, 99);

            console.log("Before:", randomArray);

            let bubbleSortCounter: number = 0;
            let quickSortCounter: number = 0;
            let insertionSortCounter: number = 0;
            let bubbleSortTime: number;
            let quickSortTime: number;
            let insertionSortTime: number;
            let jsSortTime: number;

            const bubbleSort = (arr: Array<number>): Array<number> => {
                for(let i = 0, endI = arr.length - 1; i < endI; i++) {
                    let wasSwap: boolean = false;
                    for(let j = 0, endJ = endI - i; j < endJ; j++) {
                        if(arr[j] > arr[j + 1]) {
                            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                            wasSwap = true;
                            bubbleSortCounter++;
                        }
                    }
                    if(!wasSwap) break;
                }
                return arr;
            }

            const quickSort = (arr: Array<number>): Array<number> => {
                if(arr.length < 2) return arr;
                let pivot: number = arr[0];
                const left: Array<number> = [];
                const right: Array<number> = [];
                for(let i = 1; i < arr.length; i++) {
                    if(pivot > arr[i]) left.push(arr[i]);
                    else right.push(arr[i]);
                    quickSortCounter++;
                }
                return quickSort(left).concat(pivot, quickSort(right));
            }

            const insertionSort = (arr: Array<number>): Array<number> => {
                for(let i = 1, l = arr.length; i < l; i++) {
                    const current = arr[i];
                    let j = i;
                    while(j > 0 && arr[j - 1] > current) {
                        arr[j] = arr[j-- - 1];
                        insertionSortCounter++;
                    }
                    arr[j] = current;
                }
                return arr;
            }

            timestamp = new Date().getTime();
            console.log("1. Default JS sort:", copyObject(randomArray).sort((a, b) => a - b));
            jsSortTime = new Date().getTime() - timestamp;
            output.value = `1. Default JS sort: ${jsSortTime} ms.`;

            timestamp = new Date().getTime();
            console.log("2. Bubble sort:", bubbleSort(copyObject(randomArray)));
            bubbleSortTime = new Date().getTime() - timestamp;
            output.value = `2. Bubble sort: ${bubbleSortCounter} operations for ${bubbleSortTime} ms.`;

            timestamp = new Date().getTime();
            console.log("3. Quick sort:", quickSort(copyObject(randomArray)));
            quickSortTime = new Date().getTime() - timestamp;
            output.value = `3. Quick sort: ${quickSortCounter} operations for ${quickSortTime} ms.`;

            timestamp = new Date().getTime();
            console.log("4. Insertion sort:", insertionSort(copyObject(randomArray)));
            insertionSortTime = new Date().getTime() - timestamp;
            output.value = `4. Insertion sort: ${insertionSortCounter} operations for ${insertionSortTime} ms.`;

            resolve(<>{output.value}<p style={{marginTop: "10px"}}><a href="https://github.com/LanGvest/system-analysis/blob/main/pages/task/5.tsx">goto GitHub repository</a></p></>);
        }),
        new Promise<void>(res => setTimeout(res,2000))
    ]).then(store => setter(() => store[0]))
}

export default function Task4():CustomElement {
    const title: string = "Task 5";
    const subTitle: string = "Sorting algorithms";
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