import { Button } from "@/components/ui/button";
import { UserContext } from "@/context/UserProvider";
import { useContext, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { FaRegTrashCan } from "react-icons/fa6";
import axiosInstance from "../utilities/axiosInstance.ts";
import axiosErrorManager from "@/utilities/axiosErrorManager.ts";

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
      console.error(axiosErrorManager(error));
    }
  };

  const deletProfile = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your profile?"
    );
    if (!confirm) return;
    try {
      const { data } = await axiosInstance.delete("/user/profile/delete");
      setCurrUser(data);
      localStorage.setItem("currUser", JSON.stringify(data));
    } catch (error) {
      console.error(axiosErrorManager(error));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-[#191919] rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 sticky top-0 bg-[#191919]">
          <h1 className="font-medium text-[#e8e8e8] text-lg sm:text-[22px]">Edit profile</h1>
          <IoIosClose
            onClick={() => setShowUserEdit(false)}
            className="cursor-pointer"
            size={32}
          />
        </div>
        <hr className="opacity-45" />
        
        <div className="p-4 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h2 className="font-medium text-[#e8e8e8] text-lg whitespace-nowrap">
              Profile photo
            </h2>
            <div className="flex flex-col md:flex-row items-center md:justify-end -end md:w-full gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-gray-300"
              />
              {currUser?.profile && (
                <div className="relative w-20 h-20">
                  <img
                    src={currUser.profile}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <FaRegTrashCan
                    className="absolute top-0 right-0 text-white bg-black bg-opacity-50 rounded-full p-1 cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-200"
                    size={20}
                    onClick={deletProfile}
                  />
                </div>
              )}
            </div>
          </div>

          <hr className="opacity-45" />

          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <h2 className="font-medium text-[#e8e8e8] text-lg whitespace-nowrap">
              Username
            </h2>
            <div className="flex-1">
              <h3 className="font-medium text-[#e8e8e8] text-base">
                {currUser?.username}
              </h3>
              <p className="text-xs text-[#ffffffbc] mt-1">
                www.tiktokClone.com/@{currUser?.username}
                <br />
                Your username can be changed once every 30 days. You can change it again after Jan 27, 2025.
              </p>
            </div>
          </div>

          <hr className="opacity-45" />

          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <h2 className="font-medium text-[#e8e8e8] text-lg whitespace-nowrap">
              Bio
            </h2>
            <div className="flex-1">
              <textarea
                name="bio"
                id="bio"
                value={bio}
                placeholder="bio"
                onChange={handleChange}
                className="bg-[#2e2e2e] w-full min-h-[100px] rounded-md p-2 text-[#e8e8e8]"
              />
              <div className="text-sm text-gray-400 mt-2">
                {bio.length}/{maxLength} characters
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-[#191919] p-4 flex justify-end gap-4">
          <Button
            variant="grays"
            className="w-24 h-9 rounded-sm"
            onClick={() => setShowUserEdit(false)}
          >
            Cancel
          </Button>
          <Button
            variant="pinks"
            className="w-24 h-9 rounded-sm"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsEdit;