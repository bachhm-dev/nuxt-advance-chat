export const state = () => ({
  user: undefined,
})

export const mutations = {
  add(state, { uid, displayName, photoURL, email, groups }) {
    state.user = {
      uid,
      displayName,
      photoURL,
      email,
      groups,
    }
  },
  remove(state, payload) {
    state.user = undefined
  },
}

export const getters = {
  getUser: (state) => state.user,
}
