var WaffleChart = function() {

  var $_selector,
      $_data,
      $_label,
      $_cellSize,
      $_cellGap,
      $_rows,
      $_columns,
      $_rounded,
      $_keys,
      $_useWidth;

  var defaults = {
    size: 6,
    rows: 50,
    columns: 100,
    rounded: false,
    gap: 2
  };

  function generatedWaffleChart() {

    $_keys = d3.keys($_data[0]);

    var obj = {
      selector: $_selector,
      data: $_data,
      label: $_label,
      size: $_cellSize,
      gap: $_cellGap,
      rows: $_rows,
      columns: $_columns,
      rounded: $_rounded
    };

    drawWaffleChart(obj);
    // generateLegend(this);

  }

  // function generateLegend(d) {
  //   const myColors = d3.scaleOrdinal()
  //     .domain(["Asian/Pacific-Islander", "Black/African-American", "Hispanic/Latino", "White"])
  //     .range(["#EDAE49", "#D1495B", "#00798C", "#424B54"]);

  //   const legendDiv = d3.select("ul#legend");

  //   const legendRow = legendDiv.selectAll("foo")
  //     .data(myColors.domain())
  //     .enter()
  //     .append("div")
  //     .attr('class', 'waffle-chart-legend--items')

  //   legendRow.append("div")
  //     .html("&nbsp")
  //     .attr("class", "rect")
  //     .style("background-color", d => myColors(d));

  //   legendRow.append("div")
  //     .attr('class', 'waffle-chart-legend--text')
  //     .html(d => d);
  // }

  function drawWaffleChart(_obj) {

    if (!_obj.size) { _obj.size = defaults.size; }
    if (!_obj.rows) { _obj.rows = defaults.rows; }
    if (!_obj.columns) { _obj.columns = defaults.columns; }
    if (_obj.gap === undefined) { _obj.gap = defaults.gap; }
    if (_obj.rounded === undefined) { _obj.columns = defaults.rounded; }

    var formattedData = [];
    var domain = [];
    var value = $_keys[$_keys.length - 1];
    var total = d3.sum(_obj.data, function(d) { return d[value]; });

    if ($_useWidth) {
      var forcedWidth = d3.select(_obj.selector).node().getBoundingClientRect().width;
      _obj.columns = Math.floor(forcedWidth / (_obj.size + _obj.gap));
    }

    var squareVal = total / (_obj.rows * _obj.columns);

    _obj.data.forEach(function(d, i) {
      d[value] = +d[value];
      d.units = Math.floor(d[value] / squareVal);
      Array(d.units + 1).join(1).split('').map(function() {
        formattedData.push({
          squareVal: squareVal,
          units: d.units,
          value: d[value],
          groupIndex: i
        });
      });
      domain.push(d[$_keys[0]]);
    });

    let newArr = [];
    _obj.data.forEach(function(d, i) {
        let obj = {};
        obj.age = d['DEATH_COUNT'];
        newArr.push(obj);
    });

    const myColors = d3.scaleOrdinal()
      .domain(["Asian/Pacific-Islander", "Black/African-American", "Hispanic/Latino", "White"])
      .range(["#EDAE49", "#D1495B", "#00798C", "#424B54"]);
    const tempColors = d3.scaleOrdinal()
      .domain(["Asian/Pacific-Islander", "Black/African-American", "Hispanic/Latino", "White"])
      .range(["#ba8839", "#91323f", "#00515e", "#23282d"]);

    // add label
    // if (_obj.label) {
    //   d3.select(_obj.selector)
    //     .append("div")
    //     .attr("class", "label")
    //     .text(_obj.label);
    // }

    // // add legend
    var legend = d3.select("ul#legend")
      .append("div")
      .attr("class", "legend");

    var legendItem = legend.selectAll("div")
      .data(_obj.data)
      .enter()
      .append("div")
      .attr("class", function(d, i) {
        return "legend_item legend_item_" + (i + 1);
      });

    legendItem.append("span")
      .attr("class", "legend_item_text")
        .text(function(d){
          return (d[$_keys[0]] + ": ")
          // return (d[$_keys[0]]+ ": " + (d[value]) + " deaths")
        })
      .append("span")
        .html("<br>")
      .append("span")
      .attr("class", "legend_item_subtitle")
        .text(function(d){
          return ((d[value]) + " deaths")
      });

      legendItem.append("div")
      .attr("class", "legend_item_icon")
        .html("&nbsp")
        .attr("class", "rect")
        .style("background-color", function(d, i) {
          return myColors(i);
      });

    // 
    // if (_obj.rounded) {
    //   legendIcon.style("border-radius", "50%");
    // }

    // set up the dimensions

    var width = (_obj.size * _obj.columns) + (_obj.columns * _obj.gap) - _obj.gap;
    var height = (_obj.size * _obj.rows) + (_obj.rows * _obj.gap) - _obj.gap;

    if ($_useWidth) {
      width = d3.select(_obj.selector).node().getBoundingClientRect().width;
    }

    var svg = d3.select(_obj.selector)
      .append("svg")
      .attr("class", "waffle")
      .attr("width", width)
      .attr("height", height)
       // Container class to make it responsive.
      .classed("svg-container", true) 
      .append("svg")
      // Responsive SVG needs these 2 attributes and no width and height attr.
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + width + " " + height)
      // Class to make it responsive.
      .classed("svg-content-responsive", true);

    var g = svg.append("g")
      .attr('transform', "translate(0, 0)")
      .selectAll("div")
      .data(formattedData)
      .enter()
      .append("rect")
      .attr("width",  _obj.size)
      .attr("height",  _obj.size)
      .attr("rx", (_obj.size / 2))
      .attr("ry", (_obj.size / 2))
      .attr("class", d => 'class' + d.groupIndex + '' )
      .attr("fill", function(d) {
          return myColors(d.groupIndex);
      })
      .attr("x", function(d, i) {
          //group n squares for column
          let col = Math.floor(i /  _obj.rows);
          return (col *  _obj.size) + (col *  _obj.gap);
      })
      .attr("y", function(d, i) {
          let row = i %  _obj.rows;
          return (_obj.rows * (_obj.size + _obj.gap)) - ((row * _obj.size) + (row * _obj.gap)) - _obj.size - _obj.gap;
        })

      .on("mouseover", function(d){
        const classNameOfNodes = 'class' + d.groupIndex + ''
        div.transition()
        .duration(100)
        .style("opacity", 1)
                       
        var element = d3.selectAll('.' + classNameOfNodes)['_groups'][0]         
        element.forEach(function(target, i) {
          element[i].setAttribute("fill", tempColors(_obj.data[d.groupIndex][$_keys[0]]))

          div.html("<span style = 'font-weight: bold'>" + (d["population"] / total * 100).toFixed(2) + "%</span>")
          div.text(_obj.data[d.groupIndex][$_keys[0]] + ": " + Math.round((d.units / formattedData.length) * 100) + "%")
          div.style("visibility", "visible")
          .style("left", (d3.event.pageX - 20) + "px")    
          .style("top", (d3.event.pageY - 35) + "px")
          .attr("class", "tooltip")
        });
      })
      .on("mousemove", function(d){
        div.style("left", (d3.event.pageX - 20) + "px")    
        .style("top", (d3.event.pageY - 65) + "px")
      })
      .on("mouseout", function(d){
        div.transition()
        .duration(100)
        div.style("visibility", "hidden")
        const classNameOfNodes = 'class' + d.groupIndex + ''

        var element = d3.selectAll('.' + classNameOfNodes)['_groups'][0]
        element.forEach(function(target, i) {
          element[i].setAttribute("fill", myColors(_obj.data[d.groupIndex][$_keys[0]]))
      });
        
    });

    // var item = g.selectAll("rect")
    //   .data(formattedData);

    // if (_obj.rounded) {
    //   item
    //     .attr("rx", (_obj.size / 2))
    //     .attr("ry", (_obj.size / 2));
    // }

  }

  generatedWaffleChart.selector = function(value){
    if (!arguments.length) { return $_selector; }
    $_selector = value;
    return generatedWaffleChart;
  }

  generatedWaffleChart.data = function(value){
    if (!arguments.length) { return $_data; }
    $_data = value;
    return generatedWaffleChart;
  }

  generatedWaffleChart.useWidth = function(value){
    if (!arguments.length) { return $_useWidth; }
    $_useWidth = value;
    return generatedWaffleChart;
  }

  generatedWaffleChart.label = function(value){
    if (!arguments.length) { return $_label; }
    $_label = value;
    return generatedWaffleChart;
  }

  generatedWaffleChart.size = function(value){
    if (!arguments.length) { return $_cellSize; }
    $_cellSize = value;
    return generatedWaffleChart;
  }

  generatedWaffleChart.gap = function(value){
    if (!arguments.length) { return $_cellGap; }
    $_cellGap = value;
    return generatedWaffleChart;
  }

  generatedWaffleChart.rows = function(value){
    if (!arguments.length) { return $_rows; }
    $_rows = value;
    return generatedWaffleChart;
  }

  generatedWaffleChart.columns = function(value){
    if (!arguments.length) { return $_columns; }
    $_columns = value;
    return generatedWaffleChart;
  }

  generatedWaffleChart.rounded = function(value){
    if (!arguments.length) { return $_rounded; }
    $_rounded = value;
    return generatedWaffleChart;
  }

  return generatedWaffleChart;

};