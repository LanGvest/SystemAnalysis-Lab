import {useRouter} from "next/router";
import {useEffect} from "react";

export function NotFound(): null {
	const router = useRouter();
	useEffect(() => {
		router.push("/");
	}, [])
	return null;
}