import firebase from '~/plugins/firebase.js'
const db = firebase.firestore()
export default {
  data() {
    return {
      messages: [],
    }
  },
  methods: {
    saveMessage(messageText, sentAt, currentGroupId) {
      if (messageText.trim()) {
        const message = {
          messageText,
          sentAt,
          sentBy: this.user.uid,
        }
        return new Promise((resolve, reject) => {
          db.collection('message')
            .doc(currentGroupId)
            .collection('messages')
            .add(message)
            .then(function (docRef) {
              resolve(message)
            })
            .catch(function (error) {
              reject(error)
            })
        })
      }
    },
    fetchMessagesByGroupId(groupId) {
      const vm = this
      vm.messages = []
      db.collection('message')
        .doc(groupId.trim())
        .collection('messages')
        .orderBy('sentAt')
        .onSnapshot((querySnapshot) => {
          const allMessages = []
          querySnapshot.forEach((doc) => {
            if (doc) allMessages.push(doc.data())
          })
          vm.messages = allMessages
        })
    },
  },
}
