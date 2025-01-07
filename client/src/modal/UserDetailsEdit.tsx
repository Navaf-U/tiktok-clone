import { Button } from "@/components/ui/button";
import { UserContext } from "@/context/UserProvider";
import { useContext, useState } from "react";
import { IoIosClose } from "react-icons/io";
import axiosInstance from "../utilities/axiosInstance";

function UserDetailsEdit(): JSX.Element {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is not available");
  }
  const { setShowUserEdit, currUser, setCurrUser } = userContext || {};
  const [bio, setBio] = useState(currUser?.bio || "");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const maxLength = 80;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      setBio(e.target.value);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    if (bio !== currUser?.bio) {
      formData.append("bio", bio);
    }
    if (profilePhoto) {
      formData.append("file", profilePhoto);
    }
    try {
      const { data } = await axiosInstance.patch(
        "/user/profile/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCurrUser(data);
      localStorage.setItem("currUser", JSON.stringify(data));
      setShowUserEdit(false);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#191919] rounded-md flex flex-col left-[25%] right-[25%] w-[50%] z-50">
      <div className="flex justify-between items-center mt-5 mb-3 mx-9">
        <h1 className="font-medium text-[#e8e8e8] text-[22px]">Edit profile</h1>
        <IoIosClose
          onClick={() => setShowUserEdit(false)}
          className="cursor-pointer"
          size={40}
        />
      </div>
      <hr className="w-full opacity-45" />
      <div className="flex justify-between py-5 items-start mt-5 mb-3 mx-10">
        <h1 className="font-medium text-[#e8e8e8] text-[20px]">
          Profile photo
        </h1>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <hr className="opacity-45 ms-5 w-[95%]" />
      <div className="flex justify-between gap-4 py-3 items-start mt-5 mb-3 mx-10">
        <h1 className="font-medium text-[#e8e8e8] text-[20px]">Username</h1>
        <div>
          <h1 className="text-center font-medium text-[#e8e8e8] text-[17px]">
            {currUser?.username}
          </h1>
          <p className="text-center text-[10px] text-[#ffffffbc]">
            www.tiktokClone.com/@{currUser?.username}
            <br />
            Your username can be changed once every 30 days. You can change it
            again after Jan 27, 2025.
          </p>
        </div>
      </div>
      <hr className="opacity-45 ms-5 w-[95%] py-3" />
      <div className="flex justify-between items-start mt-5 mb-3 mx-10">
        <h1 className="font-medium text-[#e8e8e8] text-[20px]">Bio</h1>
        <div className="flex flex-col">
          <textarea
            name="bio"
            id="bio"
            value={bio}
            placeholder="bio"
            onChange={handleChange}
            className="bg-[#2e2e2e] w-[360px] h-[100px] rounded-md p-2"
          ></textarea>
          <div className="text-sm text-gray-400 mt-2">
            {bio.length}/{maxLength} characters
          </div>
        </div>
      </div>
      <hr className="opacity-25 mt-2 w-[100%]" />
      <div className="flex gap-4 justify-end me-10">
        <Button
          variant={"grays"}
          className="w-24 mt-8 h-9 rounded-sm"
          onClick={() => setShowUserEdit(false)}
        >
          Cancel
        </Button>
        <Button
          variant={"pinks"}
          className="w-24 mt-8 h-9 rounded-sm"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default UserDetailsEdit;
