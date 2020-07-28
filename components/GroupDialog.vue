<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="mx-2"
        fab
        dark
        small
        depressed
        color="#f5f5f5"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon color="#000000">mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Create group</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="name"
                label="Group name*"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="pickedUsers"
                :items="users"
                :filter="filterUser"
                color="dark"
                placeholder="Start typing to Search"
                append-icon="mdi-magnify"
                multiple
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
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" text @click="submit">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import group from '~/mixins/group'
export default {
  mixins: [group],
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      name: undefined,
      dialog: false,
      pickedUsers: undefined,
    }
  },
  computed: {
    ...mapGetters('user', {
      user: 'getUser',
    }),
  },
  methods: {
    filterUser(item, queryText, itemText) {
      const textOne = item.displayName.toLowerCase()
      const textTwo = item.email.toLowerCase()
      const searchText = queryText.toLowerCase()
      return textOne.includes(searchText) || textTwo.includes(searchText)
    },
    async submit() {
      const chosenUsers = [...this.pickedUsers]
      chosenUsers.push(this.user)
      const userArray = chosenUsers.map((user) => user.uid)
      const group = await this.createGroup(
        userArray,
        this.user.uid,
        this.name,
        1
      )
      if (group) {
        chosenUsers.forEach((user) => {
          this.addNewGroupToUser(user, group.id)
        })
      }
      this.$emit('created', group)
      this.dialog = false
    },
    remove(user) {
      this.pickedUsers = this.pickedUsers.filter(
        (pickedUser) => pickedUser.uid !== user.uid
      )
    },
  },
}
</script>
