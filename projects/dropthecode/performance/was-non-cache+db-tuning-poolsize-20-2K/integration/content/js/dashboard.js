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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9714655950388362, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9996576308051718, 500, 1500, "vuser-10 리뷰 수정"], "isController": false}, {"data": [0.9993401576488212, 500, 1500, "vuser-30 로그인"], "isController": false}, {"data": [0.8338564702525325, 500, 1500, "vuser-30 리뷰어 목록 조회"], "isController": false}, {"data": [0.9998691204896907, 500, 1500, "vuser-10 언어 및 기술 목록 조회"], "isController": false}, {"data": [0.999275114270181, 500, 1500, "vuser-10 리뷰어 목록 조회"], "isController": false}, {"data": [0.9995569518285806, 500, 1500, "vuser-10 내가 받은 리뷰 목록 조회"], "isController": false}, {"data": [0.9991078756735539, 500, 1500, "vuser-30 리뷰 수정"], "isController": false}, {"data": [0.9986596126191702, 500, 1500, "vuser-50 내가 리뷰한 리뷰 목록 조회"], "isController": false}, {"data": [0.9990458866120949, 500, 1500, "vuser-30 언어 및 기술 목록 조회"], "isController": false}, {"data": [0.9971592926638733, 500, 1500, "vuser-50 리뷰 수정"], "isController": false}, {"data": [0.9998690967676971, 500, 1500, "vuser-10 리뷰 상세 조회"], "isController": false}, {"data": [0.9988380138019124, 500, 1500, "vuser-50 로그인"], "isController": false}, {"data": [0.9997986104118417, 500, 1500, "vuser-10 내가 리뷰한 리뷰 목록 조회"], "isController": false}, {"data": [0.9990990669544895, 500, 1500, "vuser-30 내가 받은 리뷰 목록 조회"], "isController": false}, {"data": [0.9991882392820823, 500, 1500, "vuser-30 내가 리뷰한 리뷰 목록 조회"], "isController": false}, {"data": [0.9994915254237288, 500, 1500, "vuser-30 리뷰 상세 조회"], "isController": false}, {"data": [0.9979686335734308, 500, 1500, "vuser-50 언어 및 기술 목록 조회"], "isController": false}, {"data": [0.5307149067551502, 500, 1500, "vuser-50 리뷰어 목록 조회"], "isController": false}, {"data": [0.9997181056701031, 500, 1500, "vuser-10 로그인"], "isController": false}, {"data": [0.9967337084834822, 500, 1500, "vuser-50 리뷰어 단일 조회"], "isController": false}, {"data": [0.9988459831335996, 500, 1500, "vuser-50 리뷰 상세 조회"], "isController": false}, {"data": [0.9991882972080992, 500, 1500, "vuser-30 리뷰어 단일 조회"], "isController": false}, {"data": [0.9997784759142904, 500, 1500, "vuser-10 리뷰어 단일 조회"], "isController": false}, {"data": [0.99764770629172, 500, 1500, "vuser-50 내가 받은 리뷰 목록 조회"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1296470, 0, 0.0, 124.46609177227232, 6, 8060, 113.0, 657.0, 848.0, 1080.9900000000016, 240.06227505792458, 281.00197183653927, 46.767402953181495], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["vuser-10 리뷰 수정", 49654, 0, 0.0, 36.17356104241362, 10, 1221, 30.0, 53.0, 59.0, 163.0, 27.59335834410953, 5.115631157123042, 13.069119918840938], "isController": false}, {"data": ["vuser-30 로그인", 56074, 0, 0.0, 57.905589043050746, 10, 1447, 51.0, 84.0, 101.0, 198.0, 31.152101075162484, 23.28385150898024, 4.958781714112778], "isController": false}, {"data": ["vuser-30 리뷰어 목록 조회", 56072, 0, 0.0, 460.37712227136655, 68, 4096, 453.0, 596.0, 642.0, 762.0, 31.149086420493777, 153.61610002294296, 4.258664159051884], "isController": false}, {"data": ["vuser-10 언어 및 기술 목록 조회", 49664, 0, 0.0, 30.66730428479368, 8, 978, 25.0, 48.0, 53.0, 148.9900000000016, 27.59291998030982, 17.622821940549436, 3.422168786620456], "isController": false}, {"data": ["vuser-10 리뷰어 목록 조회", 49663, 0, 0.0, 129.12949278134698, 39, 1259, 127.0, 173.0, 189.0, 260.9900000000016, 27.59231839811988, 136.07539835010292, 3.772387280992952], "isController": false}, {"data": ["vuser-10 내가 받은 리뷰 목록 조회", 49656, 0, 0.0, 40.03528274528793, 10, 1080, 36.0, 57.0, 63.0, 170.0, 27.592430418798592, 17.218323278918263, 7.841208253779678], "isController": false}, {"data": ["vuser-30 리뷰 수정", 56046, 0, 0.0, 86.68101202583581, 12, 2346, 80.0, 125.0, 148.0, 230.0, 31.14874545796092, 5.774934703846269, 14.753067917100632], "isController": false}, {"data": ["vuser-50 내가 리뷰한 리뷰 목록 조회", 56327, 0, 0.0, 79.48955207981945, 8, 2151, 69.0, 129.0, 165.0, 277.9900000000016, 31.309737218771275, 19.53800984647934, 4.1277485591153535], "isController": false}, {"data": ["vuser-30 언어 및 기술 목록 조회", 56073, 0, 0.0, 73.58008310595153, 10, 1988, 66.0, 111.0, 134.0, 221.0, 31.152168562715733, 19.89601390626571, 3.8635990307274395], "isController": false}, {"data": ["vuser-50 리뷰 수정", 56324, 0, 0.0, 142.63395710531884, 14, 2618, 132.0, 210.0, 242.0, 360.9900000000016, 31.31087175017122, 5.805072065620302, 14.829856248860391], "isController": false}, {"data": ["vuser-10 리뷰 상세 조회", 49655, 0, 0.0, 25.981411741013012, 6, 1779, 20.0, 43.0, 47.0, 81.9800000000032, 27.592626036703113, 23.927980391203477, 3.4221323307239206], "isController": false}, {"data": ["vuser-50 로그인", 56369, 0, 0.0, 85.99565363941251, 10, 2090, 78.0, 134.0, 164.0, 284.0, 31.315067275535263, 23.405621722331478, 4.984722622961179], "isController": false}, {"data": ["vuser-10 내가 리뷰한 리뷰 목록 조회", 49655, 0, 0.0, 28.384815225052883, 7, 980, 25.0, 43.0, 48.0, 152.9900000000016, 27.592917364060913, 17.21862714417473, 3.6377381290509994], "isController": false}, {"data": ["vuser-30 내가 받은 리뷰 목록 조회", 56053, 0, 0.0, 80.76955738319124, 12, 2067, 73.0, 114.0, 135.0, 279.0, 31.148377259178417, 19.437317449819343, 8.851736115645428], "isController": false}, {"data": ["vuser-30 내가 리뷰한 리뷰 목록 조회", 56051, 0, 0.0, 49.85980624788125, 7, 2178, 44.0, 74.0, 87.0, 200.0, 31.150381689571006, 19.43856826136316, 4.106739773527427], "isController": false}, {"data": ["vuser-30 리뷰 상세 조회", 56050, 0, 0.0, 50.51853702051769, 7, 2148, 45.0, 74.0, 89.0, 191.9900000000016, 31.150743477378892, 27.013535359289506, 3.8634222867452337], "isController": false}, {"data": ["vuser-50 언어 및 기술 목록 조회", 56366, 0, 0.0, 122.03031969626932, 9, 4647, 109.0, 195.0, 229.0, 344.9900000000016, 31.313104939399818, 19.99879944371824, 3.8835589133825943], "isController": false}, {"data": ["vuser-50 리뷰어 목록 조회", 56357, 0, 0.0, 781.8624128324791, 79, 8060, 775.0, 1032.0, 1112.0, 1302.0, 31.305705151884634, 154.3884873213061, 4.280076876234228], "isController": false}, {"data": ["vuser-10 로그인", 49664, 0, 0.0, 32.37121456185578, 10, 1930, 30.0, 47.0, 52.0, 136.0, 27.592506065584427, 20.62404233439718, 4.392166492861583], "isController": false}, {"data": ["vuser-50 리뷰어 단일 조회", 56333, 0, 0.0, 166.76649565973733, 12, 4371, 155.0, 255.0, 292.0, 398.0, 31.302649886865257, 23.31925644172755, 3.912831235858157], "isController": false}, {"data": ["vuser-50 리뷰 상세 조회", 56325, 0, 0.0, 77.7486728806037, 7, 2438, 67.0, 127.0, 160.0, 258.0, 31.310261483069667, 27.151867379849477, 3.883206258154148], "isController": false}, {"data": ["vuser-30 리뷰어 단일 조회", 56055, 0, 0.0, 97.08209793952398, 13, 1491, 88.0, 146.0, 172.0, 277.0, 31.146702050164777, 23.203063770483173, 3.893337756270597], "isController": false}, {"data": ["vuser-10 리뷰어 단일 조회", 49656, 0, 0.0, 37.7282302239407, 10, 1929, 34.0, 54.0, 60.0, 149.0, 27.59209311164529, 20.555035328823003, 3.4490116389556613], "isController": false}, {"data": ["vuser-50 내가 받은 리뷰 목록 조회", 56328, 0, 0.0, 137.60211617668088, 13, 4412, 125.0, 208.0, 248.0, 357.0, 31.302550195335296, 19.533524975409424, 8.895548932463447], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1296470, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
