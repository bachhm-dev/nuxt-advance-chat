<template>
  <v-layout column justify-center>
    <v-flex xs12 sm8 md6>
      <div class="container">
        <h3 class="text-center">{{ username ? username : 'Messaging' }}</h3>
        <div v-if="!isLogin">
          <v-row align="center">
            <v-col class="text-center" cols="12" lg="8">
              <v-text-field
                v-model="username"
                :counter="10"
                label="First name"
                required
              ></v-text-field>
            </v-col>
            <v-col class="text-center" cols="12" lg="4">
              <div class="my-2">
                <v-btn small @click="signInWithGoogleAuthentication"
                  >Login</v-btn
                >
              </div>
            </v-col>
          </v-row>
        </div>
        <div v-else class="messaging">
          <div class="inbox_msg">
            <div class="inbox_people">
              <div class="headind_srch">
                <div class="recent_heading">
                  <h4>Recent</h4>
                </div>
                <div class="srch_bar">
                  <div class="stylish-input-group">
                    <input
                      type="text"
                      class="search-bar"
                      placeholder="Search"
                    />
                    <span class="input-group-addon">
                      <button type="button">
                        <i class="fa fa-search" aria-hidden="true"></i>
                      </button>
                    </span>
                  </div>
                </div>
              </div>
              <div class="inbox_chat">
                <div class="chat_list active_chat">
                  <div class="chat_people">
                    <div class="chat_img">
                      <v-icon color="white">mdi-account-circle</v-icon>
                    </div>
                    <div class="chat_ib">
                      <h5>
                        Bach Hoang
                        <span class="chat_date">Dec 25</span>
                      </h5>
                      <p>Test firebase chat</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mesgs">
              <div class="msg_history">
                <div v-for="(msg, i) in messages" :key="i">
                  <div v-if="msg.username === username" class="outgoing_msg">
                    <div class="sent_msg">
                      <p>{{ msg.message }}</p>
                      <span class="time_date">{{
                        msg.createAt.seconds | formatUnix
                      }}</span>
                    </div>
                  </div>
                  <div v-else class="incoming_msg">
                    <div class="incoming_msg_img">
                      <v-icon color="primary">mdi-account-circle</v-icon>
                    </div>
                    <div class="received_msg">
                      <div class="received_withd_msg">
                        <p>{{ msg.message }}</p>
                        <span class="time_date">{{
                          msg.createAt.seconds | formatUnix
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="type_msg">
                <div class="input_msg_write">
                  <input
                    v-model="message"
                    type="text"
                    class="write_msg"
                    placeholder="Type a message"
                    @keyup.enter="saveMessage"
                  />
                  <v-btn
                    class="mx-2"
                    fab
                    dark
                    small
                    depressed
                    color="primary"
                    style="position: absolute; right: 0; top: 10px;"
                    @click="saveMessage"
                  >
                    <v-icon color="white">mdi-send</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import firebase from '~/plugins/firebase.js'
const db = firebase.firestore()
const auth = firebase.auth()
export default {
  components: {},
  data() {
    return {
      user: undefined,
      username: undefined,
      isLogin: false,
      message: null,
      messages: [],
    }
  },
  watch: {
    async user(val) {
      const exist = await this.getUserFromFirebase(val)
      if (exist) return
      this.saveUserToFirestore(val)
    },
  },
  created() {
    this.fetchMessages()
  },
  methods: {
    saveMessage() {
      const vm = this
      if (this.message.trim()) {
        db.collection('chat')
          .add({
            message: this.message,
            createAt: new Date(),
            username: this.username,
          })
          .then(function (docRef) {
            vm.message = null
          })
          .catch(function (error) {
            // eslint-disable-next-line no-console
            console.error('Error adding document: ', error)
          })
      }
    },
    fetchMessages() {
      const vm = this
      db.collection('chat')
        .orderBy('createAt')
        .onSnapshot((querySnapshot) => {
          const allMessages = []
          querySnapshot.forEach((doc) => {
            allMessages.push(doc.data())
          })
          vm.messages = allMessages
        })
    },
    signInWithGoogleAuthentication() {
      const vm = this
      const provider = new firebase.auth.GoogleAuthProvider()
      auth
        .signInWithPopup(provider)
        .then(function (result) {
          // The signed-in user info.
          vm.user = result.user
          vm.saveToStore(vm.user)
        })
        .catch(function (error) {
          // eslint-disable-next-line no-console
          console.error(error)
        })
    },
    saveToStore(user) {
      // save to vuex store
      this.$store.commit('user/add', user)
    },
    saveUserToFirestore(user) {
      // eslint-disable-next-line no-console
      const userRef = db.collection('user')
      userRef.doc(user.uid).set({
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
      })
    },
    getUserFromFirebase(user) {
      const docRef = db.collection('user').doc(user.uid)
      return new Promise((resolve, reject) => {
        docRef
          .get()
          .then(function (doc) {
            resolve(doc.exists)
          })
          .catch(function (error) {
            // eslint-disable-next-line no-console
            console.error('Error getting document:', error)
          })
      })
    },
  },
}
</script>
<style scoped>
.container {
  max-width: 1170px;
  margin: auto;
}
img {
  max-width: 100%;
}
.inbox_people {
  background: #f8f8f8 none repeat scroll 0 0;
  float: left;
  overflow: hidden;
  width: 40%;
  border-right: 1px solid #c4c4c4;
}
.inbox_msg {
  border: 1px solid #c4c4c4;
  clear: both;
  overflow: hidden;
}
.top_spac {
  margin: 20px 0 0;
}

.recent_heading {
  float: left;
  width: 40%;
}
.srch_bar {
  display: inline-block;
  text-align: right;
  width: 60%;
}
.headind_srch {
  padding: 10px 29px 10px 20px;
  overflow: hidden;
  border-bottom: 1px solid #c4c4c4;
}

.recent_heading h4 {
  color: #05728f;
  font-size: 21px;
  margin: auto;
}
.srch_bar input {
  border: 1px solid #cdcdcd;
  border-width: 0 0 1px 0;
  width: 80%;
  padding: 2px 0 4px 6px;
  background: none;
}
.srch_bar .input-group-addon button {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  padding: 0;
  color: #707070;
  font-size: 18px;
}
.srch_bar .input-group-addon {
  margin: 0 0 0 -27px;
}

.chat_ib h5 {
  font-size: 15px;
  color: #464646;
  margin: 0 0 8px 0;
}
.chat_ib h5 span {
  font-size: 13px;
  float: right;
}
.chat_ib p {
  font-size: 14px;
  color: #989898;
  margin: auto;
}
.chat_img {
  float: left;
  width: 11%;
}
.chat_ib {
  float: left;
  padding: 0 0 0 15px;
  width: 88%;
}

.chat_people {
  overflow: hidden;
  clear: both;
}
.chat_list {
  border-bottom: 1px solid #c4c4c4;
  margin: 0;
  padding: 18px 16px 10px;
}
.inbox_chat {
  height: 550px;
  overflow-y: scroll;
}

.active_chat {
  background: #ebebeb;
}

.incoming_msg_img {
  display: inline-block;
  width: 6%;
}
.received_msg {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
}
.received_withd_msg p {
  background: #ebebeb none repeat scroll 0 0;
  border-radius: 3px;
  color: #646464;
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  width: 100%;
}
.time_date {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
}
.received_withd_msg {
  width: 57%;
}
.mesgs {
  float: left;
  padding: 30px 15px 0 25px;
  width: 60%;
}

.sent_msg p {
  background: #05728f none repeat scroll 0 0;
  border-radius: 3px;
  font-size: 14px;
  margin: 0;
  color: #fff;
  padding: 5px 10px 5px 12px;
  width: 100%;
}
.outgoing_msg {
  overflow: hidden;
  margin: 26px 0 26px;
}
.sent_msg {
  float: right;
  width: 46%;
}
.input_msg_write input {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
}

.type_msg {
  border-top: 1px solid #c4c4c4;
  position: relative;
}
.msg_send_btn {
  background: #05728f none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  font-size: 17px;
  height: 33px;
  position: absolute;
  right: 0;
  top: 11px;
  width: 33px;
}
.messaging {
  padding: 0 0 50px 0;
}
.msg_history {
  height: 516px;
  overflow-y: auto;
}
</style>
