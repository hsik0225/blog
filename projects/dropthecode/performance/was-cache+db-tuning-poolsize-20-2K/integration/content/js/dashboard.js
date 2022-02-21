/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.974712232210833, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9996831614724351, 500, 1500, "vuser-10 리뷰 수정"], "isController": false}, {"data": [0.9989361348449084, 500, 1500, "vuser-30 로그인"], "isController": false}, {"data": [0.8959306481373739, 500, 1500, "vuser-30 리뷰어 목록 조회"], "isController": false}, {"data": [0.999942402948969, 500, 1500, "vuser-10 언어 및 기술 목록 조회"], "isController": false}, {"data": [0.9991264447260301, 500, 1500, "vuser-10 리뷰어 목록 조회"], "isController": false}, {"data": [0.9996928039321097, 500, 1500, "vuser-10 내가 받은 리뷰 목록 조회"], "isController": false}, {"data": [0.9987942790620322, 500, 1500, "vuser-30 리뷰 수정"], "isController": false}, {"data": [0.9981730392796555, 500, 1500, "vuser-50 내가 리뷰한 리뷰 목록 조회"], "isController": false}, {"data": [0.9994431330828818, 500, 1500, "vuser-30 언어 및 기술 목록 조회"], "isController": false}, {"data": [0.9968513442965283, 500, 1500, "vuser-50 리뷰 수정"], "isController": false}, {"data": [0.9999231936097084, 500, 1500, "vuser-10 리뷰 상세 조회"], "isController": false}, {"data": [0.9984431293914348, 500, 1500, "vuser-50 로그인"], "isController": false}, {"data": [0.9999423952072812, 500, 1500, "vuser-10 내가 리뷰한 리뷰 목록 조회"], "isController": false}, {"data": [0.9984036184648131, 500, 1500, "vuser-30 내가 받은 리뷰 목록 조회"], "isController": false}, {"data": [0.998960654538198, 500, 1500, "vuser-30 내가 리뷰한 리뷰 목록 조회"], "isController": false}, {"data": [0.9992433565038081, 500, 1500, "vuser-30 리뷰 상세 조회"], "isController": false}, {"data": [0.9988995402523722, 500, 1500, "vuser-50 언어 및 기술 목록 조회"], "isController": false}, {"data": [0.5537024356842414, 500, 1500, "vuser-50 리뷰어 목록 조회"], "isController": false}, {"data": [0.9996544243285272, 500, 1500, "vuser-10 로그인"], "isController": false}, {"data": [0.9964692835825764, 500, 1500, "vuser-50 리뷰어 단일 조회"], "isController": false}, {"data": [0.9986949216137294, 500, 1500, "vuser-50 리뷰 상세 조회"], "isController": false}, {"data": [0.9983539231498263, 500, 1500, "vuser-30 리뷰어 단일 조회"], "isController": false}, {"data": [0.9999136011059059, 500, 1500, "vuser-10 리뷰어 단일 조회"], "isController": false}, {"data": [0.9979612473903967, 500, 1500, "vuser-50 내가 받은 리뷰 목록 조회"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1388359, 0, 0.0, 116.42892940514436, 4, 7254, 101.0, 574.0, 776.0, 1021.0, 257.0874267499553, 300.93105724643993, 50.08407684100051], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["vuser-10 리뷰 수정", 52077, 0, 0.0, 37.36134954010437, 10, 1065, 31.0, 54.0, 60.0, 165.0, 29.0166532198751, 5.379511416562844, 13.743239073866624], "isController": false}, {"data": ["vuser-30 로그인", 60158, 0, 0.0, 59.91846470959769, 11, 2201, 52.0, 87.0, 106.0, 215.0, 33.42135248754574, 24.980362705397315, 5.3200004447948785], "isController": false}, {"data": ["vuser-30 리뷰어 목록 조회", 60157, 0, 0.0, 419.45647223099087, 53, 7254, 409.0, 553.9000000000015, 596.0, 717.0, 33.419441574169745, 164.8126757319895, 4.56906427771852], "isController": false}, {"data": ["vuser-10 언어 및 기술 목록 조회", 52086, 0, 0.0, 20.620953807164963, 4, 1004, 13.0, 36.0, 40.0, 58.0, 28.986378305460534, 18.5127845818078, 3.5949902781186402], "isController": false}, {"data": ["vuser-10 리뷰어 목록 조회", 52086, 0, 0.0, 117.61590446569207, 36, 6571, 109.0, 155.0, 171.0, 229.9900000000016, 28.99110552036602, 142.97371374789884, 3.963627707862542], "isController": false}, {"data": ["vuser-10 내가 받은 리뷰 목록 조회", 52084, 0, 0.0, 40.74078411796346, 10, 1421, 36.0, 56.0, 63.0, 162.9900000000016, 29.014070855075037, 18.10546023085249, 8.245209588698083], "isController": false}, {"data": ["vuser-30 리뷰 수정", 60130, 0, 0.0, 87.33234658240579, 11, 2195, 79.0, 125.0, 148.0, 293.9100000000144, 33.42066912481533, 6.196086513220424, 15.8291255132182], "isController": false}, {"data": ["vuser-50 내가 리뷰한 리뷰 목록 조회", 61304, 0, 0.0, 77.20584301187495, 8, 2826, 67.0, 124.0, 159.0, 311.9600000000064, 34.07591373631077, 21.264168825686117, 4.492430033595658], "isController": false}, {"data": ["vuser-30 언어 및 기술 목록 조회", 60158, 0, 0.0, 42.61110741713523, 4, 1758, 38.0, 67.0, 80.0, 179.0, 33.4217609786857, 21.34553875005903, 4.1450816838799645], "isController": false}, {"data": ["vuser-50 리뷰 수정", 61296, 0, 0.0, 139.73827003393203, 13, 5030, 129.0, 207.0, 243.0, 428.9200000000128, 34.07169419075835, 6.316979453858468, 16.137472346208792], "isController": false}, {"data": ["vuser-10 리뷰 상세 조회", 52079, 0, 0.0, 26.22575318266483, 6, 700, 20.0, 43.0, 47.0, 88.0, 29.01642568493284, 25.1626816486527, 3.598716857408663], "isController": false}, {"data": ["vuser-50 로그인", 61341, 0, 0.0, 87.08413622210223, 11, 2805, 79.0, 136.0, 164.0, 325.950000000008, 34.07687560032154, 25.469099833125195, 5.424346409035558], "isController": false}, {"data": ["vuser-10 내가 리뷰한 리뷰 목록 조회", 52079, 0, 0.0, 28.721480827204736, 7, 872, 25.0, 43.0, 48.0, 153.0, 29.0163771844882, 18.106899434460896, 3.8254012889706117], "isController": false}, {"data": ["vuser-30 내가 받은 리뷰 목록 조회", 60136, 0, 0.0, 82.28665025941254, 14, 3660, 73.0, 116.0, 138.0, 279.9700000000048, 33.42043750673844, 20.855136295708853, 9.49740948677821], "isController": false}, {"data": ["vuser-30 내가 리뷰한 리뷰 목록 조회", 60134, 0, 0.0, 51.24585093291608, 7, 3718, 44.0, 75.0, 89.0, 199.0, 33.42283662250047, 20.85663340017363, 4.406331000036683], "isController": false}, {"data": ["vuser-30 리뷰 상세 조회", 60134, 0, 0.0, 52.1545548275518, 7, 2145, 46.0, 75.0, 90.0, 198.0, 33.42227933342189, 28.983382859451794, 4.145145972016191], "isController": false}, {"data": ["vuser-50 언어 및 기술 목록 조회", 61338, 0, 0.0, 59.33445824774186, 5, 3403, 51.0, 103.0, 128.0, 208.0, 34.07939301810812, 21.76554983773702, 4.226643470019268], "isController": false}, {"data": ["vuser-50 리뷰어 목록 조회", 61338, 0, 0.0, 729.5363722325501, 39, 4587, 714.0, 975.0, 1059.0, 1246.0, 34.07547402507579, 168.04799201819603, 4.65875621436583], "isController": false}, {"data": ["vuser-10 로그인", 52087, 0, 0.0, 33.571793345748766, 9, 2994, 30.0, 47.0, 52.0, 153.0, 28.937897439829154, 21.62907835471022, 4.606325471379054], "isController": false}, {"data": ["vuser-50 리뷰어 단일 조회", 61319, 0, 0.0, 167.32962050913994, 12, 5473, 155.0, 256.0, 297.0, 513.9900000000016, 34.07353156909728, 25.383461981720465, 4.259191446137159], "isController": false}, {"data": ["vuser-50 리뷰 상세 조회", 61299, 0, 0.0, 75.15532064144588, 7, 4645, 65.0, 121.0, 155.0, 285.9900000000016, 34.07341857570787, 29.548042671121667, 4.2259024991356435], "isController": false}, {"data": ["vuser-30 리뷰어 단일 조회", 60143, 0, 0.0, 100.87967011954699, 11, 5442, 91.0, 149.0, 174.0, 281.0, 33.41962880168212, 24.896329333450858, 4.177453600210265], "isController": false}, {"data": ["vuser-10 리뷰어 단일 조회", 52084, 0, 0.0, 38.06881191920723, 10, 913, 33.0, 53.0, 60.0, 156.0, 29.011727457758536, 21.612593589474365, 3.6264659322198174], "isController": false}, {"data": ["vuser-50 내가 받은 리뷰 목록 조회", 61312, 0, 0.0, 130.527156184761, 12, 3861, 120.0, 197.0, 233.0, 359.0, 34.076004072758316, 21.264225197746644, 9.683708188645186], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1388359, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
