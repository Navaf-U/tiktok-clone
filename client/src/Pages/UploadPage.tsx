import { useState } from "react";
import PostPageSidebar from "@/components/sidebars/PostPageSideBar";
import { Button } from "@/components/ui/button";
import { BsCloudArrowUpFill } from "react-icons/bs";
import { useDropzone } from "react-dropzone";
import { useSpring, animated } from "@react-spring/web";
import axiosInstance from "@/utilities/axiosInstance";
import TiktokMobileImage from "../assets/tiktokMobilePost.jpg";
import VideoPostIcons from "@/components/shared/VideoPostIcons";
import axiosErrorManager from "@/utilities/axiosErrorManager";
import { FaCheckCircle } from "react-icons/fa";
interface PostDetails {
  _id: string;
  file: string;
  fileSize: number;
  fileDuration: number;
  message: string;
}

const UploadPage = (): JSX.Element => {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [postDetails, setPostDetails] = useState<PostDetails | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [stage, setStage] = useState<"upload" | "description" | "result">(
    "upload"
  );
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [showUploadedMessage, setShowUploadedMessage] = useState(false);
  const maxLength = 4000;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const formData = new FormData();
      acceptedFiles.forEach((file) => formData.append("file", file));
      setFilename(acceptedFiles[0].name);
      setProgress(0);
      setShowUploadedMessage(false);
      try {
        setLoading(true);
        const uploadRequest = axiosInstance.post(
          "/user/posts/video",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (event) => {
              const percentCompleted = Math.round(
                event.total ? (event.loaded * 100) / event.total : 0
              );
              setProgress(percentCompleted);
            },
          }
        );

        const { data } = await uploadRequest;

        setPostDetails(data);
        setUploadStatus("uploaded");
        setStage("description");

        setShowUploadedMessage(true);
      } catch (error) {
        setUploadStatus("Failed to upload video: " + axiosErrorManager(error));
      } finally {
        setLoading(false);
      }
    },
  });
  const handlePost = async () => {
    setLoading(true);
    try {
      if (postDetails) {
        await axiosInstance.post(`/user/posts/description/${postDetails._id}`, {
          description,
        });
        setStage("result");
      } else {
        console.log("postDetails is null");
      }
    } catch (error) {
      setUploadStatus("Failed to post: " + axiosErrorManager(error));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      setDescription(e.target.value);
    }
  };

  const handleCancel = async () => {
    if (postDetails) {
      await axiosInstance.delete(`/user/posts/delete/${postDetails._id}`);
    }
    setUploadStatus(null);
    setStage("upload");
  };

  const progressAnimation = useSpring({
    width: `${progress}%`,
    config: { duration: 10000 },
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <div className="hidden lg:block fixed top-0 left-0 w-[220px] bg-white">
        <PostPageSidebar />
      </div>

      <div className="flex flex-1 justify-center items-center mt-16 lg:pl-[220px] p-4 lg:p-0">
        <div className="w-full max-w-4xl p-6 bg-white rounded-md shadow-lg">
          {stage === "description" && (
            <div>
              <h1 className="text-[23px] font-semibold text-black">
                {filename}
              </h1>
              <div className="flex gap-5 text-black">
                <h3 className="font-bold">
                  <span className="font-normal text-[14px]">Size :</span>{" "}
                  {postDetails?.fileSize.toFixed(2)}MB
                </h3>
                <h1 className="font-bold">
                  <span className="font-normal text-[14px]">Duration :</span>
                  {postDetails?.fileDuration.toFixed(2)}s
                </h1>
              </div>
              {showUploadedMessage && (
                <div className="mt-2 flex gap-2 font-semibold text-sm">
                  <FaCheckCircle className="text-[#00c29b] mt-1" />
                  <div className="flex w-full justify-between">
                    <p className="text-[#00c29b]">Uploaded</p>
                    <p className="text-black text-[25px]">100%</p>
                  </div>
                </div>
              )}
              <div className="relative w-full h-[3px] bg-gray-200 rounded-full overflow-hidden mt-2">
                <animated.div
                  style={progressAnimation}
                  className="absolute w-full top-0 left-0 h-[3px] bg-[#00c29b]"
                />
              </div>
            </div>
          )}
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
                {loading ? "Uploading..." : "Select File"}
              </Button>
            </div>
          )}

          {stage === "description" && postDetails && (
            <div className="flex flex-col mt-20 lg:flex-row w-full">
              <div className="flex-1 lg:pr-4 mb-4 lg:mb-0">
                <h2 className="text-lg lg:text-xl font-bold text-gray-800">
                  Add Description
                </h2>

                <div className="relative">
                  <textarea
                    value={description}
                    onChange={handleChange}
                    placeholder="Share more about your video here..."
                    className="w-full p-2 mt-4 border text-black border-none rounded-md outline-none h-[110px] bg-[#f2f2f2]"
                    rows={5}
                  ></textarea>
                  <div className="text-sm absolute text-gray-400 right-2 top-24 ">
                    {description.length}/{maxLength}
                  </div>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                  <Button
                    variant="pinks"
                    onClick={handlePost}
                    disabled={loading}
                  >
                    {loading ? "Posting..." : "Post"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                  >
                    Discard
                  </Button>
                </div>
              </div>

              <div className="relative flex-shrink-0 w-full lg:w-[260px] aspect-[9/16] mx-auto lg:mx-0 rounded-md overflow-hidden border-2 border-yellow-100">
                <img
                  src={TiktokMobileImage}
                  alt="Mobile Frame"
                  className="absolute top-0 left-0 w-full h-full object-contain "
                />
                <video
                  src={postDetails.file}
                  controls
                  className="absolute top-[15%] left-[10%] w-[80%] h-[70%] object-cover"
                />
                <div className="absolute z-10 right-8 top-44">
                  <VideoPostIcons small />
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
              <div className="flex gap-2">
              <Button variant="pinks" onClick={handleCancel} className="mt-4">
                Cancel
              </Button>
              <Button onClick={()=>setStage("upload")} className="mt-4 bg-green-300 hover:bg-green-400 text-gray-800 w-[73px]">
                Done
              </Button>
              </div>
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
