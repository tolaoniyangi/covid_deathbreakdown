function totalCount(data) {
    var totalDeaths = d3.sum(data.map(function(d){ return d.DEATH_COUNT}));
    var totalDeaths = d3.sum(data, function(d){return parseFloat(d.DEATH_COUNT);})
    const data = d.DEATH_COUNTS;
    d3.select("div#count")
    .append("text")
    .text(totalDeaths)
}