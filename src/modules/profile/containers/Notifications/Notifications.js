import React from 'react';
import {connect} from 'react-redux';

import styles from "./styles"

import {ScrollView, View} from "react-native";

import FriendRequest from "../../components/FriendRequest/FriendRequest";

import {fetchUsers} from "../../../../network/firebase/user/actions";
import {fetchEvents} from "../../../../network/firebase/event/actions";
import EventInvitation from "../../../event/components/EventInvitation/EventInvitation";


class Notifications extends React.Component {
    constructor() {
        super();
        this.state = {
            dataLoaded: false
        }
    }

    componentWillMount() {

        let eventInvitations = [];
        let friendRequestsFrom = [];

        if (this.props.user.eventInvitations) {
            eventInvitations = Object.keys(this.props.user.eventInvitations);
        }
        if (this.props.user.friendRequestsFrom) {
            friendRequestsFrom = Object.keys(this.props.user.friendRequestsFrom);
        }

        if (eventInvitations && friendRequestsFrom) {
            this.props.fetchEvents(eventInvitations, () => {
                this.props.fetchUsers(friendRequestsFrom, () => this.setState({dataLoaded: true}), () => {
                })
            }, () => {
            })
        } else if (eventInvitations) {
            this.props.fetchEvents(eventInvitations, () => this.setState({dataLoaded: true}), () => {
            })
        } else if (friendRequestsFrom) {
            this.props.fetchUsers(friendRequestsFrom, () => this.setState({dataLoaded: true}), () => {
            })
        } else {
            this.setState({dataLoaded: true});
        }

    }

    fetchEventsRequired = () => {

        const eventInvitations = Object.keys(this.props.user.eventInvitations);

        for(const eventId in eventInvitations){
            if(!(eventId in this.props.eventReducer.byId)){
                return true;
            }
        }

        return false;

    };

    fetchUsersRequired = () => {

        const friendRequestsFrom = Object.keys(this.props.user.friendRequestsFrom);

        for(const userId in friendRequestsFrom){
            if(!(userId in this.props.peopleReducer.byId)){
                return true;
            }
        }

        return false;

    };

    render() {

        if (!this.state.dataLoaded) {
            return <View/>
        }

        // const notifications = [0, 1, 2];
        let friendNotifications = this.props.user.friendRequestsFrom === undefined ? [] : Object.keys(this.props.user.friendRequestsFrom);
        let eventNotifications = this.props.user.eventInvitations === undefined ? [] : Object.keys(this.props.user.eventInvitations);

        friendNotifications = friendNotifications.map(id => {
            if (id in this.props.peopleReducer.byId) {
                return this.props.peopleReducer.byId[id];
            }
            return {}
        });

        return (
            <ScrollView style={styles.container}>
                {
                    friendNotifications.map((user, i) => <FriendRequest key={user.uid} user={user}/>)
                }
                {
                    eventNotifications.map((eventId, i) => <EventInvitation key={eventId}
                                                                            eventId={eventId}/>)
                }
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        peopleReducer: state.peopleReducer,
        eventReducer: state.eventReducer,
        user: state.authReducer.user
    }
};

export default connect(mapStateToProps, {fetchUsers, fetchEvents})(Notifications);