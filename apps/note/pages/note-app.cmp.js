
import { noteService } from '../services/note.service.js'
import { showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service.js'

import noteFilter from '../cmps/note-filter.cmp.js'
import noteList from '../cmps/note-list.cmp.js'
import noteAdd from '../cmps/add-note.cmp.js'


export default {
    template: `
    <section class="note-app-page">
            <note-filter @filter="filter"/>
            <hr />
            <note-add @addNote="addNote"/>
        <note-list 
        @remove="removeNote"
        @pin="pinNote"
        @duplicate="duplicate"
        @changeColor="changeColor"
        :notes="notesToShow"/>
    </section>
    `,
    data() {
        return {
            notes: [],
            filterBy: null,
        }
    },
    created() {
        noteService.query()
            .then(notes => {
                this.notes = notes
            })
    },
    methods: {
        removeNote(noteId) {
            noteService.remove(noteId)
                .then(() => {
                    const idx = this.notes.findIndex(note => note.id === noteId)
                    this.notes.splice(idx, 1)
                    showSuccessMsg(`note ${noteId} deleted`)
                })
                .catch(err => {
                    console.log('OOPS', err)
                    showErrorMsg('Cannot remove note')
                })
        },
        pinNote(currdNote) {
            const idx = this.notes.findIndex(note => note.id === currdNote.id)
            currdNote.isPinned = !currdNote.isPinned
            this.notes.splice(idx, 1)
            if (!currdNote.isPinned) this.notes.push(currdNote)
            else this.notes.unshift(currdNote)
            noteService.saveAll(this.notes)
        },
        changeColor(noteId, backgroundColor) {
            noteService.get(noteId)
                .then(() => {
                    const idx = this.notes.findIndex(note => note.id === noteId)
                    this.notes[idx].style.backgroundColor = backgroundColor
                    noteService.save(this.notes[idx])
                })
        },
        addNote(newNote) {
            noteService.save(newNote)
            this.notes.push(newNote)
        },
        duplicate(note) {
            var newNote = JSON.parse(JSON.stringify(note));
            newNote.id = null
            newNote.isPinned = false
            noteService.save(newNote)
                .then(newNote => {
                    this.notes.push(newNote)
                })
        },
        filter(filterBy) {
            this.filterBy = filterBy
        },
        loadNote() {
            console.log("loading");
            // console.log(this.$route.params.obj);
            // const note = JSON.parse(this.$route.params.obj);
            // console.log(note);
            // this.email.subject = note.subject;
            // this.email.body = note.body;
        },
    },

    computed: {
        notesToShow() {
            if (!this.filterBy) return this.notes
            const regex = new RegExp(this.filterBy.text, 'i')
            return this.notes.filter(note => {
                if (note.type === 'note-txt') return regex.test(note.info.txt)
                else if (note.type === 'note-todos') return regex.test(note.info.label)
                else return regex.test(note.info.title)
            })

        },
        obj() {
            return this.$route.params.obj
        }
    },
    watch: {
        obj() {
            // this.$route.params.obj;
            // if (!this.$route.params.obj) return
            console.log(this.$route.params.obj);
            // this.loadNote()

        }
    },
    components: {
        noteList,
        noteFilter,
        noteAdd
    }
}