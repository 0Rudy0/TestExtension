// ==UserScript==
// @name         Fetch locations - solkartan.miljo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://solkartan.miljo.stockholm.se/stockholms-solkarta
// @grant        none
// ==/UserScript==

var locations = [{ lat: '111', lng: '111' }, { lat: '111', lng: '111' }];
var locData = [];

(function () {
	'use strict';

	for (var i = 0; i < locations.length; i++) {
		var lat = locations[i].lat;
		var lng = locations[i].lng;
		if (i == locations.length - 1) {
			locations[i].isLast = true;
		}

		$.ajax({
			url: 'https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20OBJECTID,total_ener,energy_cla,area_class,energy_c_1,area_cla_1,energy_c_2,area_cla_2%20%20FROM%201Geki3RYU5UNh8z50L74GicYzGbgbxmxR8v9fdYs%20WHERE%20ST_INTERSECTS(geometry,%20CIRCLE(LATLNG(59.385296434844975,17.927704958828354),0.01))&key=AIzaSyDz0MJL1jtfRSCFEmlly20vFs8lt-wBYz0&callback=jQuery111109465189719327829_1492022592987&_=1492022592989',
			async: true,
			cache: true,
			//dataType : 'text',
			succcess: onLocationGet.bind(locations[i]),
			error: onLocationGet.bind(locations[i])
		});
	}
})();

function onLocationGet(data) {
	var data = JSON.parse(data.responseText.replace(');', '').substring(data.responseText.indexOf('{')));
	//console.log(data);
	var newData = {
		lat: this.lat,
		lng: this.lng
	};
	for (var i = 0; i < data.columns.length; i++) {		
		newData[data.columns[i]] = data.rows[0][i];
		console.log(data.columns[i]);
		console.log(data.rows[0][i]);
	}
	locData.push(newData);
	if (this.isLast) {
		//console.log(locData);
		createCsv();
	}
}

function createCsv() {
	var content = [];
	content.push(['Building ID', 'Latitude', 'Longitude', 'ObjectID', 'Total energy', 'Energy class', 'Area class', 'Energy class 1', 'Area class 1', 'Energy class 2', 'Area class 2']);

	for (var i = 0; i < locData.length; i++) {
		var f = locData[i];
		//content.push([f.location.lat + '(lt)', f.location.long + '(lg)', f.totalSurface + ' (m2)', f.totalEnergy + ' (kWh)', f.orangeSurface + ' (m2)', f.yellowSurface + ' (m2)', f.blueSurface + ' (m2)', f.orangePercent, f.yellowPercent, f.bluePercent, f.orangeEnergy + ' (kWh)', f.yellowEnergy + ' (kWh)', f.blueEnergy + ' (kWh)']);
		content.push([f.bId, f.lat, f.lng, f["OBJECTID"],f["total_ener"], f["energy_cla"], f["area_class"], f["energy_c_1"], f["area_cla_1"], f["energy_c_2"], f["area_cla_2"]]);
	}
	console.log(content);

	//console.log(content);
	exportToCsv('data.csv', content);
}

function exportToCsv(filename, content) {
	var finalVal = '';

	for (var i = 0; i < content.length; i++) {
		var value = content[i];

		for (var j = 0; j < value.length; j++) {
			var innerValue = value[j] === null ? '' : value[j].toString();
			var result = innerValue.replace(/"/g, '""');
			if (result.search(/("|,|\n)/g) >= 0)
				result = '"' + result + '"';
			if (j > 0)
				finalVal += ';';
			finalVal += result;
		}

		finalVal += '\n';
	}

	//console.log(finalVal);

	var pom = document.createElement('a');
	pom.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(finalVal));
	pom.setAttribute('download', filename);
	pom.click();
}