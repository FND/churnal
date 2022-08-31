import { Category } from "./categories.ts";
import { LINE_BREAK, readTextFile } from "./util.ts";

const META_EXPECT = "expected `<yyyy-mm-dd> #<category> by <author>`";

class BaseArticle<CategoryType> {
	constructor(
		public filepath: string,
		public title: string,
		public category: CategoryType,
		public date: Date,
		public author: string,
		public content: string,
	) {}
}

class RawArticle extends BaseArticle<string> {}

export class Article extends BaseArticle<Category> {
	static async fromFile(filepath: string, categories: Map<string, Category>) {
		const txt = await readTextFile(filepath);
		const article = parseArticle(filepath, txt);

		const category = categories.get(article.category);
		if (!category) {
			throw new ArticleError(article.filepath, [
				`invalid category: \`${article.category}\` does not exist`,
			]);
		}
		return new this(
			article.filepath,
			article.title,
			category,
			article.date,
			article.author,
			article.content,
		);
	}
}

export class ArticleError extends Error {
	constructor(filepath: string, public details: string[]) {
		super(`invalid article \`${filepath}\`: ${details.length} errors`);
		const { name } = this.constructor;
		Object.assign(this, { name, details });
	}
}

function parseArticle(filepath: string, txt: string) {
	const errors = [];
	const [meta, title, blank, ...content] = txt.split(LINE_BREAK);
	if (blank !== "") {
		errors.push("missing blank line after title");
	}

	let [isoDate, category, sep, author] = meta.split(" ");
	if (sep !== "by" || !author) {
		errors.push(`missing author in metadata \`${meta}\`; ${META_EXPECT}`);
	}
	if (category?.startsWith("#")) {
		category = category.substring(1);
	} else {
		errors.push(`missing category in metadata \`${meta}\`; ${META_EXPECT}`);
	}

	let date;
	try {
		date = new Date(isoDate);
		if (date?.toISOString().substring(0, 10) !== isoDate) {
			errors.push(`invalid date \`${isoDate}\``);
		}
		// deno-lint-ignore no-empty
	} catch (_err) {}

	if (errors.length) {
		throw new ArticleError(filepath, errors);
	}
	return new RawArticle(
		filepath,
		title,
		category,
		date as Date,
		author,
		content.join("\n"),
	);
}
