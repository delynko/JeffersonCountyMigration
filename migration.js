var cartoDark = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd'
});

var countiesNoMig = L.geoJson(counties, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.NAMELSAD)
    },
    filter: countyNoMigFilter,
    style: {
        fillColor: "#ffffff",
        color: "#ffffff",
        weight: 1,
        opacity: .2,
        fillOpacity: 0
    }
});

var toJeffcoCounties = L.geoJson(counties, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.NAMELSAD + "<br>People Moving to Jeffco: " + feature.properties.ToJeffcoFr + "<br>People Moving From Jeffco: " + feature.properties.FromJeffco)
    },
    filter: toJeffcoFilter,
    style: {
        fillColor: "#ff0000",
        color: "#ff0000",
        weight: 1,
        opacity: .2,
        fillOpacity: .1
    }
});

var fromJeffcoCounties = L.geoJson(counties, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.NAMELSAD + "<br>People Moving to Jeffco: " + feature.properties.ToJeffcoFr + "<br>People Moving From Jeffco: " + feature.properties.FromJeffco)
    },
    filter: fromJeffcoFilter,
    style: {
        fillColor: "#00d7ee",
        color: "#00d7ee",
        weight: 1,
        opacity: .2,
        fillOpacity: .1
    }
});

var map = L.map("map", {
    maxZoom: 18,
}).setView([38.70, -99.21], 5);

countiesNoMig.bringToBack().addTo(map);
cartoDark.addTo(map);
toJeffcoCounties.addTo(map);
fromJeffcoCounties.addTo(map);


var toJeffcoData = [];
var fromJeffcoData = [];

for (var i = 0; i < toJeffco.features.length; i++) {
    var coords = [];
    var cor = {};
    if (toJeffco.features[i].properties.ToJeffcoFr > 75) {
        coords.push(toJeffco.features[i].geometry.coordinates[0]);
        coords.push(toJeffco.features[i].geometry.coordinates[1]);
        cor["from"] = coords;
        cor["to"] = [-105.280530,39.612187];
        cor["labels"] = [toJeffco.features[i].properties.NAMELSAD, ""];
        cor["color"] = "#ff0000";
        toJeffcoData.push(cor);
    }
};

for (var i = 0; i < fromJeffco.features.length; i++) {
    var coords = [];
    var cor = {};
    if (fromJeffco.features[i].properties.FromJeffco > 75) {
        coords.push(fromJeffco.features[i].geometry.coordinates[0]);
        coords.push(fromJeffco.features[i].geometry.coordinates[1]);
        cor["from"] = [-105.280530,39.612187];
        cor["to"] = coords;
        cor["labels"] = ["", fromJeffco.features[i].properties.NAMELSAD];
        cor["color"] = "#00d7ee";
        fromJeffcoData.push(cor);
    }
};

var toLayer = new L.migrationLayer({
    map: map,
    data: toJeffcoData,
    pulseRadius:0,
    pulseBorderWidth:3,
    arcWidth:1,
    arcLabel:true,
    arcLabelFont:'10px sans-serif',
    }
);

var fromLayer = new L.migrationLayer({
    map: map,
    data: fromJeffcoData,
    pulseRadius:15,
    pulseBorderWidth:2,
    arcWidth:1,
    arcLabel:true,
    arcLabelFont:'10px sans-serif',
    }
);

toLayer.addTo(map);
fromLayer.addTo(map);

toLayer.hide();
toLayer.pause()
fromLayer.hide();
fromLayer.pause();

$("#addMigToJeff").on("click", function (){
//    fromLayer.hide();
//    fromLayer.pause();
    toLayer.play();
    toLayer.show();
});

$("#addMigFromJeff").on("click", function (){
//    toLayer.hide();
//    toLayer.pause();
    fromLayer.play();
    fromLayer.show();
});

$("#removeData").on("click", function (){
    toLayer.hide();
    toLayer.pause();
    fromLayer.hide();
    fromLayer.pause();
});


//function setData(){
//    migrationLayer.setData(data2);
//}

function countyNoMigFilter (feature) {
    if (feature.properties.GrossMigra === 0) {
        return true;
    }
}

function toJeffcoFilter (feature) {
    if (feature.properties.NetMigrati > 0) {
        return true;
    }
}

function fromJeffcoFilter (feature) {
    if (feature.properties.NetMigrati < 0) {
        return true;
    }
}

function hide(){
    migrationLayer.hide();
}

function showTo(){
    migrationLayer.show();
}

function play(){
    migrationLayer.play();
}

function pause(){
    migrationLayer.pause();
}

function destroy() {
    migrationLayer.destroy();
}
