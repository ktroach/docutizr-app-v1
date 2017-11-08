import React from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    Text,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';
import Note from '../models/Note';

/**
 * Stylesheet for this component
 */
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#C0C0C0',
        flex: 1,
        flexDirection: 'column',
        height: 40,
        marginBottom: 2,
        marginLeft: 8,
        marginRight: 8,
        marginTop: 2
    } as ViewStyle,

    info: {
        color: '#C0C0C0',
        fontSize: 8,
    } as TextStyle,

    infoContainer: {
        flexBasis: 'auto'
    } as ViewStyle,

    title: {
        color: 'black',
        fontSize: 18
    } as TextStyle,

    titleContainer: {
        flexGrow: 1
    } as ViewStyle,
});

/**
 * Properties for the NoteListItem component
 *
 * @interface NoteListItemProperties
 */
interface NoteListItemProperties {
    /**
     * The item to be rendered
     *
     * @type {Note}
     * @memberof NoteListItemProperties
     */
    item: Note;

    /**
     * Event Handler to be called when the item is pressed
     *
     * @memberof NoteListItemProperties
     */
    onPress?(): void;
}

const NoteListItem: React.SFC<NoteListItemProperties> = (props) => {
    const onPress = props.onPress ? props.onPress : () => { /* Do Nothing */ };

    return (
        <TouchableHighlight onPress={onPress}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{props.item.title}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.info}>{props.item.noteId}</Text>
                </View>
            </View>
        </TouchableHighlight>
    );
}

export default NoteListItem;