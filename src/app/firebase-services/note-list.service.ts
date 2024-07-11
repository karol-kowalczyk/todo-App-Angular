import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, elementAt } from 'rxjs';
import { Note } from '../interfaces/note.interface';

// dieses Injectable soll ueberall im Code helfen
@Injectable({
  providedIn: 'root'
})

export class NoteListService {

  // zwei Arrays vom Typ Note
  trashNotes: Note[] = [];  // hier kommen die Notizen rein, die in den Papierkorb gehoeren
  normalNotes: Note[] = []; // hier kommen die Notizen rein, die in die Notizen gehören 

  unsubTrash; // hiermit werden die Werte in Angular gespeichert, dieser muss im Nachhinein wieder auch beendet werden mit ngonDestroy() 
  unsubNotes;

  firestore: Firestore = inject(Firestore); // implementiereung der Firebase Datenbank

  constructor() {
    this.unsubNotes = this.subNotesList(); // beim laden des Constructors wird die function subNotesList ausgefuehrt
    this.unsubTrash = this.subTrashList();
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch((err) => {
        console.log(err);
      });
    }
  }

  async deleteNote(colId: string, docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch((err) => {
      console.log(err)}
    );
  }

  getCleanJson(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked
    }
  }

  getColIdFromNote(note: Note) {
    if (note.type == "note") {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  async addNote(item: Note, coliD: 'notes' | 'trash') {
    await addDoc(this.getNotesRef(), item).catch(
      (err) => { console.error(err) })
      .then((docRef) => {
        console.log("Document written with ID:", docRef);
      }); // addDoc als promise muss nur wissen, wo rein und was.
  }

  ngonDestroy() { // beendet die Funktionen wenn diese nicht mehr gebraucht werden um Datenlecks zu vermeiden
    this.unsubNotes();
    this.unsubTrash();
  }

  setNoteObject(obj: any, id: string): Note {  // setzen eine neue Notiz
    return {
      id: id || "",
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }

  subTrashList() { // falls eine Aenderung in den Notizen eintrifft, wissen wir dies sofort.
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  getNotesRef() { // hier wird die Datenbank gelesen
    return (collection(this.firestore, 'notes'));
  }

  getTrashRef() {
    return (collection(this.firestore, 'trash'));
  }

  getSingleDocRef(colId: string, docId: string) {
    let docRef = doc(collection(this.firestore, colId), docId);
    return docRef
  }

}
