simplistic unidirectional microblogging, inspired by
[ORF's news feed](https://news.orf.at)


Contributing Content
--------------------

If there's something noteworthy you want to share, or anything you want to call
attention to, please add a Markdown file within the `content` directory:

```
<date> #<category> by <author>
<title>

<content>
```

(`date` is an ISO 8601 date, i.e. `yyyy-mm-dd` - `content` is multi-line
[Markdown](https://commonmark.org) content)

Then create a merge request, inviting others to share their editorial
perspectives.

Please try to be concise and don't expect people to share your context: Imagine
you're a journalist writing for a broad and busy audience. The headline should
be informative, allowing readers to decide whether they want to read more. Feel
free to link to other web resources providing more context or further details.


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
