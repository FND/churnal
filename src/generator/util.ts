export const LINE_BREAK = /\r?\n|\r/;

export async function readTextFile(filepath: string) {
	const data = await Deno.readFile(filepath);
	return new TextDecoder("utf-8").decode(data);
}

export function abort(msg: string) {
	console.error(`ERROR: ${msg}`);
	Deno.exit(1);
}
