import { Article } from "./generator/article.ts";
import { renderMarkdown } from "./generator/markdown.ts";

const LOCALE = "en-US";
const DAY_FORMATTER = Intl.DateTimeFormat(LOCALE, { weekday: "long" });
const MONTH_FORMATTER = Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "long" });

export function renderArticle(article: Article) {
	const { category, date } = article;
	return `
<article>
	<details>
		<summary>
			<b class="category" style="--category-color: ${category.color}">${category.name}</b>
			<b>${article.title}</b>
		</summary>
		<time datetime="${date.toISOString().substring(0, 10)}">
			${DAY_FORMATTER.format(date)}, ${MONTH_FORMATTER.format(date)}
			<small>${date.getFullYear()}</small>
		</time>
		<i>👤 by ${article.author}</i>
		${renderMarkdown(article.content)}
	</details>
</article>
	`.trim();
}
