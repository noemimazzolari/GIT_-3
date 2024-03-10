var map = L.map("map").setView([55.7, 12.6], 10);


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);


fetch("https://raw.githubusercontent.com/noemimazzolari/GIT_-3/main/shipwrecks.geojson") 
  .then((response) => response.json())
  .then((shipwrecksData) => {
    console.log("GeoJSON Data:", shipwrecksData);
    
    var shipwrecksLayer = L.geoJSON(shipwrecksData, {
      onEachFeature: function (feature, layer) {
        layer.bindPopup("Era: " + feature.properties.datering);
      },
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 9,
          fillColor: "purple", 
          color: "#000",
          weight: 1,
          opacity: 2,
          fillOpacity: 0.9,
        });
      },
    });

    
    var shipwrecksCluster = L.markerClusterGroup({
      iconCreateFunction: function (cluster) {
        
        let childCount = cluster.getChildCount();
        let color = 'green'; 
        if (childCount < 10) {
          color = 'yellow'; // small clusters
        } else if (childCount < 100) {
          color = 'orange'; // medium clusters
        } else {
          color = 'red'; // large clusters
        }
        return L.divIcon({
          html: `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center;">${childCount}</div>`,
          className: 'shipwrecks-cluster-icon',
          iconSize: [30, 30]
        });
      }
    });

    shipwrecksCluster.addLayer(shipwrecksLayer);
    
    map.addLayer(shipwrecksCluster);
    
    map.fitBounds(shipwrecksLayer.getBounds());
  })
  .catch((error) => {
    console.error("Error loading GeoJSON data:", error.message);
  });
