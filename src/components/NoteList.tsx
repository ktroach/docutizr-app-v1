import React from 'react';
import { FlatList, FlatListProperties } from 'react-native';
import Swipeout, { SwipeoutProperties, SwipeoutButtonProperties } from 'react-native-swipeout';
import Note from '../models/Note';
import NoteListItem from './NoteListItem';

/**
 * List of properties for the NoteList component
 *
 * @interface NoteListProps
 */
interface NoteListProps {
    /**
     * List of Items to render in the list
     *
     * @type {Note[]}
     * @memberof NoteListProps
     */
    items: Note[];

    /**
     * Event Handler called when an item is clicked
     *
     * @param {Note} item the item that was clicked
     * @memberof NoteListProps
     */
    onSelectItem?(item: Note): void;

    /**
     * Event Handler called when an item is swipe-right deleted
     *
     * @param {Note} item the item that is to be deleted
     * @memberof NoteListProps
     */
    onDeleteItem?(item: Note): void;
}

/**
 * The state of the NoteList component
 *
 * @interface NoteListState
 */
interface NoteListState {
    /**
     * The noteId of the currently open swiped-right drawer.
     *
     * @type {string}
     * @memberof NoteListState
     */
    activeRow: null | string;
}

/**
 * The NoteList component - renders a list of items
 *
 * @export
 * @class NoteList
 * @extends {React.Component<NoteListProps, NoteListState>}
 */
export default class NoteList extends React.Component<NoteListProps, NoteListState> {
    constructor(props: NoteListProps) {
        super(props);
        this.state = {
            activeRow: null
        };
    }

    /**
     * Event Handler called when the user opens the swipe-right
     *
     * @param {Note} item the item that was swiped right
     * @param {number} rowId the row number in the items table
     * @param {string} dir the swipe direction
     * @memberof NoteList
     */
    onSwipeOpen(item: Note, rowId: number, dir: string): void {
        this.setState({ activeRow: item.noteId });
    }

    /**
     * Event Handler called when the user closes the swipe-right
     *
     * @param {Note} item the item that was swiped right
     * @param {number} rowId the row number in the items table
     * @param {string} dir the swipe direction
     * @memberof NoteList
     */
    onSwipeClose(item: Note, rowId: number, dir: string): void {
        if (item.noteId === this.state.activeRow && typeof dir !== 'undefined') {
            this.setState({ activeRow: null });
        }
    }

    /**
     * Event Handler called when an item in the list is clicked
     *
     * @param item the item that was selected
     */
    onSelectItem(item: Note): void {
        console.log(`NoteList:onSelectItem(${item.noteId})`);
        if (this.props.onSelectItem) {
            this.props.onSelectItem(item);
        }
    }

    /**
     * Event Handler called when an item in the list is to be deleted
     *
     * @param item the item that is to be deleted
     */
    onDeleteItem(item: Note): void {
        console.log(`NoteList:onDeleteItem(${item.noteId})`);
        if (this.props.onDeleteItem) {
            this.props.onDeleteItem(item);
        }
    }

    /**
     * Renders a single element in the list
     *
     * @param item the item to be rendered
     * @param index the index of the item to be rendered in the list
     */
    renderItem(item: Note, index: number): JSX.Element {
        const swipeSettings = {
            autoClose: true,
            close: item.noteId !== this.state.activeRow,
            onClose: (secId, rowId, dir) => this.onSwipeClose(item, rowId, dir),
            onOpen: (secId, rowId, dir) => this.onSwipeOpen(item, rowId, dir),
            right: [
                { onPress: () => this.onDeleteItem(item), text: 'Delete', type: 'delete' }
            ] as SwipeoutButtonProperties[],
            rowId: index,
            sectionId: 1,
            style: { backgroundColor: 'white' }
        } as SwipeoutProperties;

        return (
            <Swipeout {...swipeSettings}>
                <NoteListItem item={item} onPress={() => this.onSelectItem(item)}/>
            </Swipeout>
        );
    }

    /**
     * Renders the component
     *
     * @returns {React.Element} the rendered component
     * @memberof NoteList
     */
    render(): JSX.Element {
        const listSettings = {
            data: this.props.items,
            extraData: this.state.activeRow,
            keyExtractor: (item, index) => item.noteId,
            renderItem: ({ item, index }) => this.renderItem(item, index),
            style: { backgroundColor: 'white' }
        } as FlatListProperties<Note>;

        return (<FlatList {...listSettings}/>);
    }
}