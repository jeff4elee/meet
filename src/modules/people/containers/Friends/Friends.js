import React from 'react';
import {connect} from 'react-redux';

import styles from "./styles"

import {ActivityIndicator, FlatList, ScrollView, View} from "react-native";

import UserListItem from "../../components/UserListItem/UserListItem";

import {fetchUsers} from "../../../../network/firebase/user/actions";
import commonStyles from "../../../../styles/commonStyles";


class Friends extends React.Component {
    constructor() {
        super();
        this.state = {
            dataLoaded: false
        }
    }

    componentDidMount() {

        if (this.props.user.friends === undefined) {
            return;
        }

        const friends = Object.keys(this.props.user.friends);

        let usersToFetch = [];

        friends.forEach(id => {
            if (!(id in this.props.peopleReducer.byId)) {
                usersToFetch.push(id);
            }
        });

        if (usersToFetch.length > 0) {
            this.props.fetchUsers(usersToFetch, () => {
                this.setState({
                    dataLoaded: true
                })
            }, (error) => {
                console.log(error);
            });
        } else {
            this.setState({
                dataLoaded: true
            })
        }

    }

    renderItem = (item) => {
        const userId = item.item;
        return <UserListItem userId={userId}/>
    };

    render() {

        if(!this.state.dataLoaded){
            return <View style={commonStyles.loadingContainer}>
                <ActivityIndicator animating color='white' size="large"/>
            </View>
        }

        // const friends = [0, 1, 2];
        let friends = this.props.user.friends === undefined ? null : Object.keys(this.props.user.friends);

        if (friends !== null) {
            friends = friends.filter(id => this.props.user.friends[id]);
        }

        return (
            <FlatList
                style={styles.container}
                data={friends}
                renderItem={(item) => this.renderItem(item)}
                keyExtractor={(userId) => userId}
                initialNumToRender={5}
                // refreshing={this.state.refreshing}
                // onRefresh={() => this.props.onRefresh()}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        peopleReducer: state.peopleReducer,
        user: state.authReducer.user
    }
};

export default connect(mapStateToProps, {fetchUsers})(Friends);