import React from 'react';
import PropTypes from 'prop-types'

import {Text, View, TouchableOpacity} from 'react-native';

import styles from "./styles"
import {Avatar, Icon} from "react-native-elements";

import Modal from "react-native-modal";
import EventDetails from "../EventDetails"

class Event extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventDetails: false
        };
    }

    handlePress = () => {
        this.setState({eventDetails: true});
    };

    closeModal = () => {
        this.setState({eventDetails: false});
    };

    render() {
        const {title, description, date, location, hostPic, hostName} = this.props;

        return (
            <View style={{flex: 1}}>
                <TouchableOpacity style={styles.container} onPress={this.handlePress}>
                    <View style={styles.info}>
                        <Text style={styles.title}>
                            {title}
                        </Text>
                        <Text style={styles.subtitle}>
                            {date + " | " + location}
                        </Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.description}>
                            {description}
                        </Text>
                    </View>
                    <View style={styles.hostContainer}>
                        <Avatar
                            small
                            rounded
                            source={{uri: hostPic}}
                            onPress={() => console.log("Works!")}
                            activeOpacity={0.7}
                        />
                        <Text style={styles.hostName}>
                            {hostName}
                        </Text>
                    </View>
                </TouchableOpacity>

                <Modal isVisible={this.state.eventDetails} style={styles.modal}>
                    <View style={styles.modalHeader}>
                        <Icon
                            onPress={this.closeModal}
                            name='close'
                        />
                    </View>
                    <EventDetails
                        title={title}
                        date={date}
                        location={location}
                        hostPic={hostPic}
                        hostName={hostName}
                        description={description}
                    />
                </Modal>
            </View>
        );
    }
}

Event.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
};

Event.defaultProps = {
    title: 'Really Long Event Title',
    description: 'This is a really thought out description to test our dummy component EventDetails! It has really really long text.',
    date: 'Today, 12:30pm',
    location: 'Warren College',
    hostPic: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
    hostName: "Jane"
};

export default Event;