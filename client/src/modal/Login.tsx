/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserContext } from "@/context/UserProvider";
import { useContext } from "react";
import { IoIosClose } from "react-icons/io";

function Login(): JSX.Element {
  const userContext = useContext(UserContext);
  const { setShowModal, setModalType , LoginUser } = userContext || {};

  const handleClose = (event: React.MouseEvent<SVGElement>) => {
    if (setShowModal) setShowModal(false);
  };

  const handleSwitchToSignup = () => {
    if (setModalType && setShowModal) {
      setModalType("signup");
      setShowModal(true);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const emailOrUsername = formData.get("emailOrUsername") as string;
    const password = formData.get("password") as string;
    if (LoginUser) {
      LoginUser(emailOrUsername, password);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#121212] relative p-8 rounded shadow-lg h-[580px] w-[460px]">
        <IoIosClose
          onClick={handleClose}
          size={40}
          className="text-white bg-[#1c1c1c] rounded-full absolute top-3 right-3"
        />
        <h1 className="mt-10 text-[30px] font-bold mb-4 text-center text-[#e8e8e8]">
          Log in to TikTok
        </h1>
        <label htmlFor="" className="ms-5 font-bold text-[#e8e8e8]">
          Email or username
        </label>
        <form className="mt-1 flex flex-col items-center" onSubmit={handleSubmit}>
          <input
            type="text"
            name="emailOrUsername"
            placeholder="Email or Username"
            className="bg-[#2e2e2e] text-[#e8e8e8] rounded w-[90%] p-3 mb-3"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="bg-[#2e2e2e] text-[#e8e8e8] rounded w-[90%]  p-3 mb-1"
          />
          <div className="flex justify-between w-[90%]">
            <h1 className="text-[#e8e8e8] mb-4 text-[13px]">
              Forgot password?
            </h1>
          </div>
          <button
            type="submit"
            className="bg-[#262626] font-extrabold text-[#7c7c7c] p-3 rounded w-[90%] mb-4"
          >
            Log in
          </button>
        </form>
        <div className="bg-[#2e2e2e] flex justify-center items-center font-bold position ms-[-30px] text-[#e8e8e8] absolute bottom-3 h-16 w-[455px]">
          Don’t have an account?
          <button
            onClick={handleSwitchToSignup}
            className="font-bold text-[#ff2b56] ms-2"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
