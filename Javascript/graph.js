var svgg = d3.select("#graphSvg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +parseInt($(window).width()) - margin.left - margin.right,
    height = +500 - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var xAxis=d3.axisBottom(x);
var yAxis=d3.axisLeft(y).ticks(10, "%");

var g = svgg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data=""

$("#graphTitle").text("Gráfica de frecuencias por año para la palabra"+" \""+"live"+"\"");
$("#graphLoader").hide();

d3.json("Resources/datag.json",function(error, data) {
  if (error) throw error;
  this.data=data;

  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .style("font-size","7")
            .attr("transform", "rotate(-65)" );

  g.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("y", function(d) { return y(d.frequency); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.frequency); });
});

function updateGraph(){
  var w=$("#palabra_g").val();
  if(w==""){
    w="live";
  }
  var text="Gráfica de frecuencias por año para la palabra"+" \""+w+"\"";
  $("#graphTitle").text(text);
  $("#graphLoader").hide();
  console.log("updateGraph with "+text);

  svgg.selectAll("g").remove();

  width = +parseInt($(window).width()) - margin.left - margin.right,
  height = +500 - margin.top - margin.bottom;

  x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
  y = d3.scaleLinear().rangeRound([height, 0]);

  xAxis=d3.axisBottom(x);
  yAxis=d3.axisLeft(y).ticks(10, "%");

  var g = svgg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function(d) { return d.letter; }));
    y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .style("font-size","7")
            .attr("transform", "rotate(-65)" );

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10, "%"))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Frequency");

    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.letter); })
        .attr("y", function(d) { return y(d.frequency); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.frequency); });

        d3.select("#sortInput").on("change", change);

        var sortTimeout = setTimeout(function() {
            d3.select("#sortInput").property("checked", true).each(change);
          }, 1000);

          function change() {
            console.log("change");
            clearTimeout(sortTimeout);

            // Copy-on-write since tweens are evaluated after a delay.
            var x0 = x.domain(data.sort(this.checked
                ? function(a, b) { return b.frequency - a.frequency; }
                : function(a, b) { return d3.ascending(a.letter, b.letter); })
                .map(function(d) { return d.letter; }))
                .copy();

            svgg.selectAll(".bar")
                .sort(function(a, b) { return x0(a.letter) - x0(b.letter); });

            var transition = svgg.transition().duration(750),
                delay = function(d, i) { return i * 50; };

            transition.selectAll(".bar")
                .delay(delay)
                .attr("x", function(d) { return x0(d.letter); });

            transition.select(".axis.axis--x")
                .call(xAxis)
              .selectAll("g")
                .delay(delay);
            //updateGraph();
          }
}

$("#graph-button").click(function() {
  var frase=$("#palabra_g").val();

  if(frase!=""){
    $("#graphTitle").text("Calculando datos");
    $("#graphLoader").show();
    console.log(frase);
    graphDataWord(frase);
  }
});

function graphDataWord(word){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callbackFuncG(xmlHttp.responseText);
    }
    xmlHttp.open("GET",
    "http://35.162.123.30:1338/api/v1/update_freqs/"+word,
    true); // true for asynchronous
    xmlHttp.send(null);
}

function callbackFuncG(response) {
  //if (xhr.readyState == 4 && xhr.status == 200) {
    console.log(response);
    data=JSON.parse(response);
    console.log(data)
    updateGraph();
  //}
}


/*
  d3.select("input").on("change", change);

  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.frequency - a.frequency; }
        : function(a, b) { return d3.ascending(a.letter, b.letter); })
        .map(function(d) { return d.letter; }))
        .copy();

    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.letter) - x0(b.letter); });

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.letter); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }*/
