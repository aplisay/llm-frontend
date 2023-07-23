let state = {
  userDetails: null,
  status: "loading",
};

export function getUser() {
  if (state.userDetails) {
    return Promise.resolve(state.userDetails);
  } else {
    const error = new Error("User not found");
    error.status = 404;
    return Promise.reject(error);
  }
}

export function useUser() {
  return { user: state.userDetails, status: state.status };
}

export function useLogin() {
  return [() => {}, {}];
}

export function _setMockState(newState) {
  Object.assign(state, newState);
}
