import axiosInstance from "@/utilities/axiosInstance";

type UserUpdater = (user: null) => void;

const userManager = (() => {
  let setCurrUser: UserUpdater | null = null;

  const setUserUpdater = (updater: UserUpdater) => {
    setCurrUser = updater;
  };

  const clearUser = async () => {
    if (setCurrUser) {
      setCurrUser(null);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("currUser");
    await axiosInstance.post("/auth/logout");
  };

  return {
    setUserUpdater,
    clearUser,
  };
})();

export default userManager;
