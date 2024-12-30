import { UserContext } from "@/context/UserProvider";
import { useContext } from "react";

function Login(): JSX.Element {
  const userContext = useContext(UserContext);
  const setShowLogin = userContext ? userContext.setShowLogin : () => {};

  const handleClose = () => {
    setShowLogin(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#121212] p-8 rounded shadow-lg h-[580px] w-[460px]">
        <h1 className="mt-10 text-[30px] font-bold mb-4 text-center text-[#e8e8e8]">
          Log in to TikTok
        </h1>
        <label htmlFor="" className="ms-5 font-bold text-[#e8e8e8]">
          Email or username
        </label>
        <form className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Email or Username"
            className=" bg-[#2e2e2e] rounded w-[90%] p-3 mb-3"
          />
          <input
            type="password"
            placeholder="Password"
            className=" bg-[#2e2e2e] rounded w-[90%]  p-3 mb-1"
          />
          <div className="flex justify-between w-[90%]">
          <h1 className="text-[#e8e8e8] mb-4 text-[13px]">Forgot password?</h1>
          </div>
          <button
            type="submit"
            className="bg-[#262626] text-white p-3 rounded w-[90%] mb-4"
          >
            Login
          </button>
        </form>
        <button
          onClick={handleClose}
          className="text-red-500 underline text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Login;
