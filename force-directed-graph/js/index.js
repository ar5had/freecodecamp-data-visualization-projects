
function plot() {
  var width = window.innerWidth ;
  var height = window.innerHeight;
  
	var graph = d3.select("body")
		.append("div")
		.style("width", width + "px")
    .style("height", height + "px")
    .attr("id", "graph");
	
  var svg = d3.select("body")
		.append("svg")
    .attr("width", width)
    .attr("height", height);
  
  var fdg = d3.forceSimulation()
      .force("link", d3.forceLink())
      .force("charge", d3.forceManyBody().strength(-2.5))
      .force("center", d3.forceCenter(width/2, height/2));
  
  d3.json("https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json", function(error, data) {
    if(error) throw error;
    
    var div = d3.select(".tooltip");
    
		var node = graph
			.attr("class", "nodes")
      .selectAll("img")
      .data(data.nodes)
      .enter().append("img")
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
			.on("mouseover", function(d){
        div.transition()
          .duration(100)
          .style("opacity", 1);
        div.html('<span>'+d.country+'<span>');
        div.style("left",  (d3.event.pageX + 30) + "px")
          .style("top", (d3.event.pageY - 30) + "px");
      })
			.on("mouseout", function(){
        div.transition()
          .duration(100)
          .style("opacity", 0)
        div
          .style("left", "-999px")
          .style("top", "-999px");
      })
      .attr("class", function(d){ return "node flag flag-" + d.code}  );
		
    var link = svg.append("g")
        .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter().append("line")
      .attr("class", "link");
      
    fdg
      .nodes(data.nodes)
      .on('tick', tick);
    
    fdg.force("link")
      .links(data.links)
      .distance(30);
    function tick() {
      
			node
        .style("top", function(d) { return d.y + "px"; } )
        .style("left", function(d) { return d.x + "px"; });
			
      link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
      
      
    }
    
  
  });  


function dragstarted(d) {
  if (!d3.event.active) fdg.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) fdg.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}


}

plot();