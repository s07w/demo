/*global google*/

import React from 'react'
import  { compose, withProps, lifecycle } from 'recompose'
import {withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer} from 'react-google-maps'
import Card from "../Card/index"
import { List } from "../List/index"
import Event from "../Event/index"
import "../Map/map.scss"


class Map extends React.Component {

    // newFunction = (ven) => {
      //   var venues = [];
        
      //     var currentLat = 41.4993;
      //     var currentLon = -81.6944;
      //     var timeNow = Date.now() + 86400000;
          
      //     var shows = [];
      //     console.log(ven);
      //     console.log(timeNow);
      //     console.log(moment(timeNow).format("YYYY-MM-DD"));

      //     setTimeout(function(){
      //     for (var k=timeNow; k < timeNow + 1728000000; k = k + 86400000) {
      //       //console.log(ven.length);
      //       for (var j=0; j < ven.length; j++) {
      //         //console.log(j);
      //         //console.log(ven[j].datetime);
      //         //console.log(moment(k).format("YYYY-MM-DD"));
      //         //if (ven[j].datetime === moment(k).format("YYYY-MM-DD") && (currentLat - 1 >= ven[j].latitude || currentLat + 1 <= ven[j].latitude) && (currentLon - 1 >= ven[j].longitude || currentLon + 1 <= ven[j].longitude)) {
      //         //if (ven[j].datetime === moment(k).format("YYYY-MM-DD")) {
      //         if (ven[j].datetime === moment(k).format("YYYY-MM-DD") && (parseFloat(ven[j].longitude) >= (parseFloat(currentLon - 3)) && parseFloat(ven[j].longitude) <= (parseFloat(currentLon + 3)))) {
      //           console.log(currentLon);
      //           console.log(ven[j].longitude);
      //           currentLat = parseFloat(ven[j].latitude);
      //           //console.log(currentLat);
      //           currentLon = parseFloat(ven[j].longitude);
      //           shows.push(ven[j]);
      //           venues.push({location: ven[j].location});
      //           break;
      //         }
      //       }
      //     }
      //     }, 3000);
      //     console.log(shows);
      //     console.log(venues);
      //   console.log(venues);
      //   //this.setState({results: venues}); // route venues sent to make map
      //   return venues;
      // }

    

    constructor(props){
        super(props)
      }
    render() {
        const DirectionsComponent = compose(
          withProps({
            shows: this.props.shows,
            stops: this.props.stops,
            origin: this.props.origin,
            destLat: this.props.destLat,
            destLng: this.props.destLng,
            googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBnYQSBwhAq7HKVX5bjFXtsOFsOXLiTSfI",
            loadingElement: <div style={{ height: `400px` }} />,
            containerElement: <div style={{ width: `100%` }} />,
            mapElement: <div style={{height: `700px`, width: `100%`, border:'black solid 2px'}}  />
          }),
          withScriptjs,
          withGoogleMap,
          lifecycle({
            componentDidMount() { 
              const DirectionsService = new google.maps.DirectionsService();
              DirectionsService.route({
                //origin: new google.maps.LatLng(41.8507300, -87.6512600),
                //origin: new google.maps.LatLng(41.4993, -81.6944), //Cleveland, Ohio
                origin: this.props.origin,
                //destination: new google.maps.LatLng(41.8525800, -87.6514100),
                //destination: new google.maps.LatLng(37.7749, -122.4194), //San Francisco
                destination: new google.maps.LatLng(this.props.destLat, this.props.destLng),
                waypoints: this.props.stops,
                travelMode: google.maps.TravelMode.DRIVING,
              }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
    this.setState({
                    directions: {...result},
                    markers: true
                  })
                } else {
                  console.error(`error fetching directions ${result}`);
                }
              });
            }
          })
        )(props =>
          <GoogleMap
            defaultZoom={3}
          >
            {props.directions && <DirectionsRenderer directions={props.directions} suppressMarkers={props.markers}/>}
          </GoogleMap>
        );
    return (
        <div>
            <DirectionsComponent
            />
            <Card>
              {this.props.shows.length ? (
                  <List>
                    {this.props.shows.map(show => (
                      <Event
                        key={show._id}
                        artist={show.artist}
                        location={show.location}
                        date={show.datetime}
                        Button={() => (
                          <button
                            onClick={() => this.handleBookDelete(show._id)}
                            className="btn btn-danger ml-2"
                          >
                            Delete
                          </button>
                        )}
                      />
                    ))}
                  </List>
                ) : (
                  <h2 className="text-center">Search a destination above to see who's playing below!</h2>
                )}
              {/* <p>all the events</p> */}
              {/* {this.props.shows} */}
            </Card>
        </div>
        )
      }
    }
    export default Map