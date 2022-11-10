import notePreview from './note-preview.cmp.js'
// import notePreviewNotpinned from './note-preview-notPinned.cmp.js'




export default {
    props: ['notes'],
    template: `
        <section class="note-list">
            <ul class="notes-list-ul">
                <li v-for="note in notes" :key="note.id" class="note" :style="{backgroundColor:note.style.backgroundColor}">
                    <note-preview :note="note"/>           
                    <section class="actions-note-item">
                        <button @click="remove(note.id)">x</button>
                        <button @click="pin(note)">🧷</button>
                        <button @click="duplicate(note)">dup</button>
                        <label class="label-color-item">
                            <input v-model="color" type="color" class="input-color-item" @input="changeColor(note.id)"/>                            
                        </label>
                    </section>
                </li>
            </ul>



        </section>
    `,
    data(){
        return {
            color: '#f16a81',

        }
    },
    methods: {
        remove(noteId) {
            this.$emit('remove', noteId)
        },
        pin(note) {
            this.$emit('pin', note)
        },
        changeColor(noteId,) {
            this.$emit('changeColor', noteId,this.color)
        },
        duplicate(note){
            this.$emit('duplicate', note)
        }
    },
    components: {
        notePreview,
        // notePreviewNotpinned,
    }
}