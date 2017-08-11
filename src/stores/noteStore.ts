import { observable } from 'mobx';
import Note from '../models/Note';
import uuid from 'uuid';

export class NoteStore {
    @observable notes: Note[] = [];

    saveNote(note: Note) {
        console.log(`NoteStore:saveNote(${note.noteId})`);
        const idx = this.notes.findIndex((n) => note.noteId === n.noteId);
        if (idx < 0) {
            this.notes.push(note);
        } else {
            this.notes[idx] = note;
        }
    }

    deleteNote(note: Note) {
        console.log(`NoteStore:deleteNote(${note.noteId})`);
        const idx = this.notes.findIndex((n) => n.noteId === note.noteId);
        if (idx < 0) {
            throw new Error(`Note ${note.noteId} not found`);
        } else {
            this.notes.splice(idx, 1);
        }
    }

    getNote(noteId: string): Note {
        console.log(`NoteStore.getNote(${noteId})`);
        const idx = this.notes.findIndex((n) => n.noteId === noteId);
        if (idx < 0) {
            throw new Error(`Note ${noteId} not found`);
        } else {
            return this.notes[idx];
        }
    }
}

const observableNoteStore = new NoteStore();

const newNote = (title: string, content: string) => {
    const note = {
        noteId: uuid.v4(),
        title: title,
        content: content,
        updatedAt: Date.now(),
        createdAt: Date.now()
    };
    observableNoteStore.saveNote(note);
}

newNote('First Note', 'ff1');
newNote('2nd Note', 'ff1');
newNote('3rd Note', 'ff1');
newNote('4th Note', 'ff1');

export default observableNoteStore;
