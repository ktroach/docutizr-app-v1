import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { NoteStore } from '../stores/noteStore';
import Note from '../models/Note';
import NoteList from './NoteList';

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'ios' ? 20 : 0
    } as ViewStyle
});

interface NoteListPageProperties {
    /**
     * The store reference for the notes store.  Note that this needs to be optional
     * because the <Provider> component adjusts things appropriately, which the
     * code checker won't pick up on.
     *
     * @type {NoteStore}
     * @memberof NoteListPageProperties
     */
    noteStore?: NoteStore
}

@inject('noteStore')
@observer
export default class NoteListPage extends React.Component<NoteListPageProperties> {
    onDeleteItem(item: Note): void {
        this.props.noteStore.deleteNote(item);
    }

    render() {
        return (
            <View style={styles.container}>
                <NoteList
                    items={this.props.noteStore.notes}
                    onDeleteItem={(item: Note) => this.onDeleteItem(item)}
                />
            </View>
        );
    }
}

