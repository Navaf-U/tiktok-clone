type UserUpdater = (user: null) => void;

const userManager = (() => {
  let setCurrUser: UserUpdater | null = null;

  const setUserUpdater = (updater: UserUpdater) => {
    setCurrUser = updater;
  };

  const clearUser = () => {
    if (setCurrUser) {
      setCurrUser(null);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("currUser");
  };

  return {
    setUserUpdater,
    clearUser,
  };
})();

export default userManager;
