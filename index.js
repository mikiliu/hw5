/**
 * This example shows how to plot points on a map
 * and how to work with normal geographical data that
 * is not in GeoJSON form
 * 
 * Outline:
 * 1. show how to load multiple files of data 
 * 2. talk about how geoAlbers() is a scaling function
 * 3. show how to plot points with geoAlbers
 */
const m = {
    width: 800,
    height: 600
}

const svg = d3.select("body").append('svg')
    .attr('width', m.width)
    .attr('height', m.height)

const g = svg.append('g')

window.onload = function() {
    d3.json('nygeo.json').then(function(data) {
        d3.csv('data.csv').then(function(pointData) {

            const albersProj = d3.geoAlbers()
                .scale(70000)
                .rotate([74.006, 0]) // 71.057 negative longitude of boston
                .center([0, 40.7128]) // 42.313 latitude of boston
                .translate([m.width/2, m.height/2]);

            const geoPath = d3.geoPath()
            .projection(albersProj)

            g.selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
                .attr('fill', '#ccc')
                .attr('d', geoPath)

            // plots circles on the boston map
            g.selectAll('.circle')
                .data(pointData)
                .enter()
                .append('circle')
                    .attr('cx', function(d) { 
                        let scaledPoints = albersProj([d.long, d.lat])
                        return scaledPoints[0]
                    })
                    .attr('cy', function(d) {
                        let scaledPoints = albersProj([d.long, d.lat])
                        return scaledPoints[1]
                    })
                    .attr('r', 2)
                    .attr('fill', 'steelblue')
                    .on( "click", function(){
                        d3.select(this)
                        .attr("opacity",1)
                        .transition()
                        .duration( 700 )
                        .attr( "cx", m.width * Math.round( Math.random()))
                        .attr( "cy", m.height * Math.round( Math.random()))
                        .attr( "opacity", 0 )
                        .on("end",function(){
                            d3.select(this).remove();
                        })
                    });
        })
    })
}
