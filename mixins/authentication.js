import firebase from '~/plugins/firebase.js'
const auth = firebase.auth()
const CryptoJS = require('crypto-js')

export default {
  data() {
    return {
      passphrase: 'FirebaseChat',
    }
  },
  methods: {
    signInWithGoogleAuthentication() {
      const provider = new firebase.auth.GoogleAuthProvider()
      return new Promise((resolve, reject) => {
        auth
          .signInWithPopup(provider)
          .then(function (result) {
            resolve(result.user)
          })
          .catch(function (error) {
            reject(error)
          })
      })
    },
    saveUserToLocalStorage(user) {
      if (process.client) {
        const encryptWithAES = CryptoJS.AES.encrypt(
          JSON.stringify(user),
          this.passphrase
        ).toString()
        localStorage.setItem('enus', encryptWithAES)
      }
    },
    saveUserToStore(user) {
      this.$store.commit('user/add', user)
    },
    decryptUser() {
      if (process.client) {
        const encryptedUser = localStorage.getItem('enus')
        if (encryptedUser) {
          const bytes = CryptoJS.AES.decrypt(encryptedUser, this.passphrase)
          const decryptWithAES = bytes.toString(CryptoJS.enc.Utf8)
          return JSON.parse(decryptWithAES)
        }
      }
    },
  },
}
