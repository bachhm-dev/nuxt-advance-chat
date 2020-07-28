export const state = () => ({
  group: undefined,
})

export const mutations = {
  add(state, payload) {
    state.group = payload
  },
  remove(state, { todo }) {
    state.group = undefined
  },
}

export const getters = {
  getUser: (state) => state.group,
}
