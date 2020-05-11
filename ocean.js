let map;

function initMap() {
  // initialize map container
  mapboxgl.accessToken = 'pk.eyJ1Ijoia2FyaWhpZ2giLCJhIjoiY2p1bGpnbTByMGZ1czRkbHI3aDBwdHk1eiJ9.KJSyhm6rfumygW_BhUDHMQ';
  map = new mapboxgl.Map({
    container: 'mymap',
    center: [23.81661519181763, -75.12463147310342],
    zoom: 8,
    hash: true,
    style: 'mapbox://styles/karihigh/cka18d3rg0eyc1ipnchq3w3dy',
    // pitch: 60,
    bearing: 180,
  });
}

initMap();

map.on('load', function(){
  console.log('map is ready!');
  // console.log(geojson);
  geojson.features.forEach( f => {
    let c = document.createElement('div');
    c.className = 'marker';

    if (f.properties.snapshot_description.includes("underwater")) {
      c.className += ' blue';
    } else if (f.properties.snapshot_description.includes("island")) {
      c.className += ' green';
    } else if (f.properties.snapshot_description.includes("cruise")) {
      c.className += ' yellow';
    } else if (f.properties.snapshot_description.includes("boat")) {
      c.className += ' pink';
    } else if (f.properties.snapshot_description.includes("shipwreck")) {
      c.className += ' gray';
    }

    var dano = document.createElement("div");
    dano.className = "dano";
    dano.innerText = "hi i am dano";

    var shark = {lat: f.properties.latitude, lng: f.properties.longitude};


    var emptyDiv = document.createElement('div');
    emptyDiv.className = 'danos-dad';

    const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(emptyDiv);

    const marker = new mapboxgl.Marker(c)
      .setLngLat([f.properties.longitude, f.properties.latitude])
      .setPopup(popup)
      .addTo(map);

    popup.on('open', function() {
      var sv = new google.maps.StreetViewService();
      var panorama = new google.maps.StreetViewPanorama(dano, {
        linksControl: false,
        panControl: false,
        addressControl: false,
        enableCloseButton: false,
        zoomControl: false,
        fullscreenControl: false,
        enableCloseButton: false,
        addressControlOptions: {
             position: google.maps.ControlPosition.BOTTOM_CENTER
        }
      });

      sv.getPanorama(
        {location: shark, radius: 50},
        function(data, status) {
          if (status === 'OK') {
            panorama.setPano(data.location.pano);
            panorama.setPov({
              heading: 270,
              pitch: 0
            });
            panorama.setVisible(true);
          } else {
            console.error('Street View data not found for this location.');
          }
        }
      );
      popup.setDOMContent(dano);
    })

    popup.on('close', function() {
      popup.setDOMContent(emptyDiv);
    })


  }) 

});


// let str = `<h1 class="latlong"> ${f.properties.latitude}, ${f.properties.longitude} </h1>`;
// str += `<h2 class="title"> ${f.properties.snapshot_description} </h2>`;
// str += `<img src="https://maps.googleapis.com/maps/api/streetview?size=640x640&pitch=${f.properties.pov_pitch}&heading=${f.properties.pov_heading}&pano=${f.properties.pano_id}&key=AIzaSyBDPjaWQMix9AAjalJZZ1bp0twQBX4NM8c"></img>`;
// <iframe src="https://www.google.com/maps/embed?pb=!4v1589159185847!6m8!1m7!1sCAoSLEFGMVFpcE02X1dYbjBKZnc4R2h3U21zWnlwSTJfMGMyN1c1enFsRU1BS3dv!2m2!1d40.6928444!2d-74.0065908!3f100.36865535190756!4f-4.066134239734794!5f0.7820865974627469" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
