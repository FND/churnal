import { LINE_BREAK, readTextFile } from "./util.ts";

const EXPECT = "expected `<name> <color> <description>`";

export async function parseCategories(filepath: string) {
	let txt;
	try {
		txt = await readTextFile(filepath);
	} catch (err) {
		if (err.code === "ENOENT") {
			throw new Error(`missing categories file \`${filepath}\``);
		}
		throw err;
	}
	return parse(txt);
}

function parse(txt: string) {
	const categories: Map<string, Category> = new Map();
	for (const line of txt.trim().split(LINE_BREAK)) {
		const [name, color, ...desc] = line.split(" ");
		if (!desc.length || !color || !name) {
			throw new Error(`invalid category: \`${line}\`; ${EXPECT}`);
		}
		if (!color.startsWith("#")) { // TODO: support for non-hex colors
			throw new Error(`invalid category color \`${color}\` in \`${line}\``);
		}
		if (categories.has(name)) {
			throw new Error(`duplicate category: \`${line}\``);
		}
		categories.set(name, new Category(name, color, desc.join(" ")));
	}
	return categories;
}

export class Category {
	constructor(
		public name: string,
		public color: string,
		public description: string,
	) {}
}
