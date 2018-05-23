import React from 'react';
import PropTypes from 'prop-types';

import {Text, View, TouchableOpacity, SafeAreaView} from 'react-native';

import styles, {autocompleteStyles} from "./styles"
import {Avatar, Icon} from "react-native-elements";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {MapView} from "expo";
import {reverseGeocode} from "../../../../network/googleapi/GoogleMapsAPI";

class PlacePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            region: {
                ...this.props.location,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }
        }
    }

    onRegionChange = (region) => {
        this.setState({region: region});

        //make a get request (we want to reverse geolookup an address given a latlng)
        //we then update the state with the returned value
        reverseGeocode(region.latitude, region.longitude, (address) => {
            this.autocomplete.setAddressText(address);
            this.props.onLocationChange({
                location: {latitude: region.latitude, longitude: region.longitude},
                address: address
            });
        }, (err) => {
            console.log(err)
        });
    };


    render() {

        const {options} = this.props;

        return (
            <SafeAreaView style={{flex: 1}}>

                <GooglePlacesAutocomplete
                    {...options}
                    onPress={(place, details) => {
                        const newRegion = {
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                        };
                        newRegion.latitudeDelta = this.state['region'].latitudeDelta;
                        newRegion.longitudeDelta = this.state['region'].longitudeDelta;
                        this.onRegionChange(newRegion);
                        this.map.animateToRegion(this.state.region, 500);
                    }}
                    styles={autocompleteStyles}
                    ref={c => this.autocomplete = c}
                    fetchDetails={true}
                />

                <View style={{flex: 1}}>
                    <MapView
                        style={{flex: 1}}
                        showsUserLocation
                        showsMyLocationButton={true}
                        initialRegion={this.state.region}
                        ref={c => this.map = c}
                        onRegionChangeComplete={(region) => this.onRegionChange(region)}
                    />
                    <View pointerEvents="none" style={styles.markerContainer}>
                        <Icon type="material-community" style={styles.marker} size={40} name="map-marker"/>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

PlacePicker.propTypes = {
    location: PropTypes.object.isRequired,
    onLocationChange: PropTypes.func.isRequired,
    options: PropTypes.object
};

PlacePicker.defaultProps = {
    options: {
        placeholder: 'Search',
        minLength: 2,
        fetchDetails: true,
        debounce: 200,
        query: {
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'AIzaSyAOkeHdz33iLnUmkyWmoFoZ_B0otaz7ISY',
            language: 'en', // language of the results
        },
        currentLocation: true, // Will add a 'Current location' button at the top of the predefined places list
        currentLocationLabel: "Current location",
    },
};

export default PlacePicker;