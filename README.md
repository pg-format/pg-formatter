# PG formatter

## PG format

Overview
* Each line describes a node or an edge.
* All elements in a line are separated by spaces or tabs.
* The first column of a node line contains the node ID (if the first column is not empty).　
* The first three columns of an edge line contain the source node ID, direction, and destination node ID (if the first column is not empty).
* Each line can contain an arbitrary number of labels.
* Each line can contain an arbitrary number of properties (key-value pairs)

Multi-line description of a node or an edge

* If the first column is empty (i.e. a line begins with spaces or tabs followed by a column describing a label or property), the line is considered a continuation of the previous line.

## Documentation

*　https://pg-format.readthedocs.io/en/0.3/contents/pg-format.html

## References

* https://arxiv.org/abs/1907.03936
* https://arxiv.org/abs/2203.06393 (G2GML)
  * 2.4 Serialization of Property Graphs (pp.5-6)
