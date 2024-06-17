# PG formatter

This repository contains a parser and formatter of **PG format** for labeled
property graphs and a web application to validate, format, and visualize PG format.

PG format is a text-based serialization of labeled property graphs.
See [PG specification](https://pg-format.github.io/specification/#pg-format)
and [PG homepage](https://pg-format.github.io/) for details.

## Usage

The web application is started via `index.html`, just open the file in a web browser.

* Query parameter `pg` can be used to pass a graph in [PG format](#pg-format).
* Query parameter `url` can be used to pass the URL of a graph in [PG format](#pg-format).
* The "permalink" links to the current page with current editor content.
* Examples from directory [examples](examples) can be loaded by selecting from a dropdown.
* A formatted variant or PG-JSONL can be selected to be shown at the right.

## Development

Clone repository with submodules to get unit tests:

~~~
git submodule update --init --recursive
~~~

To re-generate the code, install dependencies (`npm install`) and run:

* `npm run peggy` to update the parser from `src/pg.pegjs`
* `npm run webpack` to update the web application
* `nom run docs` to update the grammar in EBNF form

Run `npm test` to execute unit tests.

## License

The source code is licensed under MIT License.

## References

* https://arxiv.org/abs/1907.03936
* https://arxiv.org/abs/2203.06393 (G2GML)
  * 2.4 Serialization of Property Graphs (pp.5-6)
