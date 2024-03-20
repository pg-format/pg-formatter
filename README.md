# PG formatter

This repository contains a parser and formatter of **PG format** for labeled
property graphs and a web application to validate and beautify PG format.

## PG format

PG format is a text-based serialization of labeled property graphs. A PG file
encodes such a graph as Unicode string using UTF-8 ([RFC3629]). The format is
based on the following rules:

* Each line describes a node or an edge.
* All elements in a line are separated by one or more spaces or tabs.
* The first element of a node line contains the node ID.　
* The first three elements of an edge line contain the source node ID, direction, and destination node ID.
* Each line can contain an arbitrary number of labels.
* Each line can contain an arbitrary number of properties (key-value pairs)

Multi-line description of a node or an edge

* If a line begins with one or more spaces or tabs followed by elements, the line is considered a continuation of the previous line.

Comments

* Comment lines begin with `#` followed by any characters and end with a new line. Arbitrary numbers of spaces or tabs can be added before `#`.
* If a line describing a node or an edge ends with a space or tab followed by `#` and any characters, they are considered comments (trailing comments).

## Documentation

* https://pg-format.readthedocs.io/en/0.3/contents/pg-format.html

## Usage

The web application is started via `index.html`, just open the file in a web browser.

## Development

To re-generate the code, install dependencies (`npm install`) and run:

* `npm run peggy` to update the parser from `src/pg.pegjs`
* `npm run webpack` to update the web application

Run `npm test` to execute unit tests.

## License

The source code is licensed under MIT License.

## References

* https://arxiv.org/abs/1907.03936
* https://arxiv.org/abs/2203.06393 (G2GML)
  * 2.4 Serialization of Property Graphs (pp.5-6)

[RFC3629]: https://datatracker.ietf.org/doc/html/rfc3629
