    const url = 'json/swingData.json';
    const axArray = []
    const ayArray = []
    const azArray = []
    const wxArray = []
    const wyArray = []
    const wzArray = []
    const timeArray = []
    const threshold = .1;
    const thresholdLo = .05;
    const thresholdHi = .2;

    const charInfo = document.getElementsByClassName('chart-info');
    const questionTwo = document.getElementById("questionTwo");

    window.onload = function() {

        document.getElementById("getSwingData").onclick = function() {
            getData();
        };
        document.getElementById("generateChart").onclick = function() {
            generateChart();
            for (var i = 0; i < charInfo.length; i += 1) {
                charInfo[i].style.display = 'block';
            }
        };

        function getData() {
            fetch(url)
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonData) {
                    var obj = jsonData;

                    obj.forEach(function(data) {
                        let timeStamp = data.timestamp;
                        let ax = data.ax;
                        let ay = data.ay;
                        let az = data.az;
                        let wx = data.wx;
                        let wy = data.wy;
                        let wz = data.wz;

                        axArray.push(parseFloat(ax));
                        ayArray.push(parseFloat(ay));
                        azArray.push(parseFloat(az));
                        wxArray.push(parseFloat(wx));
                        wyArray.push(parseFloat(wy));
                        wzArray.push(parseFloat(wz));

                    })

                    findThreshold();

                });

        }

    }

    function generateChart() {
        // set the dimensions and margins of the graph
        var margin = { top: 20, right: 20, bottom: 30, left: 50 },
            width = 5000 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // parse the date / time
        var formatMillisecond = d3.timeFormat(".%L");

        // set the ranges
        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // define the line
        var valueline = d3.line()
            .x(function(d) { return x(d.timestamp); })
            .y(function(d) { return y(d.ax); });
        // define the line
        var valueline2 = d3.line()
            .x(function(d) { return x(d.timestamp); })
            .y(function(d) { return y(d.ay); });
        // define the line
        var valueline3 = d3.line()
            .x(function(d) { return x(d.timestamp); })
            .y(function(d) { return y(d.az); });
        // define the line
        var valueline4 = d3.line()
            .x(function(d) { return x(d.timestamp); })
            .y(function(d) { return y(d.wx); });
        // define the line
        var valueline5 = d3.line()
            .x(function(d) { return x(d.timestamp); })
            .y(function(d) { return y(d.wy); });
        // define the line
        var valueline6 = d3.line()
            .x(function(d) { return x(d.timestamp); })
            .y(function(d) { return y(d.wz); });

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select(".chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        function draw(data) {

            var data = data;


            // format the data
            data.forEach(function(d) {
                d.timestamp = (+d.timestamp);

                d.ax = +d.ax;
                d.ay = +d.ay;
                d.az = +d.az;
                d.wx = +d.wx;
                d.wy = +d.wy;
                d.wz = +d.wz;
            });

            // Scale the range of the data
            x.domain(d3.extent(data, function(d) { return d.timestamp; }));
            y.domain([-60, d3.max(data, function(d) {
                return Math.max(d.ax, d.ay, d.az, d.wx, d.wy, d.wz);
            })]);

            // Add the valueline path.
            svg.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", valueline);
            // Add the valueline path.
            svg.append("path")
                .data([data])
                .attr("class", "line2")
                .attr("d", valueline2);
            // Add the valueline path.
            svg.append("path")
                .data([data])
                .attr("class", "line3")
                .attr("d", valueline3);
            // Add the valueline path.
            svg.append("path")
                .data([data])
                .attr("class", "line4")
                .attr("d", valueline4);
            // Add the valueline path.
            svg.append("path")
                .data([data])
                .attr("class", "line5")
                .attr("d", valueline5);
            // Add the valueline path.
            svg.append("path")
                .data([data])
                .attr("class", "line6")
                .attr("d", valueline6);
            // Add the X Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add the Y Axis
            svg.append("g")
                .call(d3.axisLeft(y));

        }
        // Get the data
        d3.json(url, function(error, data) {
            if (error) throw error;

            // trigger render
            draw(data);
        });

    }

    function findThreshold() {

        var sumAx = axArray.reduce((x, y) => x + y);
        var sumAy = ayArray.reduce((x, y) => x + y);
        var sumAz = azArray.reduce((x, y) => x + y);
        var sumWx = wxArray.reduce((x, y) => x + y);
        var sumWy = wyArray.reduce((x, y) => x + y);
        var sumWz = wzArray.reduce((x, y) => x + y);

        let axThreshold = Math.abs(sumAx * threshold);
        let ayThreshold = Math.abs(sumAy * threshold);
        let azThreshold = Math.abs(sumAz * threshold);
        let wxThreshold = Math.abs(sumWx * threshold);
        let wyThreshold = Math.abs(sumWy * threshold);
        let wzThreshold = Math.abs(sumWz * threshold);

        var displayAxData = document.getElementById("axTable");
        var displayAyData = document.getElementById("ayTable");
        var displayAzData = document.getElementById("azTable");
        var displayWxData = document.getElementById("wxTable");
        var displayWyData = document.getElementById("wyTable");
        var displayWzData = document.getElementById("wzTable");

        let outputAxTable = "<div class='table-responsive'><table class='table table-striped table-bordered'><thead><tr><th>ax</th><th>index</th></tr></thead><tbody><tr>";
        let outputAyTable = "<div class='table-responsive'><table class='table table-striped table-bordered'><thead><tr><th>ay</th><th>index</th></tr></thead><tbody><tr>";
        let outputAzTable = "<div class='table-responsive'><table class='table table-striped table-bordered'><thead><tr><th>az</th><th>index</th></tr></thead><tbody><tr>";
        let outputWyTable = "<div class='table-responsive'><table class='table table-striped table-bordered'><thead><tr><th>wy</th><th>index</th></tr></thead><tbody><tr>";
        let outputWxTable = "<div class='table-responsive'><table class='table table-striped table-bordered'><thead><tr><th>wx</th><th>index</th></tr></thead><tbody><tr>";
        let outputWzTable = "<div class='table-responsive'><table class='table table-striped table-bordered'><thead><tr><th>wz</th><th>index</th></tr></thead><tbody><tr>";

        findAxThreshold();
        findAxLoHi();
        findAyThreshold();
        findAyLoHi();
        findAzThreshold();
        findAzLoHi();
        findWxThreshold();
        findWxLoHi();
        findWyThreshold();
        findWyLoHi();
        findWzThreshold();
        findWzLoHi();


        function findAxLoHi() {

            //search data for values that are higher than thresholdLo and lower than thresholdHi.
            var axLoHi = axArray.find(function(element) {
                return Math.abs(element) > (sumAx * thresholdLo) && Math.abs(element) < (sumAx * thresholdHi);
            });

            if (typeof(axLoHi) === "undefined") {
                axLoHi = "false";
            }

            var axLoHiIndex = (axArray.indexOf(axLoHi) + 1);

            outputAxTable += "<div class='table-responsive'><table class='table table-striped table-bordered'><thead><tr><th>ax</th><th>index</th></tr></thead><tbody><tr><td>" + axLoHi + "</td>" + "<td>" + axLoHiIndex + "</td>" + "</tr></tbody></table></div>";
            displayAxData.innerHTML = outputAxTable;
        }

        function findAyLoHi() {

            //search data for values that are higher than thresholdLo and lower than thresholdHi.
            var ayLoHi = ayArray.find(function(element) {
                return Math.abs(element) > (sumAy * thresholdLo) && Math.abs(element) < (sumAy * thresholdHi);
            });

            if (typeof(ayLoHi) === "undefined") {
                ayLoHi = "false";
            } 

            var ayLoHiIndex = (ayArray.indexOf(ayLoHi) + 1);

            outputAyTable += "<div class='table-responsive'><table class='table table-striped table-bordered'><thead><tr><th>ay</th><th>index</th></tr></thead><tbody><tr><td>" + ayLoHi + "</td>" + "<td>" + ayLoHiIndex + "</td>" + "</tr></tbody></table></div>";
            displayAyData.innerHTML = outputAyTable;
        }

        function findAzLoHi() {

            //search data for values that are higher than thresholdLo and lower than thresholdHi.
            var azLoHi = azArray.find(function(element) {
                return Math.abs(element) > (sumAz * thresholdLo) && Math.abs(element) < (sumAz * thresholdHi);
            });

            if (typeof(azLoHi) === "undefined") {
                azLoHi = "false";
            }

            var azLoHiIndex = (azArray.indexOf(azLoHi) + 1);

            outputAzTable += "<div class='table-responsive'><table class='table table-striped table-bordered'><thead><tr><th>az</th><th>index</th></tr></thead><tbody><tr><td>" + azLoHi + "</td>" + "<td>" + azLoHiIndex + "</td>" + "</tr></tbody></table></div>";
            displayAzData.innerHTML = outputAzTable;
        }

        function findWxLoHi() {

            //search data for values that are higher than thresholdLo and lower than thresholdHi.
            var wxLoHi = wxArray.find(function(element) {
                return Math.abs(element) > (sumWx * thresholdLo) && Math.abs(element) < (sumWx * thresholdHi);
            });

            if (typeof(WxLoHi) === "undefined") {
                wxLoHi = "false";
            }

            var wxLoHiIndex = (wxArray.indexOf(wxLoHi) + 1);

            outputWxTable += "<div class='table-responsive'><table class='table table-striped table-bordered'><thead><tr><th>wx</th><th>index</th></tr></thead><tbody><tr><td>" + wxLoHi + "</td>" + "<td>" + wxLoHiIndex + "</td>" + "</tr></tbody></table></div>";
            displayWxData.innerHTML = outputWxTable;
        }

        function findWyLoHi() {

            //search data for values that are higher than thresholdLo and lower than thresholdHi.
            var wyLoHi = wyArray.find(function(element) {
                return Math.abs(element) > (sumWy * thresholdLo) && Math.abs(element) < (sumWy * thresholdHi);
            });

            if (typeof(WyLoHi) === "undefined") {
                wyLoHi = "false";
            }

            var wyLoHiIndex = (wyArray.indexOf(wyLoHi) + 1);

            outputWyTable += "<div class='table-responsive'><table class='table table-striped table-bordered'><thead><tr><th>wy</th><th>index</th></tr></thead><tbody><tr><td>" + wyLoHi + "</td>" + "<td>" + wyLoHiIndex + "</td>" + "</tr></tbody></table></div>";
            displayWyData.innerHTML = outputWyTable;
        }

        function findWzLoHi() {

            //search data for values that are higher than thresholdLo and lower than thresholdHi.
            var wzLoHi = wzArray.find(function(element) {
                return Math.abs(element) > (sumWz * thresholdLo) && Math.abs(element) < (sumWz * thresholdHi);
            });

            if (typeof(WzLoHi) === "undefined") {
                wzLoHi = "false";
            }

            var wzLoHiIndex = (wzArray.indexOf(wzLoHi) + 1);

            outputWzTable += "<div class='table-responsive'><table class='table table-striped table-bordered'><thead><tr><th>wz</th><th>index</th></tr></thead><tbody><tr><td>" + wzLoHi + "</td>" + "<td>" + wzLoHiIndex + "</td>" + "</tr></tbody></table></div>";
            displayWzData.innerHTML = outputWzTable;
        }



        function findAxThreshold() {

            //find the first index where data is higher than ax threshold
            var axFound = axArray.find(function(element) {
                return Math.abs(element) > axThreshold;
            });

            if (typeof(axFound) === "undefined") {
                axFound = "false";
            }

            var axFoundIndex = (axArray.indexOf(axFound) + 1);

            outputAxTable += "<td>" + axFound + "</td>" + "<td>" + axFoundIndex + "</td>" + "</tr></tbody></table></div>";
            displayAxData.innerHTML = outputAxTable;

        }


        function findAyThreshold() {
            //find the first index where data is higher than ay threshold
            var ayFound = ayArray.find(function(element) {
                return Math.abs(element) > ayThreshold;
            });

            if (typeof(ayFound) === "undefined") {
                ayFound = "false";
            }

            var ayFoundIndex = (ayArray.indexOf(ayFound) + 1);

            outputAyTable += "<td>" + ayFound + "</td>" + "<td>" + ayFoundIndex + "</td>" + "</tr></tbody></table></div>";
            displayAyData.innerHTML = outputAyTable;
        }

        function findAzThreshold() {
            //find the first index where data is higher than az threshold
            var azFound = azArray.find(function(element) {
                return Math.abs(element) > azThreshold;
            });

            if (typeof(azFound) === "undefined") {
                azFound = "false";
            }

            var azFoundIndex = (azArray.indexOf(azFound) + 1);

            outputAzTable += "<td>" + azFound + "</td>" + "<td>" + azFoundIndex + "</td>" + "</tr></tbody></table></div>";
            displayAzData.innerHTML = outputAzTable;
        }

        function findWxThreshold() {
            //find the first index where data is higher than wx threshold
            var wxFound = wxArray.find(function(element) {
                return Math.abs(element) > wxThreshold;
            });

            if (typeof(wxFound) === "undefined") {
                wxFound = "false";
            }

            var wxFoundIndex = (wxArray.indexOf(wxFound) + 1);

            outputWxTable += "<td>" + wxFound + "</td>" + "<td>" + wxFoundIndex + "</td>" + "</tr></tbody></table></div>";
            displayWxData.innerHTML = outputWxTable;

        }

        function findWyThreshold() {
            //find the first index where data is higher than wy threshold
            var wyFound = wyArray.find(function(element) {
                return Math.abs(element) > wyThreshold;
            });

            if (typeof(wyFound) === "undefined") {
                wyFound = "false";
            }

            var wyFoundIndex = (wyArray.indexOf(wyFound) + 1);

            outputWyTable += "<td>" + wyFound + "</td>" + "<td>" + wyFoundIndex + "</td>" + "</tr></tbody></table></div>";
            displayWyData.innerHTML = outputWyTable;

        }

        function findWzThreshold() {
            //find the first index where data is higher than wz threshold
            var wzFound = wzArray.find(function(element) {
                return Math.abs(element) > wzThreshold;
            });

            if (typeof(wzFound) === "undefined") {
                wzFound = "false";
            }

            var wzFoundIndex = (wzArray.indexOf(wzFound) + 1);

            outputWzTable += "<td>" + wzFound + "</td>" + "<td>" + wzFoundIndex + "</td>" + "</tr></tbody></table></div>";
            displayWzData.innerHTML = outputWzTable;

        }
    }