import {CustomElement} from "../modules/utils";
import {useRouter} from "next/router";

export default function Index(): CustomElement {
	const router = useRouter();
	return (
		<div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 40px * 2)"}}>
			<h1 style={{textTransform: "uppercase"}}><span style={{color: "var(--color-primary)", fontSize: "inherit"}}>s</span>ystem <span style={{color: "var(--color-primary)", fontSize: "inherit"}}>a</span>nalysis</h1>
			<h1>make ur choice</h1>
			<button style={{marginTop: "26px"}} onClick={() => router.push("/tasks/1")}>goto Task 1</button>
			<p style={{marginTop: "26px", textDecoration: "line-through"}}>Made in China</p>
			<p style={{marginTop: "10px"}}>Made by Vyacheslav Logvinets</p>
		</div>

	)
}