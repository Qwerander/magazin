import { jwtDecode } from "jwt-decode";

export const loadAuthState = () => {
  try {
    const serializedState = localStorage.getItem("authState");
    if (!serializedState) return undefined;

    const state = JSON.parse(serializedState);

    if (state.auth?.token) {
      const decoded = jwtDecode(state.auth.token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("authState");
        return undefined;
      }
    }

    return state;
  } catch (err) {
    return undefined;
  }
};

export const saveAuthState = (state) => {
  try {
    const serializedState = JSON.stringify({
      auth: {
        user: state.auth.user,
        token: state.auth.token,
        isAdmin: state.auth.isAdmin
      }
    });
    localStorage.setItem("authState", serializedState);
  } catch (err) {
    console.error("Error saving auth state:", err);
  }
};

export const clearAuthState = () => {
  try {
    localStorage.removeItem("authState");
  } catch (err) {
    console.error("Error clearing auth state:", err);
  }
};
