import { useEffect, useState } from "react";
import PostPageSidebar from "@/components/sidebars/PostPageSideBar";
import { Button } from "@/components/ui/button";
import { BsCloudArrowUpFill } from "react-icons/bs";
import { useDropzone } from "react-dropzone";
import axiosInstance from "@/utilities/axiosInstance";
import TiktokMobileImage from "../assets/tiktokMobilePost.jpg";
import VideoPostIcons from "@/components/shared/VideoPostIcons";

interface PostDetails {
  _id: string;
  file: string;
}

const UploadPage = (): JSX.Element => {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [postDetails, setPostDetails] = useState<PostDetails | null>(null);
  const [description, setDescription] = useState<string>("");
  const [stage, setStage] = useState<"upload" | "description" | "result">(
    "upload"
  );

  const onDrop = async (acceptedFiles: File[]) => {
    const formData = new FormData();
    acceptedFiles.forEach((file) => formData.append("file", file));

    try {
      const { data } = await axiosInstance.post("/user/posts/video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPostDetails(data);
      setUploadStatus("uploaded");
      setStage("description");
    } catch (error) {
      setUploadStatus("Failed to upload video" + error);
    }
  };

  const handlePost = async () => {
    console.log("handlePost called");
    try {
      if (postDetails) {
        await axiosInstance.post(
          `/user/posts/description/${postDetails._id}`,
          { description }
        );
        console.log("Post request successful");
        setStage("result")
      } else {
        console.log("postDetails is null");
      }
    } catch (error) {
      console.error("Error in handlePost:", error);
      setUploadStatus("Failed to post: " + error);
    }
  };
  

  useEffect(() => {
    console.log("Stage updated:", stage);
  }, [stage]);

  const handleCancel = async () => {
    if (postDetails) {
      await axiosInstance.delete(`/user/posts/delete/${postDetails._id}`);
    }
    setUploadStatus(null);
    setStage("upload");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col lg:flex-row md:h-screen bg-gray-100">
      <div className="hidden lg:block fixed top-0 left-0 h-full">
        <PostPageSidebar />
      </div>

      <div className="flex flex-1 justify-center items-center lg:pl-[220px] p-4 lg:p-0">
        <div className="w-full max-w-4xl p-6 bg-white rounded-md shadow-lg">
          {stage === "upload" && (
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center h-64 lg:h-96 border-2 rounded-md ${
                isDragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-dashed border-gray-300 bg-gray-50"
              }`}
            >
              <input {...getInputProps()} />
              <BsCloudArrowUpFill size={55} className="text-gray-400" />
              <h1 className="mt-4 text-lg lg:text-xl font-bold text-gray-800">
                Select video to upload
              </h1>
              <p className="text-gray-600 text-sm text-center">
                {isDragActive
                  ? "Drop the files here ..."
                  : "Or drag and drop it here"}
              </p>
              <Button variant="pinks" className="mt-4">
                Select video
              </Button>
            </div>
          )}

          {stage === "description" && postDetails && (
            <div className="flex flex-col lg:flex-row w-full">
              <div className="flex-1 lg:pr-4 mb-4 lg:mb-0">
                <h2 className="text-lg lg:text-xl font-bold text-gray-800">
                  Add Description
                </h2>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a description for your video..."
                  className="w-full p-2 mt-4 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2b56]"
                  rows={5}
                ></textarea>
                <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                  <Button variant="pinks" onClick={handlePost}>
                    Post
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              <div className="relative flex-shrink-0 w-full lg:w-[260px] aspect-[9/16] mx-auto lg:mx-0">
                <img
                  src={TiktokMobileImage}
                  alt="Mobile Frame"
                  className="absolute top-0 left-0 w-full h-full object-contain"
                />
                <video
                  src={postDetails.file}
                  controls
                  className="absolute top-[15%] left-[10%] w-[80%] h-[70%] object-cover rounded-md"
                />
                <div className="absolute z-10 right-8 top-32">
                <VideoPostIcons/>
                </div>
              </div>
            </div>
          )}

          {stage === "result" && postDetails && (
            <div className="flex flex-col items-center">
              <h2 className="text-lg lg:text-xl font-bold text-gray-800">
                Post Uploaded
              </h2>
              <p className="text-gray-600 mt-4 text-center">
                Your video has been posted successfully!
              </p>
              <div className="mt-4">
                <video
                  src={postDetails.file}
                  controls
                  className="w-full lg:w-[320px] h-auto object-cover"
                />
                <p className="mt-4 text-center">{description}</p>
              </div>
              <Button variant="pinks" onClick={handleCancel} className="mt-4">
                Cancel
              </Button>
            </div>
          )}

          {uploadStatus && uploadStatus !== "uploaded" && (
            <div className="mt-4 text-center text-sm font-semibold text-red-600">
              {uploadStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
