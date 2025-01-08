import UserProfilePicture from "@/components/shared/UserProfilePicture";
import axiosInstance from "@/utilities/axiosInstance";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { IoIosMusicalNotes, IoMdBookmark } from "react-icons/io";
import { IoClose, IoHeart } from "react-icons/io5";
import {
  FaCommentDots,
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { PiPaperPlaneTiltFill } from "react-icons/pi";
import { ImEmbed2 } from "react-icons/im";
import axiosErrorManager from "@/utilities/axiosErrorManager";
import { toast } from "@/hooks/use-toast";
import { UserContext } from "@/context/UserProvider";

function SingleVideoPage(): JSX.Element {
  interface Post {
    _id: string;
    username: string;
    file: string;
    likes: string[];
    comments: Comment[];
    favorites: string[];
    date: string;
    description: string;
  }
  interface User {
    _id: string;
    username: string;
    email: string;
    profile: string;
    bio: string;
    role: string;
  }

  interface Comment {
    user: {
      _id: string;
      username: string;
      profile: string;
    };
    text: string;
    createdAt: string;
  }

  const { id } = useParams();
  const [singlePost, setSinglePost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [comment, setComment] = useState<string>("");
  const [stage, setStage] = useState<"comments" | "creatorVideos">("comments");

  const userContext = useContext(UserContext);
  const currUser = userContext?.currUser;

  useEffect(() => {
    const getUserSinglePost = async () => {
      try {
        const { data } = await axiosInstance(`/user/posts/video/${id}`);
        setSinglePost(data);
      } catch (error) {
        toast({
          title: "Error",
          description: axiosErrorManager(error) || "Failed to fetch post.",
        });
      }
    };
    getUserSinglePost();
  }, [id]);

  useEffect(() => {
    const getUser = async () => {
      if (singlePost?.username) {
        try {
          const { data } = await axios.get(
            `http://localhost:3000/user/profile/${singlePost.username}`
          );
          setUser(data);
        } catch (error) {
          toast({
            title: "Error",
            description: axiosErrorManager(error) || "Failed to fetch user.",
          });
        }
      }
    };
    getUser();
  }, [singlePost]);

  useEffect(() => {
    const getCommentsOfPost = async () => {
      try {
        const { data } = await axiosInstance(`/user/posts/comments/${id}`);
        setSinglePost((prev) => (prev ? { ...prev, comments: data } : null));
      } catch (error) {
        toast({
          title: "Comment Error",
          description: axiosErrorManager(error) || "Failed to fetch comments.",
        });
      }
    };
    getCommentsOfPost();
  }, [id]);

  const postComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post(`/user/posts/comments/${id}`, {
        text: comment,
        user: currUser?.id,
      });
      setSinglePost((prev) => (prev ? { ...prev, comments: data } : null));
      setComment("");
    } catch (error) {
      toast({
        title: "Comment Error",
        description: axiosErrorManager(error) || "An unknown error occurred.",
      });
    }
  };

  const formattedDate = singlePost?.date
    ? formatDistanceToNow(new Date(singlePost.date), { addSuffix: true })
    : "";

  return (
    <div className="flex h-screen">
      <div>
        <div className="absolute left-3 top-5 bg-[#383837] rounded-full p-1">
          <IoClose size={25} />
        </div>
        <div className="mt-16">
          <video
            src={singlePost?.file}
            controls
            autoPlay
            loop
            className="w-[100%]"
          ></video>
        </div>
      </div>
      <div className="bg-[#121212] w-[57%] m-5 flex flex-col  relative">
        <div className="bg-[#1c1c1c] h-[120px] rounded-md">
          <div className="p-3">
            <div className="flex">
              <UserProfilePicture
                profile={user?.profile}
                className="rounded-full w-10"
              />
              <div className="flex flex-col ms-2">
                <h4 className="text-lg font-semibold ms-2">{user?.username}</h4>
                <p className="text-xs">{formattedDate}</p>
              </div>
            </div>
            <p className="mt-2 text-[15px]">{singlePost?.description}</p>
            <div className="flex gap-1 items-center">
              <IoIosMusicalNotes size={12} className="mt-1" />
              <p className="text-xs mt-1">original Sound - {user?.username}</p>
            </div>
          </div>
        </div>

        <div className="p-2 ">
          <div className="flex justify-between">
            <div className="flex gap-5 mt-2">
              <div className="flex items-center gap-1 cursor-pointer">
                <IoHeart
                  size={32}
                  className="bg-[#2e2e2e] hover:bg-[#1c1c1c] rounded-full p-2"
                />
                <p className="text-xs">0</p>
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                <FaCommentDots
                  size={32}
                  className="bg-[#2e2e2e] hover:bg-[#1c1c1c] rounded-full p-2"
                />
                <p className="text-xs">0</p>
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                <IoMdBookmark
                  size={32}
                  className="bg-[#2e2e2e] hover:bg-[#1c1c1c] rounded-full p-2"
                />
                <p className="text-xs">0</p>
              </div>
            </div>
            <div className="flex gap-2">
              <ImEmbed2 size={22} className="bg-[#2e2e2e] rounded-full p-1" />
              <PiPaperPlaneTiltFill
                size={22}
                className="text-white bg-[#ff2b56] rounded-full p-1"
              />
              <FaWhatsapp
                size={22}
                className="text-white bg-green-500 rounded-full p-1"
              />
              <FaFacebookF
                size={22}
                className="bg-[#0075fa] text-white rounded-full p-1"
              />
              <FaTwitter
                size={22}
                className="bg-blue-400 text-white rounded-full p-1"
              />
            </div>
          </div>
        </div>

        <div className="sticky top-0 bg-[#121212] p-2 z-10">
          <div className="flex justify-between">
            <h3
              onClick={() => setStage("comments")}
              className={`text-sm font-semibold text-center w-[50%] cursor-pointer ${
                stage === "comments" && "border-b-white border-b-2"
              }`}
            >
              Comments {singlePost?.comments.length}
            </h3>
            <h3
              onClick={() => setStage("creatorVideos")}
              className={`text-sm font-semibold text-center w-[50%] cursor-pointer ${
                stage === "creatorVideos" && "border-b-white border-b-2"
              }`}
            >
              Creator videos
            </h3>
          </div>
          <hr className="w-full opacity-50 bg-purple-800" />
        </div>
        <div className="flex-1 overflow-y-scroll" id="commentsContainer">
          {stage === "comments" &&
            singlePost?.comments
              .slice()
              .reverse()
              .map((comment, index) => (
                <div key={index} className="p-2">
                  <div className="flex gap-2">
                    <UserProfilePicture
                      profile={comment.user.profile}
                      className="rounded-full w-9 h-9"
                    />
                    <div className="flex flex-col">
                      <h4 className="text-[13px] ">{comment.user.username}</h4>
                      <p className="text-md mt-[-4px] font-semibold">
                        {comment.text}
                      </p>
                      <p className="text-[10px] text-[gray] ">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
        </div>
        <form
          className="sticky bottom-0 w-full bg-[#121212] p-3 flex gap-2 items-center"
          action=""
          onSubmit={postComment}
        >
          <input
            type="text"
            placeholder="Add a comment"
            className="w-full bg-[#1c1c1c] p-2 rounded-md text-sm"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#ff2b56] text-white px-4 py-1 rounded-md text-sm"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default SingleVideoPage;
