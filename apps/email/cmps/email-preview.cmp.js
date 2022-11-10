import emailDetails from './email-details.cmp.js'
import { emailService } from '../services/email.service.js'

export default {
    props: ['email'],
    template: `
    <section @click="emailSelect(email)" :class="checkIfRead(email)" class="email-preview">
            <p class="bolded">{{substringSender}}</p>
        <p class="bold">{{ email.subject }}</p>
        <p class="body">{{ substringBody }}</p>
        <p >{{formattedSeenAt}}</p>
    </section>
    <email-details @reRender="$emit('rerender')" :email="selectedEmail" v-if="isEmailOpen" />
    `,
    data() {
        return {
            selectedEmail: null,
            isEmailOpen:false,
        }
    },
    methods: {
        emailSelect(email) {
            email.isRead = true
            this.selectedEmail = email
            this.isEmailOpen = !this.isEmailOpen
            emailService.save(email)
        },
        checkIfRead(email){
            console.log(email);
            if(!email.isRead) return 'unread'
        },
    },
    computed: {
        substringSender() {
            let string = this.email.from
            let split = string.split("@");
            let value = split[0];
            return value
        },
        formattedSeenAt() {
            let currDay = new Date().getDay()
            let seen = this.email.sentAt
            let datedFormat = new Date(seen)
            if (datedFormat.getDay() !== currDay) return datedFormat.getDay() + '/' + (datedFormat.getMonth() + 1)
            else return datedFormat.getHours() + ":" + datedFormat.getMinutes()

        },

        substringBody(){
            if(this.email.body.length >= 50)  return this.email.body.slice(0,50) + '...'
           else return this.email.body
        }
    },

    components: {
        emailDetails,

    },
}

