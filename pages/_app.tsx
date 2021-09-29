import type {AppContext, AppProps} from "next/app";
import App from "next/app";
import "../styles/global.scss";
import {CustomJSX} from "../modules/utils";
import Head from "next/head";
import Config from "../config";

export default function SysLangvestByApp({Component, pageProps}: AppProps): CustomJSX {
	return (
		<>
			<Head>
				<title>{Config.TITLE}</title>
			</Head>
			<main>
				<Component {...pageProps}/>
			</main>
		</>
	)
}

SysLangvestByApp.getInitialProps = async (appContext: AppContext) => {
	const appProps = await App.getInitialProps(appContext);
	return {...appProps, pageProps: {...appProps.pageProps}};
}