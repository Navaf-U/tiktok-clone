import { Button } from "@/components/ui/button";
import { UserContext } from "@/context/UserProvider";
import axiosErrorManager from "@/utilities/axiosErrorManager.ts";
import axiosInstance from "@/utilities/axiosInstance.ts";
import { useContext, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function DeleteUserAccount(): JSX.Element {
  const [error, setError] = useState<string | null>(null);
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const { setShowAccountDelete, setCurrUser } = userContext || {};
  const delteUserAccount = async () => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete your account?"
      );
      if (confirm) {
        await axiosInstance.delete("/user/delete/account");
        localStorage.removeItem("token");
        localStorage.removeItem("currUser");
        if (setCurrUser) {
          setCurrUser(null);
        }
        if (setShowAccountDelete) {
          setShowAccountDelete(false);
        }
        navigate("/");
      }
    } catch (error) {
      setError(axiosErrorManager(error));
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative bg-[#191919] flex justify-center items-center rounded-md h-[50%] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <IoClose
          className="absolute top-2 right-2 text-white text-2xl cursor-pointer"
          size={40}
          onClick={() => setShowAccountDelete && setShowAccountDelete(false)}
        />
        <div className="  p-4 sticky top-0 bg-[#191919]">
          <Button variant={"pinks"} onClick={delteUserAccount} className="w-72">
            DELETE YOUR ACCOUNT
          </Button>
          {error && <p className="text-red-600 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default DeleteUserAccount;
