<template>
  <v-layout column justify-center>
    <v-flex xs12 sm8 md6>
      <div class="container">
        <div v-if="!user">
          <v-row align="center">
            <v-col v-if="user" class="text-center" cols="12" lg="12">
              <v-text-field
                v-model="user.displayName"
                label="Display name"
                required
                disabled="true"
              ></v-text-field>
            </v-col>
            <v-col v-else class="text-center" cols="12" lg="12">
              <div class="my-2">
                <v-btn small @click="login">Login</v-btn>
              </div>
            </v-col>
          </v-row>
        </div>
        <div v-else class="messaging">
          <div class="inbox_msg">
            <div class="inbox_people">
              <div class="headind_srch">
                <v-row>
                  <v-col v-if="user" align="left" justify="center" cols="3">
                    <v-avatar size="40" class="mx-2">
                      <img :src="user.photoURL" />
                    </v-avatar>
                  </v-col>
                  <v-col v-if="user" cols="9" align="right" justify="center">
                    <GroupDialog
                      v-if="users.length > 0"
                      :users="users"
                      @created="chooseGroup($event)"
                    />
                  </v-col>
                </v-row>
                <v-row height="100px" no-gutters>
                  <v-col cols="12" align="center" justify="center" class="px-2">
                    <v-autocomplete
                      v-model="filtered"
                      depressed
                      :items="users"
                      :filter="filterUser"
                      color="dark"
                      placeholder="Start typing to Search"
                      append-icon="mdi-magnify"
                      solo
                      @change="chooseUser"
                    >
                      <template v-slot:selection="data">
                        <v-chip
                          v-bind="data.attrs"
                          :input-value="data.selected"
                          close
                          @click="data.select"
                          @click:close="remove(data.item)"
                        >
                          <v-avatar left>
                            <v-img :src="data.item.photoURL"></v-img>
                          </v-avatar>
                          {{ data.item.displayName }}
                        </v-chip>
                      </template>
                      <template v-slot:item="data">
                        <template v-if="typeof data.item !== 'object'">
                          <v-list-item-content
                            v-text="data.item"
                          ></v-list-item-content>
                        </template>
                        <template v-else>
                          <v-list-item-avatar>
                            <img :src="data.item.photoURL" />
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="data.item.displayName"
                            ></v-list-item-title>
                            <v-list-item-subtitle
                              v-text="data.item.email"
                            ></v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </template>
                    </v-autocomplete>
                    <span class="input-group-addon">
                      <button type="button">
                        <i class="fa fa-search" aria-hidden="true"></i>
                      </button>
                    </span>
                  </v-col>
                </v-row>
              </div>
              <div class="inbox_chat">
                <v-row
                  v-for="group in groups"
                  :key="group.id"
                  class="chat_list px-0 mx-0"
                  @click="chooseGroup(group)"
                >
                  <v-col cols="3" class="px-6">
                    <v-avatar left>
                      <v-img
                        v-if="getGroupInfo(group).type === 0"
                        size="20"
                        :src="getGroupInfo(group).photoURL"
                      ></v-img>
                      <v-icon v-else color="primary" size="50"
                        >mdi-account-multiple</v-icon
                      >
                    </v-avatar>
                  </v-col>
                  <v-col cols="9">
                    <v-row no-gutters>
                      <v-col cols="12">{{ getGroupInfo(group).name }}</v-col>
                      <v-col cols="4" class="text-no-wrap">{{
                        group.recentMessage.messageText + '...'
                      }}</v-col>
                      <v-col cols="8" class="chat_date mt-1">
                        {{ group.modifiedAt.seconds | formatUnix }}
                      </v-col>
                    </v-row>
                    <!-- <p>Test firebase chat</p> -->
                  </v-col>
                </v-row>
              </div>
            </div>
            <div class="mesgs">
              <div v-if="loading" class="text-center">
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </div>
              <div class="msg_history">
                <div v-for="(msg, i) in messages" :key="i">
                  <div v-if="msg.sentBy === user.uid" class="outgoing_msg">
                    <div class="sent_msg">
                      <p>{{ msg.messageText }}</p>
                      <span class="time_date">
                        {{ msg.sentAt.seconds | formatUnix }}
                      </span>
                    </div>
                  </div>
                  <div v-else class="incoming_msg">
                    <div
                      v-if="currentGroup.users.length > 0"
                      class="incoming_msg_img"
                    >
                      <v-avatar left>
                        <v-img
                          :src="getUserGroupById(msg.sentBy).photoURL"
                        ></v-img>
                      </v-avatar>
                      <!-- <v-icon color="primary">mdi-account-circle</v-icon> -->
                    </div>
                    <div class="received_msg">
                      <div class="received_withd_msg">
                        <p>{{ msg.messageText }}</p>
                        <span class="time_date">
                          {{ msg.sentAt.seconds | formatUnix }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="type_msg">
                <v-row no-gutters>
                  <v-col cols="11">
                    <v-textarea
                      v-model="message"
                      solo
                      flat
                      depressed
                      no-resize
                      placeholder="Type a message"
                      height="80"
                      @keyup.enter="sendMessage"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="1">
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
                  </v-col>
                </v-row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import GroupDialog from '~/components/GroupDialog'
import group from '~/mixins/group'
import authentication from '~/mixins/authentication'
import user from '~/mixins/user'
import message from '~/mixins/message'

export default {
  components: { GroupDialog },
  mixins: [group, authentication, user, message],
  data() {
    return {
      username: null,
      message: null,
      user: null,
      users: [],
      groups: [],
      filtered: null,
      search: null,
      clientSearch: null,
      indexUser: null,
      currentGroup: null,
      dialog: false,
      loading: false,
    }
  },
  watch: {
    async user(val) {
      if (!val) return
      this.saveUserToLocalStorage(val)
      this.saveUserToStore(val)
      this.fetchUsers()
      const exist = await this.checkUserExisted(val)
      if (exist) {
        this.fetchGroupByUserID(val.uid)
        return
      }
      this.saveUser(val)
    },
  },
  created() {
    this.user = this.decryptUser()
  },
  methods: {
    async login() {
      this.user = await this.signInWithGoogleAuthentication()
    },
    async chooseUser(user) {
      let group = await this.filterGroup([this.user.uid, user.uid])
      if (group == null) {
        group = await this.createGroup(
          [this.user.uid, user.uid],
          this.user.uid,
          'Private',
          0
        )
      }
      this.chooseGroup(group)
      this.filtered = null
    },
    async chooseGroup(group) {
      this.messages = []
      this.loading = true
      this.currentGroup = group
      await this.fetchUsersByGroup(this.currentGroup).then(
        (response) => (this.currentGroup.users = response)
      )
      setTimeout(async () => {
        await this.fetchMessagesByGroupId(this.currentGroup.id)
        this.loading = false
      }, 200)
    },
    filterUser(item, queryText, itemText) {
      const textOne = item.displayName.toLowerCase()
      const textTwo = item.email.toLowerCase()
      const searchText = queryText.toLowerCase()
      return textOne.includes(searchText) || textTwo.includes(searchText)
    },
    async sendMessage() {
      const sentAt = new Date()
      const message = await this.saveMessage(
        this.message,
        sentAt,
        this.currentGroup.id
      )
      if (message) {
        this.message = null
        const group = {
          ...this.currentGroup,
          ...{
            users: null,
            modifiedAt: sentAt,
            recentMessage: { ...message, ...{ readBy: [] } },
          },
        }
        this.updateGroup(group)
      }
    },
    getUserGroupById(userId) {
      return this.currentGroup.users.filter((user) => user.uid === userId)[0]
    },
    getUserById(userId) {
      return this.users.filter((user) => user.uid === userId)[0]
    },
    getGroupInfo(group) {
      const result = {}
      if (group.type === 0) {
        const uid = group.members.filter(
          (member) => member !== this.user.uid
        )[0]
        const receiver = this.getUserById(uid)
        result.name = receiver.displayName
        result.photoURL = receiver.photoURL
      } else {
        result.name = group.name
      }
      result.type = group.type
      return result
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
  background: #ffffff none repeat scroll 0 0;
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
  width: 100%;
}
.headind_srch {
  overflow: hidden;
  border-bottom: 1px solid #c4c4c4;
  height: 140px;
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
  padding: 10px 0 0 15px;
  width: 88%;
}

.chat_people {
  overflow: hidden;
  clear: both;
}
.chat_list {
  border-bottom: 1px solid #c4c4c4;
  cursor: pointer;
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
  margin: 4px 0 0;
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
  /* border: medium none; */
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
.chat_date {
  color: rgba(0, 0, 0, 0.4);
  display: inline-block;
  font-size: 13px;
  font-weight: 400;
}
</style>
