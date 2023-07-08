# graphviz

Graph from text

- `node` - node is node (text within box)
- `edge` - line between nodes


- example
```graphviz
digraph G {
    node1;
    node2;
    node1 -> node2[dir=both];
}
```

## syntax

- normal edge: `node1 -> node2`;
- bidirectional edge: `node1 -> node2[dir=both];`
- color for node: `node1[color=blue];`
- color for edge: `node1 -> node2 [color=blue]`;
- circular box: `node1[shape=circle];`


## shapes

docs: https://graphviz.org/doc/info/shapes.html

```graphviz
digraph G {
    rankdir="LR";
    ellipse;
    circle[shape=circle];
    square[shape=square];
    rectangle[shape=rectangle];
    cylinder[shape=cylinder];
    diamond[shape=diamond];
    diamond[shape=rhombus];
    rounded_box[shape="box"; style="rounded"]
    rounded_box_with_filled[shape="box"; style="rounded,filled"; fillcolor="#ffaaaa"]
    with_label[label="text with space"];
    red_color[fillcolor="#ffaaaa" style="filled"]
    green_color[fillcolor="#ccffcc" style="filled"]
    blue_color[fillcolor="#ccccff" style="filled"]
    red_border[color="#ff3333" penwidth="2"]
    green_border[color="#66ff66" penwidth="2"]
    blue_border[color="#4080bf" penwidth="2"]
    with_some_font[fontname="Helvetica,Arial,sans-serif"]
    with_default_font;
}
```

## rankdir

```graphviz
digraph G {
    rankdir=TD;
    node1;
    node2;
    node3;
    node4;
    node1 -> node2;
    node3 -> node4;
}
```

```graphviz
digraph G {
    rankdir=LR;
    node1;
    node2;
    node3;
    node4;
    node1 -> node2;
    node3 -> node4;
}
```












