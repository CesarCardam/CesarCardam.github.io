function GetColorByGroup(num){
  switch (num) {
    case 0:
      return "#00A1B7"
    case 1:
      return "#277884"
    case 2:
      return "#005E6B"
    case 3:
      return "#003138"
    case 4:
      return "#E35EA2"
    case 5:
      return "#E31A80"
    case 6:
      return "#971155"
    case 7:
      return "#640B38"
    case 8:
      return "#C7F38B"
    case 9:
      return "#A8F342"
    case 10:
      return "#94B667"
    case 11:
        return "#50741F"
    default:
      return "#FFF"
  }
}

function GetDistanceByValue(num){
  return num*12;
}

function GetSizeBySelected(col){
  if(col=="#FFF"){
    return 20;
  }
  return 12;
}
var gr="";

var parentWidth=parseInt($(window).width());
//var parentHeight=$("#chart").height();
var parentHeight=500;

console.log(parentWidth+" "+parentHeight);

var svgl = d3.select("#linkerSvg");
      //width = +svg.attr("width"),
      //height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; })
                                   .distance(function(d) { return GetDistanceByValue(d.value); }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(parentWidth/2, parentHeight/2));

$("#linkerTitle").text("Relación de palabras para "+" \""+"ciencia"+"\"");
$("#linkerLoader").hide();

function updateSimulation(){
  var w=$("#frase").val();
  if(w==""){
    w="ciencia";
  }
  var text="Relación de palabras para "+" \""+w+"\"";
  $("#linkerTitle").text(text);
  $("#linkerLoader").hide();
  console.log("updateLinker");
  var parentWidth=parseInt($(window).width());
  var parentHeight=500;

  console.log(parentWidth+" "+parentHeight);
  simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; })
                                     .distance(function(d) { return GetDistanceByValue(d.value); }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(parentWidth/2, parentHeight/2));

      d3.json("Resources/data.json", function(error, graph) {
        if (error) throw error;

        if(gr!=""){
          graph=gr;
        }

        svgl.selectAll("g").remove();

        var link = svgl.append("g")
            .attr("class", "links")

          .selectAll("line").remove()
          .data(graph.links)
          .enter().append("line")
            .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svgl.append("g")
            .attr("class", "nodes")

          .selectAll("circle").remove()
          .data(graph.nodes)
          .enter().append("circle")
            .attr("r", 12)
            .attr("fill", function(d) { return GetColorByGroup(d.group); })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
        //tooltip initialization and functions
        var tooltip = $("#toolti");

        function ShowTooltip(x,y,name)
        {
           tooltip.css({
                zIndex: 5000,
                left: x+8,
                top: $("#chart").position().top+y+11,
                visibility: "visible"
            });
           tooltip.text(name);
        }

        function HideTooltip()
        {
          tooltip.css({
               visibility: "hidden"
           });
           tooltip.attr("visibility","hidden");
        }

        node.on("click", function(d) {
          console.log("Click "+d.id+"-"+d.group);
        });
        node.on("mouseover", function(d) {
          ShowTooltip(d.x,d.y,d.id);
          d.group=d.group+12;
          node.attr("r", function(d) { return GetSizeBySelected(GetColorByGroup(d.group)); })
          //node.attr("fill", function(d) { return GetColorByGroup(d.group); })
          console.log(d);
        });
        node.on("mouseout", function(d) {
          HideTooltip();
          d.group=d.group-12;
          node.attr("r", function(d) { return GetSizeBySelected(GetColorByGroup(d.group)); })
          //node.attr("fill", function(d) { return GetColorByGroup(d.group); })
        });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
          }
        });

        function dragstarted(d) {
              if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }
        updateGraph();
}

var yearInit=1980;
var yearEnd=1980;

function readyChart(){

//Slider creation
  var slider = document.getElementById('doubleSlider');
    noUiSlider.create(slider, {
     start: [yearInit, yearEnd],
     connect: true,
     tooltips: true,
     step: 1,
     range: {
       'min': 1960,
       'max': 2015
     },
     format: wNumb({
      decimals: 0
    })
  });
  slider.noUiSlider.on(
    'update', function ( values, handle, unencoded, isTap, positions ) {
	     yearInit = values[0];
       yearEnd = values[1];
    }
  );

//create graph
  $("#linker-button").click(function() {
    var frase=$("#frase").val();
    var ngramas=$("#ngramas").val();
    var corpus=$("#checkCorpus").prop('checked');

    if(frase!="" && ngramas!="" && ngramas>1 && ngramas<100){
      console.log(frase+" - "+ngramas+" - "+corpus+" - "+yearInit+" - "+yearEnd);
      $("#linkerTitle").text("Calculando datos");
      $("#linkerLoader").show();
      if(corpus){
        linkerDataCorpus(frase,ngramas,yearInit,yearEnd)
      }else {
        linkerData(frase,ngramas)
      }
    }
  });

  function linkerData(word, num){
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
              callbackFunc(xmlHttp.responseText);
      }
      xmlHttp.open("GET",
      "http://localhost:8080/api/v1/update_linker/"+word+"/"+num,
      true); // true for asynchronous
      xmlHttp.send(null);
  }

  function linkerDataCorpus(word, num, yearInit, yearEnd){
      console.log("corpus");
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
              callbackFunc(xmlHttp.responseText);
      }
      xmlHttp.open("GET",
      "http://localhost:8080/api/v1/update_linker_music/"+word+"/"+num+"/"+yearInit+"/"+yearEnd,
      true); // true for asynchronous
      xmlHttp.send(null);
  }

  function callbackFunc(response) {
    //if (xhr.readyState == 4 && xhr.status == 200) {
      console.log(response);
      gr=JSON.parse(response);
      updateSimulation();
    //}
  }

  d3.json("Resources/data.json", function(error, graph) {
    if (error) throw error;

    var link = svgl.append("g")
        .attr("class", "links")

      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svgl.append("g")
        .attr("class", "nodes")

      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
        .attr("r", 12)
        .attr("fill", function(d) { return GetColorByGroup(d.group); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    //tooltip initialization and functions
    var tooltip = $("#toolti");

    function ShowTooltip(x,y,name)
    {
       tooltip.css({
            zIndex: 5000,
            left: x+8,
            top: $("#chart").position().top+y+11,
            visibility: "visible"
        });
       tooltip.text(name);
    }

    function HideTooltip()
    {
      tooltip.css({
           visibility: "hidden"
       });
       tooltip.attr("visibility","hidden");
    }

    node.on("click", function(d) {
      console.log("Click "+d.id+"-"+d.group);
    });
    node.on("mouseover", function(d) {
      ShowTooltip(d.x,d.y,d.id);
      d.group=d.group+12;
      node.attr("r", function(d) { return GetSizeBySelected(GetColorByGroup(d.group)); })
      //node.attr("fill", function(d) { return GetColorByGroup(d.group); })
      console.log(d);
    });
    node.on("mouseout", function(d) {
      HideTooltip();
      d.group=d.group-12;
      node.attr("r", function(d) { return GetSizeBySelected(GetColorByGroup(d.group)); })
      //node.attr("fill", function(d) { return GetColorByGroup(d.group); })
    });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
      }
    });
    function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
}



$(document).ready(function(){
  readyChart();
});

$( window ).resize(function() {
  clearTimeout(this.id);
  this.id = setTimeout(updateSimulation, 500);
});
