import { observable } from 'mobx';
import Note from '../models/Note';
import uuid from 'uuid';

export class NoteStore {
    @observable notes: Note[] = [];
    @observable activeNoteId: string|null = null;

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
            if (note.noteId === this.activeNoteId) {
                this.activeNoteId = null;
            }
        }
    }

    getNote(): Note {
        console.log(`NoteStore.getNote()`);
        const idx = this.notes.findIndex((n) => n.noteId === this.activeNoteId);
        if (idx < 0) {
            return null;
        } else {
            return this.notes[idx];
        }
    }

    setActiveNote(note: Note) {
        console.log(`NoteStore.setActiveNote(${note.noteId})`);
        this.activeNoteId = note.noteId;
    }

    clearActiveNote() {
        console.log(`NoteStore.clearActiveNote()`);
        this.activeNoteId = null;
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