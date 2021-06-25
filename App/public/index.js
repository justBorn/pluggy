let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 3,
        fullscreenControl: false,
        zoomControl: true,

    });


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                // infoWindow.setPosition(pos);
                // infoWindow.setContent("Location found.");
                // infoWindow.open(map);
                map.setCenter(pos);
                map.setZoom(17)
                var request = {
                    location: map.getCenter(),
                    radius: 1000,
                    types: ['bar', 'restaurant']
                }

                var marker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 14,
                        fillOpacity: 1,
                        strokeWeight: 2,
                        fillColor: '#5384ED',
                        strokeColor: '#ffffff',
                    },
                });

                service.nearbySearch(request, callback);
            },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            }
        );


        var service = new google.maps.places.PlacesService(map);


    }


    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log(results.length);
            for (var i = 0; (i < results.length && i < 5); i++) {
                createMarker(results[i], i);
            }
        }
    }

    function createMarker(place, i) {
        var placeLoc = place.geometry.location;
        const icon = {
            url: `./assets/img/marker${i}.svg`,
            // This marker is 20 pixels wide by 32 pixels high.
            // size: new google.maps.Size(100, 100),
            scale: 10
            // The origin for this image is (0, 0).
            // origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            // anchor: new google.maps.Point(0, 32),
        };
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name,
            icon: icon // null = default icon
        })

        const infowindow = new google.maps.InfoWindow({
            content: 'Scan QrCode!',
        });
        marker.addListener("click", () => {
            map.setZoom(20);
            map.setCenter(marker.getPosition());
            // infowindow.open({
            //     anchor: marker,
            //     map,
            //     shouldFocus: false,
            // });
        });
    }
}


