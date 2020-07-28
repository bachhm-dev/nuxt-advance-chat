export const state = () => ({
  user: undefined,
})

export const mutations = {
  add(state, { uid, displayName, photoURL, email }) {
    state.user = {
      uid,
      displayName,
      photoURL,
      email,
    }
  },
  remove(state, { todo }) {
    state.user = undefined
  },
  toggle(state, todo) {
    todo.done = !todo.done
  },
}
