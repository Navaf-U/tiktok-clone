import { UserContext } from "@/context/UserProvider";
import { useContext, useState } from "react";
import { IoIosClose } from "react-icons/io";

function Login(): JSX.Element {
  const userContext = useContext(UserContext);
  const { setShowModal, setModalType, LoginUser } = userContext || {};

  interface FormState {
    emailOrUsername: string;
    password: string;
  }

  const [formState, setFormState] = useState<FormState>({
    emailOrUsername: "",
    password: "",
  });

  const handleClose = () => {
    if (setShowModal) setShowModal(false);
  };

  const handleSwitchToSignup: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    if (setModalType && setShowModal) {
      setModalType("signup");
      setShowModal(true);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { emailOrUsername, password } = formState;
    if (LoginUser) {
      LoginUser(emailOrUsername, password);
    }
  };

  // Check if both inputs contain at least one letter
  const hasLetters = (text: string) => /[a-zA-Z]/.test(text);
  const isButtonActive =
    hasLetters(formState.emailOrUsername) && hasLetters(formState.password);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#121212] cursor-pointer relative p-8 rounded shadow-lg h-[580px] w-[460px]">
        <IoIosClose
          onClick={handleClose}
          size={40}
          className="text-white bg-[#1c1c1c] rounded-full absolute top-3 right-3"
        />
        <h1 className="mt-10 text-[30px] font-bold mb-4 text-center text-[#e8e8e8]">
          Log in
        </h1>
        <label
          htmlFor="emailOrUsername"
          className="ms-5 font-bold text-[#e8e8e8]"
        >
          Email or username
        </label>
        <form
          className="mt-1 flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="emailOrUsername"
            placeholder="Email or Username"
            value={formState.emailOrUsername}
            onChange={handleInputChange}
            className="bg-[#2e2e2e] text-[#e8e8e8] rounded w-[90%] p-3 mb-3"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formState.password}
            onChange={handleInputChange}
            className="bg-[#2e2e2e] text-[#e8e8e8] rounded w-[90%] p-3 mb-1"
          />
          <div className="flex justify-between w-[90%]">
            <h1 className="text-[#e8e8e8] mb-4 text-[13px]">
              Forgot password?
            </h1>
          </div>
          <button
            type="submit"
            className={`p-3 rounded w-[90%] mb-4 font-semibold ${
              isButtonActive
                ? "bg-[#ff3b5b] text-white"
                : "bg-[#262626] text-[#7c7c7c] hover:bg-[#222121] hover:text-[#c9c9c9]"
            }`}
            disabled={!isButtonActive}
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
