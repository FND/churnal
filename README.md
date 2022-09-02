simplistic unidirectional microblogging, inspired by
[ORF's news feed](https://news.orf.at)


Getting Started
---------------

* ensure [Deno](https://deno.land) is installed
* `deno lint` checks code for syntax issues
* `deno fmt` automatically reformats code for consistency
* `deno run --allow-read src/generator/index.ts ./content` generates HTML


Customizing HTML
----------------

The document layout is defined by `src/template.html`, which must contain a
`%CONTENT%` placeholder for articles. Individual articles' markup is defined by
the `renderArticle` function exported from `src/article.ts`.
