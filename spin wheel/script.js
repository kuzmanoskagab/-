var padding = {top:20, right:40, bottom:0, left:0},
    w = window.innerWidth - padding.left - padding.right,
    h = window.innerHeight - padding.top - padding.bottom,
    r = Math.min(w, h)/2,  // This will adjust according to the increased dimensions
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    oldpick = [];
            //randomNumbers = getRandomNumbers();
        //http://osric.com/bingo-card-generator/?title=HTML+and+CSS+BINGO!&words=padding%2Cfont-family%2Ccolor%2Cfont-weight%2Cfont-size%2Cbackground-color%2Cnesting%2Cbottom%2Csans-serif%2Cperiod%2Cpound+sign%2C%EF%B9%A4body%EF%B9%A5%2C%EF%B9%A4ul%EF%B9%A5%2C%EF%B9%A4h1%EF%B9%A5%2Cmargin%2C%3C++%3E%2C{+}%2C%EF%B9%A4p%EF%B9%A5%2C%EF%B9%A4!DOCTYPE+html%EF%B9%A5%2C%EF%B9%A4head%EF%B9%A5%2Ccolon%2C%EF%B9%A4style%EF%B9%A5%2C.html%2CHTML%2CCSS%2CJavaScript%2Cborder&freespace=true&freespaceValue=Web+Design+Master&freespaceRandom=false&width=5&height=5&number=35#results
        var data = [
                    {"label":"DIGITAL MARKETING",  "value":1,  "question":"You won 15% discount on this course!"}, // padding
                    {"label":"COACHING ACADEMY",  "value":2,  "question":"You won 10% discount on this course!"}, //font-family
                    {"label":"FINANCE TRAINING",  "value":3,  "question":"You won 10% discount on this course!"}, //color
                    {"label":"IT SKILLS FOR BUSINESS",  "value":4,  "question":"You won 20% discount on this course!"}, //font-weight
                    {"label":"LEADERS OF TOMORROW",  "value":5,  "question":"You won 20% discount on this course"}, //font-size
                    {"label":"CYBER SECURITY",  "value":6,  "question":"You won 15% discount on this course!"}, //background-color
                    {"label":"EXPORT&LOGISTICS",  "value":7,  "question":"You won 20% discount on this course!"}, //nesting
                    {"label":"EXELLENCE IN RETAIL",  "value":8,  "question":"You won 15% discount on this course!"}, //bottom
                    {"label":"PRESENTATION AND NEG.",  "value":9,  "question":"You won 50% discount on this course!"}, //sans-serif
                    {"label":"AI FOR MANAGERS", "value":10, "question":"You won 10% discount on this course!"}
        ];
        var svg = d3.select('#chart')
        .append("svg")
        .data([data])
        .attr("width", "100vw")  // viewport width
        .attr("height", "100vh")  // viewport height
        var container = svg.append("g")
            .attr("class", "chartholder")
            .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");
        var vis = container
            .append("g");
            
        var pie = d3.layout.pie().sort(null).value(function(d){return 1;});
        // declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r);
        // select paths, use arc generator to draw
        var arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
            .append("g")
            .attr("class", "slice");
            
        arcs.append("path")
        .attr("fill", function(d, i){
            var colors = ["#2E3191", "#8BC53F"];  // Define the colors array
            return colors[i % colors.length];    // Cycle through the colors
        })
        .attr("d", function (d) { return arc(d); });
        // add the text
        arcs.append("text")
        .attr("transform", function(d){
            d.innerRadius = 0;
            d.outerRadius = r;
            d.angle = (d.startAngle + d.endAngle)/2;
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 30) +")";  // Adjust this translation value to push text further out
        })
        .attr("text-anchor", "end")
        .style("font-size", "18px")  // Can adjust this as per your preference
        .style("fill", "#FFFFFF")
        .text( function(d, i) {
            return data[i].label;
        });      
        container.on("click", spin);
        function spin(d){
            
            container.on("click", null);
            //all slices have been seen, all done
            console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
            if(oldpick.length == data.length){
                console.log("done");
                container.on("click", null);
                return;
            }
            var  ps       = 360/data.length,
                 pieslice = Math.round(1440/data.length),
                 rng      = Math.floor((Math.random() * 1440) + 360);
                
            rotation = (Math.round(rng / ps) * ps);
            
            picked = Math.round(data.length - (rotation % 360)/ps);
            picked = picked >= data.length ? (picked % data.length) : picked;
            if(oldpick.indexOf(picked) !== -1){
                d3.select(this).call(spin);
                return;
            } else {
                oldpick.push(picked);
            }
            rotation += 90 - Math.round(ps/2);
            vis.transition()
                .duration(3000)
                .attrTween("transform", rotTween)
                .each("end", function(){

                    d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                        .attr("fill", "#111");
                    //populate question
                    d3.select("#question h1")
                        .text(data[picked].question);
                    oldrotation = rotation;
              
                    /* Get the result value from object "data" */
                    console.log(data[picked].value)
              
                    /* Comment the below line for restrict spin to sngle time */
                    container.on("click", spin);
                });
        }
        //make arrow
        svg.append("g")
            .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
            .append("path")
            .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
            .style({"fill":"black"});
        //draw spin circle
        container.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 60)
            .style({"fill":"white","cursor":"pointer"});
        container.append("image")
            .attr('xlink:href', 'spin_button.png')  // link to your image
            .attr("x", -50) // position image at the center (assuming image is 100x100)
            .attr("y", -50) 
            .attr("width", 100)
            .attr("height", 100);

        
        
        function rotTween(to) {
          var i = d3.interpolate(oldrotation % 360, rotation);
          return function(t) {
            return "rotate(" + i(t) + ")";
          };
        }
        
        
        function getRandomNumbers(){
            var array = new Uint16Array(1000);
            var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
            if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
                window.crypto.getRandomValues(array);
                console.log("works");
            } else {
                //no support for crypto, get crappy random numbers
                for(var i=0; i < 1000; i++){
                    array[i] = Math.floor(Math.random() * 100000) + 1;
                }
            }
            return array;
        }