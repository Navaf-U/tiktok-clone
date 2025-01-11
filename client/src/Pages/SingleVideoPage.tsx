import UserProfilePicture from "@/components/shared/UserProfilePicture";
import axiosInstance from "@/utilities/axiosInstance";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoPaperPlaneOutline } from "react-icons/io5";
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
    _id: string;
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
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const userContext = useContext(UserContext);
  const currUser = userContext?.currUser;
  const setPosts = userContext?.setPosts;

  useEffect(() => {
    if (!id) return;
    const getUserSinglePost = async () => {
      try {
        const { data } = await axiosInstance(`/user/posts/video/${id}`);
        setSinglePost(data);
      } catch (error) {
        toast({
          title: "Error",
          description: axiosErrorManager(error) || "Failed to fetch post.",
          className: "bg-red-500 font-semibold text-white",
        });
      }
    };
    getUserSinglePost();
  }, [id]);

  useEffect(() => {
    const getUser = async () => {
      if (!singlePost?.username) return;
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
            className: "bg-red-500 font-semibold text-white",
          });
        }
      }
    };
    getUser();
  }, [singlePost?.username]);

  const toggleLike = async () => {
    if (!singlePost || !currUser?._id) {
      toast({
        title: "Like Error",
        description: "You must be logged in to like posts.",
        className: "bg-red-500 font-semibold text-white",
      });
      return;
    }

    try {
      const isLiked = singlePost.likes.includes(currUser._id);

      const { data } = isLiked
        ? await axiosInstance.patch(`/user/posts/like/${singlePost._id}`)
        : await axiosInstance.post(`/user/posts/like/${singlePost._id}`);

      setSinglePost((prev) => (prev ? { ...prev, likes: data.likes } : null));

      if (setPosts) {
        setPosts((prev) =>
          prev.map((post) => {
            if (post._id === singlePost._id) {
              return { ...post, likes: data.likes };
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description:
          axiosErrorManager(error) || "Failed to toggle like status.",
        className: "bg-red-500 font-semibold text-white",
      });
    }
  };

  useEffect(() => {
    const getCommentsOfPost = async () => {
      try {
        const { data } = await axiosInstance.get(`/user/posts/comments/${id}`);
        setSinglePost((prev) => (prev ? { ...prev, comments: data } : null));
      } catch (error) {
        toast({
          title: "Comment Error",
          description: axiosErrorManager(error) || "Failed to fetch comments.",
          className: "bg-red-500 font-semibold text-white",
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
        user: currUser?._id,
      });
      setSinglePost((prev) => (prev ? { ...prev, comments: data } : null));
      setComment("");
    } catch (error) {
      toast({
        title: "Comment Error",
        description: axiosErrorManager(error) || "An unknown error occurred.",
        className: "bg-red-500 font-semibold text-white",
      });
    }
  };

  const removeComment = async (commentID: string) => {
    try {
      await axiosInstance.delete(`/user/posts/comments/${id}/${commentID}`);
      setSinglePost((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.filter((c) => c._id !== commentID),
            }
          : null
      );
    } catch (error) {
      toast({
        title: "Comment Error",
        description: axiosErrorManager(error) || "An unknown error occurred.",
        className: "bg-red-500 font-semibold text-white",
      });
    }
  };

  const formattedDate = singlePost?.date
    ? formatDistanceToNow(new Date(singlePost.date), { addSuffix: true })
    : "";

  const showDropdown = (index: number) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setDropdownIndex(index);
  };

  const hideDropdown = (index: number) => {
    const timeout = setTimeout(() => {
      if (dropdownIndex === index) {
        setDropdownIndex(null);
      }
    }, 500);
    setHoverTimeout(timeout);
  };

  if (!singlePost) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex gap-10 h-screen flex-col md:flex-row">
      <div className="w-full md:w-[50%]">
        <div className="">
          <Link
            className="absolute left-3 top-5 bg-[#383837] rounded-full cursor-pointer z-10"
            to="/"
          >
            <IoClose size={35} />
          </Link>
        </div>
        <div className="">
          <video
            src={singlePost?.file || ""}
            controls
            autoPlay
            loop
            className="w-[100%] ms-2.5  h-[auto] md:h-screen "
          ></video>
        </div>
      </div>
      <div className="bg-[#121212] w-[94%] md:w-[57%] m-5 flex flex-col relative">
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

        <div className="p-2">
          <div className="flex justify-between w-auto">
            <div className="flex gap-5 mt-2">
              <div className="flex items-center gap-1 cursor-pointer">
                {singlePost && (
                  <IoHeart
                    onClick={toggleLike}
                    size={32}
                    className={`bg-[#2e2e2e] hover:bg-[#1c1c1c] rounded-full p-2 ${
                      currUser?._id && singlePost.likes?.includes(currUser?._id)
                        ? "text-red-500"
                        : ""
                    }`}
                  />
                )}
                <p className="text-xs">{singlePost?.likes?.length}</p>
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                <FaCommentDots
                  size={32}
                  className="bg-[#2e2e2e] hover:bg-[#1c1c1c] rounded-full p-2"
                />
                <p className="text-xs">{singlePost?.comments?.length}</p>
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                <IoMdBookmark
                  size={32}
                  className="bg-[#2e2e2e] hover:bg-[#1c1c1c] rounded-full p-2"
                />
                <p className="text-xs">{singlePost?.favorites?.length}</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
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
                <div
                  key={index}
                  className="p-2 flex justify-between items-center"
                >
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
                  {(currUser?._id === comment.user._id ||
                    currUser?._id === singlePost?.username) && (
                    <div
                      className="relative"
                      onMouseEnter={() => showDropdown(index)}
                      onMouseLeave={() => hideDropdown(index)}
                    >
                      <HiOutlineDotsHorizontal
                        size={30}
                        className="text-white rounded-full p-1 cursor-pointer"
                      />
                      {dropdownIndex === index && (
                        <div className="absolute top-6 right-0 bg-[#2e2e2e] text-white rounded-md shadow-md">
                          <button
                            className="px-12 py-3.5 flex items-center justify-start gap-2 hover:text-[#ff3b5b] w-full text-left"
                            onClick={() => removeComment(comment._id)}
                          >
                            <FaRegTrashCan className="" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
        </div>
        <form
          className="sticky bottom-0 w-full bg-[#121212]  md:p-3 flex gap-2 items-center"
          action=""
          onSubmit={postComment}
        >
          <input
            type="text"
            placeholder="Add a comment"
            className="w-full text-white bg-[#2e2e2e] p-2 rounded-md outline-none"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <button type="submit" disabled={comment.length < 1}>
            <IoPaperPlaneOutline
              size={28}
              className={`md:hidden ${
                comment.length > 0
                  ? "bg-[#FF007C] text-white rounded-full p-1 flex justify-center items-center"
                  : "text-gray-400"
              }`}
            />
            <p
              className={`hidden md:flex ${
                comment.length > 0
                  ? "bg-[#FF007C] text-white rounded-md p-1.5 w-[80px] flex justify-center items-center"
                  : "text-gray-400 bg-[#2e2e2e] rounded-md p-1.5 w-[80px] flex justify-center items-center"
              }`}
            >
              Post
            </p>
          </button>
        </form>
      </div>
    </div>
  );
}

export default SingleVideoPage;
