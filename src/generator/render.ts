import { readTextFile } from "./util.ts";

let TEMPLATE = "../template.html";
TEMPLATE = new URL(TEMPLATE, import.meta.url).pathname;

export async function renderDocument(content: string) {
	const html = await readTextFile(TEMPLATE);
	return html.replace("%CONTENT%", content);
}
