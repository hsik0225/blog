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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9374327112865602, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9996390856837322, 500, 1500, "vuser-10 리뷰 수정"], "isController": false}, {"data": [0.9922300741834547, 500, 1500, "vuser-30 로그인"], "isController": false}, {"data": [0.7805212620027435, 500, 1500, "vuser-30 리뷰어 목록 조회"], "isController": false}, {"data": [0.9995990591254144, 500, 1500, "vuser-10 언어 및 기술 목록 조회"], "isController": false}, {"data": [0.9989708634055066, 500, 1500, "vuser-10 리뷰어 목록 조회"], "isController": false}, {"data": [0.9997727819508674, 500, 1500, "vuser-10 내가 받은 리뷰 목록 조회"], "isController": false}, {"data": [0.939413130673422, 500, 1500, "vuser-30 리뷰 수정"], "isController": false}, {"data": [0.8578499238543541, 500, 1500, "vuser-50 내가 리뷰한 리뷰 목록 조회"], "isController": false}, {"data": [0.9970985439966238, 500, 1500, "vuser-30 언어 및 기술 목록 조회"], "isController": false}, {"data": [0.8458408366809808, 500, 1500, "vuser-50 리뷰 수정"], "isController": false}, {"data": [0.9996391146278871, 500, 1500, "vuser-10 리뷰 상세 조회"], "isController": false}, {"data": [0.9921856090729919, 500, 1500, "vuser-50 로그인"], "isController": false}, {"data": [0.9996391146278871, 500, 1500, "vuser-10 내가 리뷰한 리뷰 목록 조회"], "isController": false}, {"data": [0.8810244142686273, 500, 1500, "vuser-30 내가 받은 리뷰 목록 조회"], "isController": false}, {"data": [0.9761661858861606, 500, 1500, "vuser-30 내가 리뷰한 리뷰 목록 조회"], "isController": false}, {"data": [0.9785055934707662, 500, 1500, "vuser-30 리뷰 상세 조회"], "isController": false}, {"data": [0.9939136148286475, 500, 1500, "vuser-50 언어 및 기술 목록 조회"], "isController": false}, {"data": [0.7528358002489971, 500, 1500, "vuser-50 리뷰어 목록 조회"], "isController": false}, {"data": [0.9995055194718413, 500, 1500, "vuser-10 로그인"], "isController": false}, {"data": [0.8398422636549172, 500, 1500, "vuser-50 리뷰어 단일 조회"], "isController": false}, {"data": [0.8587848364202874, 500, 1500, "vuser-50 리뷰 상세 조회"], "isController": false}, {"data": [0.9221514757097126, 500, 1500, "vuser-30 리뷰어 단일 조회"], "isController": false}, {"data": [0.9996391339214113, 500, 1500, "vuser-10 리뷰어 단일 조회"], "isController": false}, {"data": [0.7466784305584389, 500, 1500, "vuser-50 내가 받은 리뷰 목록 조회"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 757928, 0, 0.0, 213.2862725747022, 7, 5194, 193.0, 1059.9000000000015, 1241.0, 1872.0, 140.33876700866534, 156.91967934689472, 27.698861104864495], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["vuser-10 리뷰 수정", 37405, 0, 0.0, 57.98834380430439, 11, 865, 56.0, 148.0, 173.95000000000073, 247.9900000000016, 20.83285760194622, 3.8858162128630154, 9.867124938421794], "isController": false}, {"data": ["vuser-30 로그인", 28443, 0, 0.0, 161.0135006855819, 13, 1558, 144.0, 321.0, 377.0, 516.0, 15.799331876511582, 11.361301737840408, 2.437787535633623], "isController": false}, {"data": ["vuser-30 리뷰어 목록 조회", 28431, 0, 0.0, 463.7566037072178, 31, 2439, 437.0, 859.0, 958.0, 1159.0, 15.79614083239345, 71.69495281690483, 2.5607025177512823], "isController": false}, {"data": ["vuser-10 언어 및 기술 목록 조회", 37412, 0, 0.0, 42.86127445739332, 8, 1221, 42.0, 87.0, 107.0, 183.0, 20.814046644116075, 13.293346196535072, 2.581429613088615], "isController": false}, {"data": ["vuser-10 리뷰어 목록 조회", 37410, 0, 0.0, 119.79529537556739, 28, 1576, 109.0, 313.0, 349.0, 423.0, 20.819767927205945, 94.49540058818211, 3.375079566324401], "isController": false}, {"data": ["vuser-10 내가 받은 리뷰 목록 조회", 37409, 0, 0.0, 61.20810500146986, 10, 1612, 59.0, 157.0, 181.0, 240.0, 20.8297952545106, 12.998280437140892, 5.919404706115805], "isController": false}, {"data": ["vuser-30 리뷰 수정", 28422, 0, 0.0, 236.9742101189227, 13, 2035, 189.0, 533.0, 618.0, 797.0, 15.825122981283462, 2.951756337329239, 7.495297505783669], "isController": false}, {"data": ["vuser-50 내가 리뷰한 리뷰 목록 조회", 28892, 0, 0.0, 354.80202132078165, 8, 3406, 165.0, 993.0, 1113.0, 1806.9800000000032, 16.078999242018654, 10.033672378564377, 2.119789939133319], "isController": false}, {"data": ["vuser-30 언어 및 기술 목록 조회", 28434, 0, 0.0, 101.55950622494169, 9, 3633, 78.0, 186.0, 241.0, 384.9800000000032, 15.79674565039492, 10.088937163435817, 1.959166696875151], "isController": false}, {"data": ["vuser-50 리뷰 수정", 28876, 0, 0.0, 417.39815071339683, 12, 4583, 230.0, 1080.0, 1195.0, 1832.9800000000032, 16.075516402861037, 2.9984605790492753, 7.613892046276956], "isController": false}, {"data": ["vuser-10 리뷰 상세 조회", 37408, 0, 0.0, 40.03787959794692, 7, 1151, 41.0, 97.0, 118.0, 186.0, 20.83328692328084, 18.066366003782605, 2.5838158586490887], "isController": false}, {"data": ["vuser-50 로그인", 28921, 0, 0.0, 157.62670723695513, 13, 2677, 141.0, 289.0, 349.0, 534.9900000000016, 16.06591909767319, 11.553542588524765, 2.478921110773793], "isController": false}, {"data": ["vuser-10 내가 리뷰한 리뷰 목록 조회", 37408, 0, 0.0, 42.67146065012848, 7, 1755, 41.0, 99.0, 120.0, 187.0, 20.833240513435122, 13.00043035945805, 2.746569794251701], "isController": false}, {"data": ["vuser-30 내가 받은 리뷰 목록 조회", 28426, 0, 0.0, 309.4097305283866, 11, 2967, 252.0, 687.0, 810.0, 1043.0, 15.813737690891665, 9.868142953593528, 4.493943035204564], "isController": false}, {"data": ["vuser-30 내가 리뷰한 리뷰 목록 조회", 28426, 0, 0.0, 173.32906494054583, 8, 1763, 115.0, 419.0, 504.0, 698.9900000000016, 15.825429247927458, 9.875438759204732, 2.086360301240436], "isController": false}, {"data": ["vuser-30 리뷰 상세 조회", 28426, 0, 0.0, 171.06121156687556, 8, 2290, 113.0, 411.0, 491.0, 686.0, 15.827685029847432, 13.725570611820817, 1.9630039050689683], "isController": false}, {"data": ["vuser-50 언어 및 기술 목록 조회", 28917, 0, 0.0, 103.90030086108497, 9, 3845, 79.0, 182.0, 236.95000000000073, 511.0, 16.06781186707674, 10.262059532293152, 1.9927852608581502], "isController": false}, {"data": ["vuser-50 리뷰어 목록 조회", 28916, 0, 0.0, 643.0454765527736, 31, 3691, 455.0, 1337.0, 1486.0, 2116.970000000005, 16.06439982111161, 72.91112993436128, 2.6041898147505145], "isController": false}, {"data": ["vuser-10 로그인", 37413, 0, 0.0, 54.280089808355456, 10, 2568, 51.0, 135.0, 159.0, 223.9900000000016, 20.784976905581214, 14.946886061619654, 3.2070569834783518], "isController": false}, {"data": ["vuser-50 리뷰어 단일 조회", 28909, 0, 0.0, 462.6061780068482, 11, 4001, 280.0, 1086.0, 1207.9500000000007, 1892.9800000000032, 16.06667874534406, 11.987248595159043, 2.0083348431680075], "isController": false}, {"data": ["vuser-50 리뷰 상세 조회", 28885, 0, 0.0, 352.9484161329419, 9, 3490, 160.0, 990.0, 1105.0, 1775.9900000000016, 16.075425663469574, 13.940408192540023, 1.993729550059215], "isController": false}, {"data": ["vuser-30 리뷰어 단일 조회", 28427, 0, 0.0, 277.5072642206384, 12, 4943, 216.0, 564.0, 650.0, 840.0, 15.802636867334453, 11.790248600237815, 1.9753296084168068], "isController": false}, {"data": ["vuser-10 리뷰어 단일 조회", 37410, 0, 0.0, 58.10924886394014, 11, 1422, 54.0, 155.0, 180.0, 263.0, 20.828334106299668, 15.539889899622017, 2.603541763287458], "isController": false}, {"data": ["vuser-50 내가 받은 리뷰 목록 조회", 28902, 0, 0.0, 620.0987474915249, 11, 5194, 355.0, 1383.0, 1823.9500000000007, 2418.950000000008, 16.073007557683646, 10.029933427109228, 4.567622264927676], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 757928, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
