import React from 'react';

const {View, StyleSheet, Alert} = require('react-native');

import {Avatar, Button} from 'react-native-elements'
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';

import styles from "./styles"

import {actions as auth, theme} from "../../../auth/index"
import {Text} from "react-native";
import TabButtons from "../../../event/components/TabButtons/TabButtons";
import Notifications from "../Notifications/Notifications";
import Friends from "../Friends/Friends";

const {signOut} = auth;

const mapStateToProps = (state) => {
    return {
        user: state.authReducer.user
    }
};

class Profile extends React.Component {
    constructor() {
        super();

        const buttons = [
            {
                title: 'Notifications',
                callback: this.setToTab.bind(this),
                selected: true,
            },
            {
                title: 'Friends',
                callback: this.setToTab.bind(this),
                selected: false
            }
        ];

        this.state = {
            buttons: buttons,
        };

        this.setToTab = this.setToTab.bind(this);
        this.onSignOut = this.onSignOut.bind(this);
    }

    setToTab(tabKey) {
        const state = {...this.state};
        state.buttons = [];

        //set selected to true for the appropriate tab key
        //set all the other tab key's selected value to false
        this.state.buttons.forEach((button) => {
            state.buttons.push({
                title: button.title,
                callback: this.setToTab.bind(this),
                selected: button.title === tabKey
            })
        });

        this.setState(state);
    }

    onSignOut() {
        this.props.signOut(this.onSuccess.bind(this), this.onError.bind(this))
    }

    onSuccess() {
        Actions.reset("Auth")
    }

    onError(error) {
        Alert.alert('Oops!', error.message);
    }

    render() {

        const {user} = this.props;

        if(user === null){
            return <View/>
        }

        return (
            <View style={styles.container}>
                <View style={styles.infoContainer}>
                    <View style={styles.infoContent}>
                        <Avatar
                            height={100}
                            width={100}
                            rounded
                            source={{uri: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"}}
                            onPress={() => console.log("Works!")}
                            activeOpacity={0.7}
                        />
                        <View style={styles.detailsContainer}>
                            <Text style={styles.username}>{user.firstName + " " + user.lastName}</Text>
                            <Text style={styles.school}>{user.school}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.body}>
                    <TabButtons buttons={this.state.buttons}/>

                    <View style={styles.bottomContent}>
                        {this.state.buttons[0].selected && <Notifications/>}
                        {this.state.buttons[1].selected && <Friends/>}

                        <Button
                            raised
                            borderRadius={4}
                            title={'LOG OUT'}
                            containerViewStyle={[styles.containerView]}
                            buttonStyle={[styles.button]}
                            textStyle={styles.buttonText}
                            onPress={this.onSignOut}/>
                    </View>
                </View>
            </View>
        );
    }
}

export default connect(mapStateToProps, {signOut})(Profile);