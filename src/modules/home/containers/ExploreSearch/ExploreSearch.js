import React, {Component} from 'react';


import {FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';

import {SearchBar} from 'react-native-elements'
import styles from "./styles"
import {connect} from "react-redux";
import {searchUsers} from "../../../../network/firebase/user/actions";
import UserListItem from "../../../people/components/UserListItem/UserListItem";
import PropTypes from "prop-types";


class ExploreSearch extends Component {
    constructor(props) {
        super(props);
        this.state =
            {
                selectedValue: '',
                searchValue: '',
                searchResults: null
            }
    }

    handleItemSelect = (value) => {
        this.setState({value: value});
    };

    handleSearch = () => {
        this.props.searchUsers(this.state.searchValue, (users) => {
            let searchResults = Object.keys(users);
            if (searchResults.length === 0) {
                searchResults = null;
            }
            this.setState({searchResults: searchResults});
        });
    };

    renderItem = (item) => {
        const userId = item.item;
        return <UserListItem userId={userId}/>
    };

    render() {

        const {searchHint, callback} = this.props;

        const eventIds = this.props.eventReducer.allIds;
        const eventById = this.props.eventReducer.byId;

        const events = eventIds.map(id => {
            return {id: eventById[id]}
        });

        return (
            <SafeAreaView style={styles.container}>

                <View style={[styles.padded, styles.rowContainer]}>

                    <SearchBar
                        onChangeText={(text) => this.setState({searchValue: text})}
                        placeholder={searchHint}
                        rounded
                        lightTheme
                        inputStyle={styles.searchInput}
                        containerStyle={styles.searchBar}
                        onSubmitEditing={(event) => this.handleSearch()}
                        // onEndEditing={() => {this.props.searchUsers}
                        noIcon
                    />

                    <TouchableOpacity onPress={() => this.props.onCancel()}>
                        <Text style={styles.headerText}>Cancel</Text>
                    </TouchableOpacity>

                </View>

                <FlatList
                    data={this.state.searchResults}
                    renderItem={(item) => this.renderItem(item)}
                    keyExtractor={(userId) => userId}
                    // refreshing={this.state.refreshing}
                    // onRefresh={() => this.props.onRefresh()}
                />

            </SafeAreaView>
        );
    }
}


ExploreSearch.propTypes = {
    onCancel: PropTypes.func
};

ExploreSearch.defaultProps = {
    onCancel: () => {
    }
};

//allows the component to use props as specified by reducers
const mapStateToProps = (state) => {
    return {
        eventReducer: state.eventReducer,
        feedReducer: state.feedReducer,
        user: state.authReducer.user
    }
};

//allows the component to use actions as props
const actions = {
    searchUsers
};

export default connect(mapStateToProps, actions)(ExploreSearch);