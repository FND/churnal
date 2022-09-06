#!/usr/bin/env python

"""
generates fake articles in the current working directory

    $ cd /path/to/content_directory
    $ ./fake_content.py <count>
"""

import sys

from faker import Faker
from mdgen import MarkdownPostProvider

from random import choice


FAKE_CATEGORIES = ["org", "misc", "fun", "people"]
CATEGORY_TEMPLATE = "%(name)s %(color)s %(desc)s"
ARTICLE_TEMPLATE = """
%(date)s #%(category)s by %(author)s
%(title)s

%(content)s
""".strip()


def main(self, count):
    count = int(count)

    fake = Faker()
    fake.add_provider(MarkdownPostProvider)

    print("generating CATEGORIES", file=sys.stderr)
    categories = [CATEGORY_TEMPLATE % {
        "name": category,
        "color": fake.color(),
        "desc": fake.text(80)
    } for category in FAKE_CATEGORIES]
    with open("CATEGORIES", "w") as fh:
        fh.write("\n".join(categories))

    for i in range(count):
        filename = "fake_%d.md" % (i + 1)
        print("generating %s" % filename, file=sys.stderr)

        text = ARTICLE_TEMPLATE % {
            "title": fake.text(80),
            "category": choice(FAKE_CATEGORIES),
            "date": fake.date(),
            "author": fake.name(),
            "content": fake.post(size="medium")
        }

        with open(filename, "w") as fh:
            fh.write(text.strip())
    return True


if __name__ == "__main__":
    status = not main(*sys.argv)
    sys.exit(status)
