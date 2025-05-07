export const loadAuthState = () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) return undefined;

      return {
        auth: {
          token,
          user: {
            username: localStorage.getItem('username') || 'User',
            email: localStorage.getItem('email') || ''
          }
        }
      };
    } catch (err) {
      return undefined;
    }
  };

  export const saveAuthState = (state) => {
    try {
      if (state.auth.token && state.auth.user) {
        localStorage.setItem('token', state.auth.token);
        localStorage.setItem('userId', state.auth.user._id || '');
        localStorage.setItem('username', state.auth.user.username || '');
        localStorage.setItem('email', state.auth.user.email || '');
      }
    } catch (err) {
      console.error('Error saving auth state:', err);
    }
  };