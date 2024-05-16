import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authEmail: "",
    authPassword: "",
    user: types.optional(types.frozen(), {}),
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
    },
    get validationErrors() {
      return {
        authEmail: (function () {
          if (store.authEmail.length === 0) return "The email field is required."
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail))
            return "Must be a valid email address"
          return ""
        })(),
        authPassword: (function () {
          if (store.authPassword.length < 6) return "The password must be at least 6 characters.";
          return ""
        })(),
      }
    },
  }))
  .actions((store) => ({
    setUser(user: object) {
      store.user = user
    },
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /g, "")
    },
    setAuthPassword(value: string) {
      store.authPassword = value;
    },
    logout() {
      store.authToken = undefined
      store.authEmail = ""
      store.user={}
    },
    getUser(user: object) {
      return store.user
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> { }
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> { }

// @demo remove-file
