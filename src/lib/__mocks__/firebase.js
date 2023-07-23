let state = {
  loaded: false,
  user: null,
};

const firebase = {
  auth() {
    return {
      onAuthStateChanged(cb) {
        if (state.loaded) {
          cb(state.user);
        }
      },
      currentUser: {
        getIdToken() {
          return Promise.resolve(state.user.token);
        },
        reauthenticateWithPopup() {
          return Promise.resolve({ credential: { accessToken: "4567" } });
        },
      },
    };
  },
  _setMockState(newState) {
    Object.assign(state, newState);
  },
};

export default firebase;
