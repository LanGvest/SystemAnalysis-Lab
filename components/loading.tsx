import {useEffect, useState} from "react";
import {CustomElement} from "../modules/utils";
import {setInterval} from "timers";

const slashes: Array<string> = ["|", "/", "-", "\\"];

export function Loading(): CustomElement {
	const [index, setIndex] = useState<number>(() => 0);
	useEffect(() => {
		let interval = setInterval(() => setIndex(pr => pr+1<slashes.length?pr+1:0), 100);
		return () => clearInterval(interval);
	}, [])
	return <pre style={{color: "var(--color-hint)"}}>{slashes[index]} collecting data</pre>;
}