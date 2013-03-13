<!DOCTYPE html>
<html lang="en">
  
  <head>
    <meta charset="utf-8">
    <title>H5 FLOW</title>
    <link href="/_bootstrap2/css/bootstrap.min.css" rel="stylesheet">
    
    <script src="/_jquery/jquery-1.9.min.js"></script>
    <script src="/_bootstrap2/js/bootstrap.min.js"></script>
    <script src="/raphaeljs/raphael-min.js"></script>
    <script src="/raphaeljs/g.raphael-min.js"></script>
    <script src="/_raphaeljs/joint.all.min.js"></script>

    <style type="text/css">
      body {
        padding: 20px;
      }
      #tracker {
        border: 1px solid #aaa;  
      } 
    </style>
    
  </head>
  
  <body>

<div id="tracker"></div>
<div id="tracker2"></div>

<script type="text/javascript">

// COLOR
// http://upload.wikimedia.org/wikipedia/commons/9/91/LampFlowchart.svg

Raphael.fn.connection = function (obj1, obj2, line) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
        {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
        {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
        d = {}, dis = [];
    
    //console.log("s1:"+ bb1.x +"/"+ bb1.y);
    //console.log("s2:"+ bb2.x +"/"+ bb2.y);
    //console.log(p);
    
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    //console.log(d);
    //console.log("dis: "+ dis);
    
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    //console.log("res:"+ res);
    
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    //console.log("dx/dy: "+ dx +"/"+ dy);
    //console.log("x1/y1/x4/y4: "+ x1 +"/"+ y1 +"/"+ x4 +"/"+ y4);
    
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    
    arrsize = 10; 
    angle = Raphael.angle(x3, y3, x4, y4);  
    var a45   = Raphael.rad(angle-45);
    var a45m  = Raphael.rad(angle+45);
    //var a135  = Raphael.rad(angle-135);
    //var a135m = Raphael.rad(angle+135);    
    //var fxa = x3 + Math.cos(a135) * arrsize;
    //var fya = y3 + Math.sin(a135) * arrsize;
    //var fxb = x3 + Math.cos(a135m) * arrsize;
    //var fyb = y3 + Math.sin(a135m) * arrsize;
    var txa = x4 + Math.cos(a45) * arrsize;
    var tya = y4 + Math.sin(a45) * arrsize;
    var txb = x4 + Math.cos(a45m) * arrsize;
    var tyb = y4 + Math.sin(a45m) * arrsize;

    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3), "M", x4.toFixed(3), y4.toFixed(3), "L", txa, tya, "M", x4.toFixed(3), y4.toFixed(3), "L", txb, tyb, "Z"].join(",");
    //console.log(path);
    
    if (line && line.line) {
        line.line.attr({path: path});
    } else {
        var color = typeof line == "string" ? line : "#ccc";
        return {
            line: this.path(path).attr({stroke: color, fill: "none", "stroke-width": 2}),
            from: obj1,
            to: obj2
        };
    }
};


var paper = new Raphael("tracker", 800, 600);

//paper.path("M 100 100 L 100 200").attr("fill","black").rotate((-10),100,100);
var dragger = function () {
    //return;
    this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
    this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
    //this.animate({"fill-opacity": .2}, 500);
};
move = function (dx, dy) {
    //console.log('move: '+ dx +'/'+ dy);
    var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
    this.attr(att);

    for (var i = connections.length; i--;) {
        paper.connection(connections[i]);
    }
    //paper.safari();
};
up = function () {
    //this.animate({"fill-opacity": 0}, 500);
};

var connections = [];

var paper = new Raphael("tracker", 600, 500);


var color = Raphael.getColor();

var s1 = paper.rect(100, 100, 100, 40, 5);  
s1.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
s1.drag(move, dragger, up);

var s2 = paper.rect(200, 200, 100, 40, 5);  
s2.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
s2.drag(move, dragger, up);

var s3 = paper.rect(300, 100, 100, 40, 5);  
s3.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
s3.drag(move, dragger, up);

connections.push(paper.connection(s1, s2, "#ccc"));
connections.push(paper.connection(s3, s2, "#ccc"));

</script>

</body></html>
