import {useRouter} from "next/router";
import {CSSProperties} from "react";
import {CustomElement} from "../modules/utils";

interface Props {
	style?: CSSProperties
}

export function GoBack({style}: Props): CustomElement {
	const router = useRouter();
	return (
		<button className="full-width-btn" onClick={() => router.back()} style={{...style, justifyContent: "flex-start"}}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 306 306">
				<polygon xmlns="http://www.w3.org/2000/svg" points="247.35,35.7 211.65,0 58.65,153 211.65,306 247.35,270.3 130.05,153   "/>
			</svg>
			<p>Назад</p>
		</button>
	)
}