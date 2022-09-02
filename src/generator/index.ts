import { renderArticle } from "../article.ts";
import { Article, ArticleError } from "./article.ts";
import { parseCategories } from "./categories.ts";
import { abort } from "./util.ts";
import { renderDocument } from "./render.ts";

const CATEGORIES = "CATEGORIES";

main();

async function main() {
	let [contentDir] = Deno.args;
	if (!contentDir) {
		abort("missing content directory");
		return;
	}
	try {
		contentDir = await Deno.realPath(contentDir);
	} catch (err) {
		if (err.code === "ENOENT") {
			abort(`missing content directory \`${contentDir}\``);
			return;
		}
		throw err;
	}

	let articles: Promise<Article>[] = [];
	try {
		articles = await parseContent(contentDir);
		await Promise.all(articles); // avoids race condition with uncaught promises
	} catch (err) {
		if (!articles.length) {
			abort(err.toString());
			return;
		}
	}

	const validArticles = [];
	const errors = [];
	for (const article of articles) {
		try {
			validArticles.push(await article);
		} catch (err) {
			errors.push(err);
		}
	}
	if (errors.length) {
		const msg = errors.map((err) => {
			if (err instanceof ArticleError) {
				return [err.message].concat(err.details).join("\n    ");
			}
			return err.toString();
		}).join("\n");
		abort(msg);
		return;
	}

	const html = [];
	for (const article of validArticles) {
		html.push(renderArticle(article));
	}
	console.log(await renderDocument(html.join("\n")));
}

async function parseContent(baseDir: string) {
	const categoriesFile = [baseDir, CATEGORIES].join("/");
	const _categories = parseCategories(categoriesFile);

	const files = await findArticles(baseDir, [categoriesFile]);
	const categories = await _categories;
	return files.map((filepath) => Article.fromFile(filepath, categories));
}

async function findArticles(baseDir: string, exclude: string[]) {
	const files = [];
	for await (const { name } of Deno.readDir(baseDir)) {
		const filepath = [baseDir, name].join("/");
		if (!exclude.includes(filepath)) {
			files.push(filepath);
		}
	}
	return files;
}
