import { useState } from "react";
import PostPageSidebar from "@/components/sidebars/PostPageSidebar";
import { Button } from "@/components/ui/button";
import { BsCloudArrowUpFill } from "react-icons/bs";
import { useDropzone } from "react-dropzone";
import axiosInstance from "@/utilities/axiosInstance";

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
    console.log("Accepted Files:", acceptedFiles);

    const formData = new FormData();
    acceptedFiles.forEach((file) => formData.append("file", file));

    try {
      const {data} = await axiosInstance.post("/user/posts/video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(data)
      setPostDetails(data);
      setUploadStatus("uploaded");
      setStage("description");
    } catch (error) {
      console.error("Error uploading video:", error);
      setUploadStatus("Failed to upload video");
    }
  };

  const handlePost = async () => {
    try {
      if (postDetails) {
        console.log("Posting description for video:", postDetails._id);
        const response = await axiosInstance.post(
          `/user/posts/description/${postDetails._id}`,
          {
            description,
          }
        );
        console.log("Post success:", response.data);
        setStage("result");
      }
    } catch (error) {
      console.error("Error posting:", error);
      setUploadStatus("Failed to post");
    }
  };

  const handleCancel = async () => {
    if (postDetails) {
      await axiosInstance.delete(`/user/posts/delete/${postDetails._id}`);
    }
    setUploadStatus(null);
    setStage("upload");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  console.log(postDetails?.file)
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="fixed top-0 left-0 h-full">
        <PostPageSidebar />
      </div>

      <div className="flex flex-1 justify-center items-center pl-[220px]">
        <div className="w-full max-w-4xl p-6 bg-white rounded-md shadow-lg">
          {stage === "upload" && (
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center h-96 border-2 rounded-md ${
                isDragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-dashed border-gray-300 bg-gray-50"
              }`}
            >
              <input {...getInputProps()} />
              <BsCloudArrowUpFill size={55} className="text-gray-400" />
              <h1 className="mt-4 text-xl font-bold text-gray-800">
                Select video to upload
              </h1>
              <p className="text-gray-600 text-sm">
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
            <div  className="flex flex-col items-center">
                  {postDetails.file && (
                      <div>
                      <video src={postDetails?.file} controls width="320" height="240" />
                    </div>
                  )}
              <h2 className="text-xl font-bold text-gray-800">
                Add Description
              </h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a description for your video..."
                className="w-full mt-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2b56]"
                rows={4}
              ></textarea>
              <div className="mt-4 flex space-x-4">
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
          )}

          {stage === "result" && postDetails && (
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold text-gray-800">Post Uploaded</h2>
              <p className="text-gray-600 mt-4">
                Your video has been posted successfully!
              </p>
              <div className="mt-4">
                <video
                  src={postDetails.file}
                  controls
                  width="320"
                  height="240"
                />
                <p className="mt-4">{description}</p>
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
