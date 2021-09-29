import Document, {Html, Head, Main, NextScript, DocumentContext} from "next/document";
import Config from "../config";

export default class GrosserDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		let pageProps = null;
		const originalRenderPage = ctx.renderPage;
		ctx.renderPage = () => originalRenderPage({
			enhanceApp: App => props => {
				pageProps = props.pageProps;
				return <App {...props}/>
			},
			enhanceComponent: Component => Component
		})
		const initialProps = await Document.getInitialProps(ctx);
		return {...initialProps, pageProps};
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					<title>{Config.TITLE}</title>
					<link rel="manifest" href={"/manifest.json"}/>
					<meta name="viewport" content="width=device-width, user-scalable=no"/>
					<meta name="theme-color" content={require("../public/manifest.json").background_color}/>
				</Head>
				<body>
					<Main/>
					<NextScript/>
				</body>
			</Html>
		)
	}
}