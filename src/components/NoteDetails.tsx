import React from 'react';
import {
    StyleSheet,
    TextInput,
    Text, TextStyle,
    View, ViewStyle
} from 'react-native';
import Note from '../models/Note';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        padding: 8,
        width: '100%'
    } as ViewStyle,

    contentContainer: {
        flexGrow: 1,
        marginTop: 8
    } as ViewStyle,

    contentTextInput: {
        borderWidth: 1,
        borderColor: '#C0C0C0'
    } as TextStyle,

    info: {
        color: '#C0C0C0',
        fontSize: 8,
        fontWeight: '300'
    } as TextStyle,

    infoContainer: {
        flexBasis: 'auto'
    } as ViewStyle,

    titleContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#C0C0C0',
        flexBasis: 'auto'
    } as ViewStyle
});

interface NoteDetailsProperties {
    /**
     * The note to display
     *
     * @type {Note}
     * @memberof NoteDetailsProperties
     */
    item: Note;

    /**
     * Event handler for when an item is changed
     *
     * @param {Note} item the newly stored item
     * @memberof NoteDetailsProperties
     */
    onChangeItem(item: Note): void;
}

const NoteDetails: React.SFC<NoteDetailsProperties> = (props) => {
    const createdString = new Date(props.item.createdAt).toLocaleString();
    const updatedString = new Date(props.item.updatedAt).toLocaleString();

    const onChangeTitle = (text: string) => {
        const newItem = Object.assign({}, props.item, { title: text });
        props.onChangeItem(newItem);
    };

    const onChangeContent = (text: string) => {
        const newItem = Object.assign({}, props.item, { content: text });
        props.onChangeItem(newItem);
    };

    const commonTextInputProperties = {
        autoCorrect: true,
        editable: true,
        spellCheck: true
    };
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <TextInput {...commonTextInputProperties}
                    autoFocus={true}
                    onChangeText={(text) => onChangeTitle(text)}
                    placeholder="Enter Title"
                    placeholderTextColor="#C0C0C0"
                    returnKeyType={'next'}
                    value={props.item.title}
                />
            </View>
            <View style={styles.contentContainer}>
                <TextInput {...commonTextInputProperties}
                        multiline={true}
                        numberOfLines={10}
                        onChangeText={(text) => onChangeContent(text)}
                        placeholder="Enter Note"
                        placeholderTextColor="#C0C0C0"
                        value={props.item.content}
                        style={styles.contentTextInput}
                    />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.info}>{`Id: ${props.item.noteId}`}</Text>
                <Text style={styles.info}>{`Created on: ${createdString}`}</Text>
                <Text style={styles.info}>{`Updated on: ${updatedString}`}</Text>
            </View>
        </View>
    );
};

export default NoteDetails