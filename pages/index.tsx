import {CustomElement} from "../modules/utils";
import {useRouter} from "next/router";

export default function Index(): CustomElement {
	const router = useRouter();
	return (
		<div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 40px * 2)"}}>
			<h1 style={{textTransform: "uppercase"}}><span style={{color: "var(--color-primary)", fontSize: "inherit"}}>s</span>ystem <span style={{color: "var(--color-primary)", fontSize: "inherit"}}>a</span>nalysis</h1>
			<h1>make ur choice</h1>
			<button style={{marginTop: "26px"}} onClick={() => router.push("/task/1")}>goto Task 1</button>
			<button style={{marginTop: "18px"}} onClick={() => router.push("/task/3")}>goto Task 3</button>
			<button style={{marginTop: "18px"}} onClick={() => router.push("/task/4")}>goto Task 4</button>
			<p style={{marginTop: "26px"}}>by Vyacheslav Logvinets</p>
			<a style={{marginTop: "10px"}} href="https://github.com/LanGvest/system-analysis">goto GitHub repository</a>
		</div>

	)
}