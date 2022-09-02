import "https://unpkg.com/commonmark@0.29.3/dist/commonmark.js";

const { HtmlRenderer, Parser } = globalThis.commonmark; // TODO: ESM?

// `smart`, if `true`, activates typographic enhancements
// `fragIDs` adds IDs to headings, generated either automatically (if `true`) or
// by invoking a function with the respective heading's text
// `allowHTML`, if `true`, permits embedding raw HTML
// `resolveURI` allows modifying link targets
export function renderMarkdown(
	txt: string,
	{ smart = true, fragIDs, allowHTML, resolveURI }: {
		smart?: boolean;
		fragIDs?: boolean | ((txt: string) => string);
		allowHTML?: boolean;
		resolveURI?: (uri: string) => string;
	} = {},
) {
	const reader = new Parser({ smart });
	const root = reader.parse(txt);
	if (resolveURI) {
		visit(root, "link", (node: Node) => {
			node.destination = resolveURI(node.destination);
		});
	}

	const writer = new HtmlRenderer({ safe: !allowHTML });
	if (fragIDs) {
		const { attrs } = writer;
		writer.attrs = function (node: Node) {
			const res = attrs.call(this, node);
			if (node.type !== "heading") {
				return res;
			}

			let txt = "";
			visit(node, "text", (node: Node) => {
				txt += node.literal;
			});
			const id = fragIDs === true ? idify(txt) : fragIDs(txt);
			return [["id", id], ...res];
		};
	}
	return writer.render(root);
}

function idify(txt: string) {
	return txt.replace(/\s/g, "-").toLowerCase();
}

function visit(node: Node, type: string, callback: (n: Node) => void) {
	const walker = node.walker();
	let event = walker.next();
	while (event) {
		const { node } = event;
		if (event.entering && node.type === type) {
			callback(node);
		}
		event = walker.next();
	}
}

interface Node {
	type: string;
	literal: string;
	destination: string;
	walker: () => NodeWalker;
}
interface NodeWalker {
	next: () => NodeEvent;
}
interface NodeEvent {
	node: Node;
	entering: boolean;
}
