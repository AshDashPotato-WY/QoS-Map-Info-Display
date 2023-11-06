// Initialize and add the map
let map;

// Initialize an array to store data
let dataArray = [];

let file_path = ['./output.json'];

// Get object from the json file
fetch(file_path)
  .then( response => {
    if (!response.ok) {
      throw new Error(`error: ${response.status}`);
    }
    return response.json();
  })
  .then( json => {
    dataArray = json;
    console.log(dataArray);
  })
  .catch( err => {
    console.error(`Fetch problem: ${err.message}`);
  });

async function initMap() {
  // The location of Uluru
  const position = { lat: 2.8, lng: -187.3 };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 2,
    center: position,
    mapId: "QoS_MAP_ID",
  });

  // Add each marker
    for (const data of dataArray) {
      addMarkers(map, data);
    }
  
}

function addMarkers(map, props) {
  // add marker
  var marker = new google.maps.Marker({
      position: {lat: props.lat, lng: props.long},
      map: map,
      icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: addColor(props.avg_latency),
          fillOpacity: 1.0,
          strokeWeight: 1,
          strokeColor: "#000000",
          strokeOpacity: 0.8
      },
  });

  // info window
  var infowindow = new google.maps.InfoWindow({
      content: '<div id="content">' +  '<table id="table">' +
      '<tr>' +
        '<td>Service Name</th>' +
        '<td>' + props.service +'</td>' +
      '</tr>' +
      '<tr>' +
        '<td>Location</th>' +
        '<td>' + props.location +'</td>' +
      '</tr>' +
      '<tr>' +
        '<td>Failure ratio</th>' +
        '<td>' + props.failure_ratio*100+"%" +'</td>' +
      '</tr>' +
      '<tr>' +
        '<td>Average Latency</th>' +
        '<td>' + props.avg_latency +'</td>' +
      '</tr>' +
      '<tr>' +
        '<td>Tail Latency</th>' +
        '<td>' + props.tail_latency +'</td>' +
      '</tr>' +
      '<tr>' +
        '<td>Usage/Day</th>' +
        '<td>' + props.usage +'</td>' +
      '</tr>' +
    '</table>' + '</div>'
  });
  // add infoWindow listener
  marker.addListener('mouseover', function(){
      infowindow.open(map, marker);
  });
  marker.addListener('mouseout', function(){
      infowindow.close(map, marker);
  });
}


// add marker's color
function addColor(latency) {
  if (latency < 10) return "#DFFF00";
  else if (latency >= 10 && latency < 20) return "#FFA07A";
  else if (latency >= 20 && latency < 30) return "#FF8000";
  else return "#FF0000";
}

initMap();
