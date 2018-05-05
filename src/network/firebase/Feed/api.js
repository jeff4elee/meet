import {auth, database, provider, geofireRef} from "../../../config/firebase";

//Create the event object in realtime database
export function fetchFeed(location, callback) {

    //specify location + radius to query by
    const geoQuery = geofireRef.query({
        center: location,
        radius: 50000
    });

    //retrieve all upcoming events
    database.ref('events').orderByChild('date').startAt(Date.now()).once('value').then((snapshot) => {

        const events = snapshot.val();

        if (events !== null) {

            //geo registration variable can be used to cancel location updates
            //'key_entered' used to retrieve all keys that enter the query criteria
            const onKeyEnteredRegistration = geoQuery.on("key_entered", function (key, location, distance) {

                //only save upcoming events that are NEARBY
                if (key in events) {
                    console.log(events[key]);
                    callback(true, {[key]: events[key]}, null);
                }

            });
            onKeyEnteredRegistration.cancel();

        }

    }).catch((error) => {
        console.log(error);
        callback(false, null, {message: error})
    });


}