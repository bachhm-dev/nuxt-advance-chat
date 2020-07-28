import firebase from '~/plugins/firebase.js'
const db = firebase.firestore()
export default {
  methods: {
    fetchUsersByGroup(group) {
      group.users = []
      const promises = []
      group.members.forEach((member) => {
        const promise = new Promise((resolve, reject) => {
          db.collection('user')
            .doc(member)
            .get()
            .then(function (doc) {
              // eslint-disable-next-line no-console
              console.log(JSON.stringify(doc.data()))
              resolve(doc.data())
            })
            .catch(function (error) {
              reject(error)
            })
        })
        promises.push(promise)
      })
      return Promise.all(promises)
    },
    saveUser(user) {
      // eslint-disable-next-line no-console
      const userRef = db.collection('user')
      userRef.doc(user.uid).set({
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
      })
    },
    checkUserExisted(user) {
      const docRef = db.collection('user').doc(user.uid)
      return new Promise((resolve, reject) => {
        docRef
          .get()
          .then(function (doc) {
            resolve(doc.exists)
          })
          .catch(function (error) {
            reject(error)
          })
      })
    },
    fetchUsers() {
      const vm = this
      return new Promise((resolve, reject) => {
        db.collection('user')
          .get()
          .then(function (querySnapshot) {
            const allUsers = []
            querySnapshot.forEach((doc) => {
              const user = doc.data()
              allUsers.push(user)
            })
            vm.users = allUsers
            resolve(allUsers.length > 0)
          })
          .catch(function (error) {
            reject(error)
          })
      })
    },
    getUserFromFireStore(user) {
      if (!user) return
      const docRef = db.collection('user').doc(user.uid)
      return new Promise((resolve, reject) => {
        docRef.onSnapshot(function (doc) {
          resolve(doc.data())
        })
      })
    },
  },
}
