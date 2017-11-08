import React from 'react';

import {
    Dimensions, ScaledSize,
    Platform,
    StyleSheet,
    Text, TextStyle,
    TouchableHighlight,
    View, ViewStyle
} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons'

import { observer, inject } from 'mobx-react/native';

import { NoteStore } from '../stores/NoteStore';
import Note from '../models/Note';
import NoteList from './NoteList';
import NoteDetails from './NoteDetails';

/**
 * Component StyleSheet
 */
const styles = StyleSheet.create({
    onePaneContainer: {
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%'
    } as ViewStyle,

    onePaneContent: {
        backgroundColor: 'white',
        flexGrow: 1
    } as ViewStyle,

    onePaneHeader: {
        backgroundColor: 'blue',
        display: 'flex',
        flexBasis: Platform.OS === 'ios' ? 56 : 64,
        flexDirection: 'row',
        height: Platform.OS === 'ios' ? 40 : 56,
        paddingTop: Platform.OS === 'ios' ? 20 : 25,
        width: '100%'
    } as ViewStyle,

    onePaneHeaderBackButton: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    } as TextStyle,

    onePaneHeaderLeftIconContainer: {
        alignSelf: 'center',
        flexBasis: 'auto',
        marginLeft: 16,
        minWidth: 32,
    } as ViewStyle,

    onePaneHeaderRightIconContainer: {
        alignSelf: 'center',
        flexBasis: 'auto',
        marginRight: 16,
        minWidth: 32
    } as ViewStyle,

    onePaneHeaderTitleContainer: {
        flexGrow: 1,
        alignSelf: 'center'
    } as ViewStyle,

    onePaneHeaderTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    } as TextStyle,

    twoPaneContainer: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        padding: 0,
        margin: 0,
        width: '100%'
    } as ViewStyle,

    twoPaneLeft: {
        borderRightWidth: 1,
        borderRightColor: '#C0C0C0',
        flexBasis: '40%',
        width: '40%'
    } as ViewStyle,

    twoPaneRight: {
        flexGrow: 1
    } as ViewStyle
});

interface MasterDetailProperties {
    /**
     * If true, forces two-pane mode.
     *
     * @type {boolean}
     * @memberof MasterDetailProperties
     */
    forceTwoPane?: boolean;

    /**
     * The store reference for the notes store.  Note that this needs to be optional
     * because the <Provider> component adjusts things appropriately, which the
     * code checker won't pick up on.
     *
     * @type {NoteStore}
     * @memberof MasterDetailProperties
     */
    noteStore?: NoteStore;
}

interface MasterDetailState {
    isLandscape?: boolean;
}

/**
 * Implements a master-detail design pattern
 *
 * @export
 * @class MasterDetail
 * @extends {React.Component<MasterDetailProperties>}
 */
@inject('noteStore')
@observer
export default class MasterDetail extends React.Component<MasterDetailProperties, MasterDetailState> {
    constructor(props: MasterDetailProperties) {
        super(props);
        this.state = {
            isLandscape: this.isLandscape()
        };

        // Not in typings - see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/18885
        Dimensions.addEventListener('change', () => {
            this.setState({ isLandscape: this.isLandscape() });
        });
    }

    /**
     * Returns true if the tablet or phone is in landscape orientation
     *
     * @returns {boolean} true if in landscape mode
     * @memberof MasterDetail
     */
    isLandscape(): boolean {
        const dim = Dimensions.get('screen');
        return dim.width >= dim.height;
    }

    /**
     * Determine if we are running on a tablet
     *
     * @returns {boolean} true if we are moving on a tablet.
     * @memberof MasterDetail
     */
    isTablet(): boolean {
        const msp = (dim: ScaledSize, limit: number): boolean => (dim.scale * dim.width) >= limit || (dim.scale * dim.height) >= limit;
        const dim = Dimensions.get('screen');
        return msp(dim, dim.scale < 2 ? 960 : 1800);
    }

    /**
     * Event Handler called when the user selects the specified item
     *
     * @param {Note} item the item that was selected
     * @memberof MasterDetailTwoPane
     */
    onSelectItem(item: Note) {
        this.props.noteStore.setActiveNote(item);
    }

    /**
     * Event Handler called when the user deletes the specified item
     *
     * @param {Note} item the item to be deleted
     * @memberof MasterDetailTwoPane
     */
    onDeleteItem(item: Note) {
        this.props.noteStore.deleteNote(item);
    }

    /**
     * Event Handler called when the user changes the record
     *
     * @param {Note} item the new version of the item
     * @memberof MasterDetail
     */
    onChangeItem(item: Note) {
        this.props.noteStore.saveNote(item);
    }

    /**
     * Event Handler called when the user closes the active note
     *
     * @memberof MasterDetail
     */
    onClearSelection() {
        this.props.noteStore.clearActiveNote();
    }

    /**
     * Determine whether to use two-pane more or not.
     *
     * @returns {boolean} true if two-pane mode is required.
     * @memberof MasterDetail
     */
    useTwoPane(): boolean {
        return this.props.forceTwoPane || (this.isTablet() && this.isLandscape());
    }

    /**
     * React Lifecycle method - returns the rendered component
     *
     * @returns {JSX.Element}
     * @memberof MasterDetail
     */
    render(): JSX.Element {
        if (this.useTwoPane()) {
            /*
             * BEGIN: Two-Pane Mode where the list is on the left and the details on the right
             */
            const activeNote = this.props.noteStore.getNote();
            const activeNoteTitle = activeNote === null ? <Text/>
                : <Text style={styles.onePaneHeaderTitle}>{activeNote.title}</Text>;
            const activeNoteView = activeNote === null ? <View/>
                : <NoteDetails item={activeNote} onChangeItem={(item: Note) => this.onChangeItem(item)} />

            return (
                <View style={styles.twoPaneContainer}>
                    <View style={styles.twoPaneLeft}>
                        <View style={styles.onePaneHeader}>
                            <View style={styles.onePaneHeaderLeftIconContainer}>
                            </View>
                            <View style={styles.onePaneHeaderTitleContainer}>
                                <Text style={styles.onePaneHeaderTitle}>Notes</Text>
                            </View>
                        </View>
                        <NoteList
                            items={this.props.noteStore.notes}
                            onSelectItem={(item: Note) => this.onSelectItem(item)}
                            onDeleteItem={(item: Note) => this.onDeleteItem(item)}
                        />
                    </View>
                    <View style={styles.twoPaneRight}>
                        <View style={styles.onePaneHeader}>
                            <View style={styles.onePaneHeaderLeftIconContainer}>
                            </View>
                            <View style={styles.onePaneHeaderTitleContainer}>
                                {activeNoteTitle}
                            </View>
                            <View style={styles.onePaneHeaderRightIconContainer}>
                                <TouchableHighlight onPress={() => this.onClearSelection()}>
                                    <Text style={styles.onePaneHeaderBackButton}>Done</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View style={styles.onePaneContent}>
                            {activeNoteView}
                        </View>
                    </View>
                </View>
            );
            /*
             * END: Two-pane mode
             */
        }

        if (this.props.noteStore.activeNoteId === null) {
            /*
             * BEGIN: One-pane mode where the list is displayed
             */
            return (
                <View style={styles.onePaneContainer}>
                    <View style={styles.onePaneHeader}>
                        <View style={styles.onePaneHeaderLeftIconContainer}>
                        </View>
                        <View style={styles.onePaneHeaderTitleContainer}>
                            <Text style={styles.onePaneHeaderTitle}>Notes</Text>
                        </View>
                    </View>
                    <View style={styles.onePaneContent}>
                        <NoteList
                            items={this.props.noteStore.notes}
                            onSelectItem={(item: Note) => this.onSelectItem(item)}
                            onDeleteItem={(item: Note) => this.onDeleteItem(item)}
                        />
                    </View>
                </View>
            );
            /*
             * END: One-pane mode where the list is displayed
             */
        } else {
            /*
             * BEGIN: One-pane mode where the details are displayed
             */
            const activeNote = this.props.noteStore.getNote();
            return (
                <View style={styles.onePaneContainer}>
                    <View style={styles.onePaneHeader}>
                        <View style={styles.onePaneHeaderLeftIconContainer}>
                            <TouchableHighlight onPress={() => this.onClearSelection()}>
                                <Icon style={styles.onePaneHeaderBackButton} name="ios-arrow-back"/>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.onePaneHeaderTitleContainer}>
                            <Text style={styles.onePaneHeaderTitle}>{activeNote.title}</Text>
                        </View>
                    </View>
                    <View style={styles.onePaneContent}>
                        <NoteDetails item={activeNote} onChangeItem={(item: Note) => this.onChangeItem(item)} />
                    </View>
                </View>
            );
            /*
             * END: One-pane mode where the details are displayed
             */
        }
    }
}