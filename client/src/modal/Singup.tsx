import { UserContext } from "@/context/UserProvider";
import { useContext } from "react";
import { IoIosClose } from "react-icons/io";
import { useFormik } from "formik";
import * as Yup from "yup";

function Signup(): JSX.Element {
  const optionsMonth: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const optionsDay: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  const optionsYear: number[] = Array.from({ length: 100 }, (_, i) => i + 1950);
  const userContext = useContext(UserContext);
  const { setShowModal, setModalType, UserRegister } = userContext || {};

  const handleClose = () => {
    if (setShowModal) setShowModal(false);
  };

  const handleSwitchToLogin = () => {
    if (setModalType && setShowModal) {
      setModalType("login");
      setShowModal(true);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      birthMonth: "",
      birthDay: "",
      birthYear: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      birthMonth: Yup.string().required("Birth month is required"),
      birthDay: Yup.number().required("Birth day is required"),
      birthYear: Yup.number().required("Birth year is required"),
    }),
    onSubmit: (values) => {
      const { username, email, password, birthMonth, birthDay, birthYear } =
        values;
      const dob: { month: string; day: string; year: string } = {
        month: birthMonth,
        day: birthDay,
        year: birthYear,
      };
      if (UserRegister) {
        UserRegister(username, email, password, dob);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#121212] relative p-8 pt-4 rounded shadow-lg max-h-[100vh] w-[460px] flex flex-col  overflow-hidden">
        <IoIosClose
          onClick={handleClose}
          size={40}
          className="cursor-pointer text-white bg-[#1c1c1c] rounded-full absolute top-3 right-3"
        />
        <h1 className="mt-10 text-[30px] font-bold mb-4 text-center text-[#e8e8e8]">
          Sign up
        </h1>
        <h3 className="ms-5 text-white mb-2">When’s your birthday?</h3>

        <div className="flex gap-2 ms-5 w-[100%]">
          <select
            className="bg-[#2e2e2e] text-[#e8e8e8] rounded w-[30%] p-2 mb-3"
            name="birthMonth"
            value={formik.values.birthMonth}
            onChange={formik.handleChange}
          >
            <option value="">Month</option>
            {optionsMonth.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            className="bg-[#2e2e2e] text-[#e8e8e8] rounded w-[30%] p-2 mb-3"
            name="birthDay"
            value={formik.values.birthDay}
            onChange={formik.handleChange}
          >
            <option value="">Day</option>
            {optionsDay.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            className="bg-[#2e2e2e] text-[#e8e8e8] rounded w-[30%] p-2 mb-3"
            name="birthYear"
            value={formik.values.birthYear}
            onChange={formik.handleChange}
          >
            <option value="">Year</option>
            {optionsYear.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex w-[100%]">
        {formik.touched.birthMonth && formik.errors.birthMonth && (
          <div className="text-red-500 text-sm p-0 text-start w-full mt-[-10px] ms-10">
            {formik.errors.birthMonth}
          </div>
        )}
        {formik.touched.birthDay && formik.errors.birthDay && (
          <div className="text-red-500 text-sm p-0 text-start w-full mt-[-10px] ms-10">
            {formik.errors.birthDay}
          </div>
        )}
        {formik.touched.birthYear && formik.errors.birthYear && (
          <div className="text-red-500 text-sm p-0 text-start w-full mt-[-10px] ms-10">
            {formik.errors.birthYear}
          </div>
        )}
        </div>
        <h4 className="ms-5 text-gray-500 mb-2">
          Your birthday won't be shown publicly.
        </h4>
        <div className="overflow-y-scroll overflow-x-hidden mb-5">
          <form
            className="mt-1 flex flex-col items-center"
            onSubmit={formik.handleSubmit}
          >
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="bg-[#2e2e2e] text-[#e8e8e8] rounded w-[90%] p-3 mb-3"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.username && formik.errors.username && (
              <div className="text-red-500 text-sm p-0 text-start w-full mt-[-10px] ms-10">
                {formik.errors.username}
              </div>
            )}

            <input
              type="text"
              name="email"
              placeholder="Email Address"
              className="bg-[#2e2e2e] text-[#e8e8e8] rounded w-[90%] p-3 mb-3"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm p-0 text-start w-full mt-[-10px] ms-10">
                {formik.errors.email}
              </div>
            )}

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="bg-[#2e2e2e] text-[#e8e8e8] rounded w-[90%] p-3 mb-1"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm p-0 text-start w-full mt-[-10px] ms-10">
                {formik.errors.password}
              </div>
            )}

            <div className="flex items-center gap-2 mt-2 text-[#5c5c5c] text-[13px]">
              <input
                type="checkbox"
                id="checkbox"
                className="ms-4 ps- transform scale-150"
                required
              />

              <p className="ms-2">
                Get trending content, newsletters, promotions, recommendations,
                and account updates sent to your email
              </p>
            </div>

            <button
              type="submit"
              className="mt-5  bg-[#262626] hover:bg-[#222121] hover:text-[#c9c9c9] font-extrabold text-[#7c7c7c] p-3 rounded w-[90%] mb-4"
            >
              Sign up
            </button>
          </form>
        </div>

        <div className="flex flex-col">
          <div className="text-center py-1 bg-[#2e2e2e] w-[458px] ms-[-30px] text-[#e8e8e8] font-thin text-[13px] py-">
            By continuing, you agree to TikTok’s Terms of Service and confirm
            that you have read TikTok’s Privacy Policy.
          </div>
          <div className="text-center border border-x-0 border-b-0  border-t-gray-500  bg-[#2e2e2e] text-[#e8e8e8] w-[458px] ms-[-30px] font-semibold py-4">
            Already have an account?
            <button
              onClick={handleSwitchToLogin}
              className="font-bold text-[#ff2b56] ms-2"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
