import firebase from '~/plugins/firebase.js'
const db = firebase.firestore()
export default {
  data() {
    return {
      groups: [],
      currentGroup: undefined,
    }
  },
  methods: {
    createGroup(userArray, createdBy, name, type) {
      const vm = this
      const group = {
        createdAt: new Date(),
        createdBy,
        members: userArray,
        name,
        type,
      }
      return new Promise((resolve, reject) => {
        db.collection('group')
          .add(group)
          .then(function (docRef) {
            group.id = docRef.id
            vm.fetchGroupByUserID(vm.user.uid)
            resolve(group)
          })
          .catch(function (error) {
            reject(error)
          })
      })
    },
    filterGroup(userArray) {
      const vm = this
      vm.groups = []
      return new Promise((resolve, reject) => {
        let groupRef = db.collection('group')
        userArray.forEach((userId) => {
          groupRef = groupRef.where('members', '==', userId)
        })
        groupRef
          .get()
          .then(function (querySnapshot) {
            const allGroups = []
            querySnapshot.forEach((doc) => {
              const data = doc.data()
              data.id = doc.id
              allGroups.push(data)
            })
            if (allGroups.length > 0) {
              resolve(allGroups[0])
            } else {
              resolve(null)
            }
          })
          .catch(function (error) {
            reject(error)
          })
      })
    },
    fetchGroupByUserID(uid) {
      const vm = this
      return new Promise((resolve, reject) => {
        const groupRef = db.collection('group')
        groupRef
          .where('members', 'array-contains', uid)
          .onSnapshot((querySnapshot) => {
            const allGroups = []
            querySnapshot.forEach((doc) => {
              const data = doc.data()
              data.id = doc.id
              if (data.recentMessage) allGroups.push(data)
            })
            vm.groups = allGroups
          })
      })
    },
    fetchGroupByIds(groupIds) {
      const groups = []
      const groupRef = db.collection('group')
      groupIds.forEach(async (groupId) => {
        await groupRef
          .doc(groupId)
          .get()
          .then(function (doc) {
            groups.push(doc.data())
          })
          .catch(function (error) {
            // eslint-disable-next-line no-console
            console.error('Error get document: ', error)
          })
      })
      this.groups = groups
    },
    updateGroup(group) {
      db.collection('group')
        .doc(group.id)
        .set(group)
        .then(function (docRef) {})
        .catch(function (error) {
          // eslint-disable-next-line no-console
          console.error('Error writing document: ', error)
        })
    },
    addNewGroupToUser(user, groupId) {
      const groups = user.groups ? user.groups : []
      const existed = groups.filter((group) => group === groupId)
      if (existed.length === 0) {
        groups.push(groupId)
        user.groups = groups
        const userRef = db.collection('user')
        userRef.doc(user.uid).set(user)
      }
    },
  },
}
