import { UserContext } from "@/context/UserProvider";
import { useContext } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

interface FollowersShowProps {
  followingCount: number;
  followersCount: number;
  following: Following[];
  followers: Followers[];
  setFollowing: React.Dispatch<React.SetStateAction<Following[]>>;
  setFollowingCount: React.Dispatch<React.SetStateAction<number>>;
  stage: "following" | "followers" | "suggested";
  setStage: React.Dispatch<
    React.SetStateAction<"following" | "followers" | "suggested">
  >;
}

interface User {
  _id: string;
  username: string;
  profile: string;
}

interface Followers {
  _id: string;
  follower: User;
  following: string;
}

interface Following {
  _id: string;
  following: User;
  follower: string;
}

function FollowersShow({
  followingCount,
  followersCount,
  followers,
  following,
  stage,
  setStage,
}: FollowersShowProps): JSX.Element {
  const userContext = useContext(UserContext);
  const { setShowModal, setFollowsShow } = userContext || {};
  const { username: profileUsername } = useParams();
  const navigate = useNavigate();

  const handleClose = () => {
    if (setShowModal && setFollowsShow) {
      if (setShowModal) {
        setShowModal(false);
      }
      setFollowsShow(false);
    }
  };

  const handleNavigate =
    (username: string): React.MouseEventHandler<HTMLButtonElement> =>
    () => {
      navigate(`/profile/${username}`);
      if (setShowModal && setFollowsShow) {
        setShowModal(false);
        setFollowsShow(false);
      }
    };

  const renderList = () => {
    const data = stage === "following" ? following : followers;

    return (
      <div>
        {data.map((item: Followers | Following) => {
          const user =
            stage === "following"
              ? (item as Following).following
              : stage === "followers"
              ? (item as Followers).follower
              : null;
          return (
            user && (
              <div
                key={item._id}
                className="flex justify-between items-center mx-4"
              >
                <div className="flex items-center p-4">
                  <img
                    src={user.profile}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="ml-4 text-white">{user.username}</p>
                </div>
                <div>
                  {
                    <button
                      onClick={handleNavigate(user.username)}
                      className="px-6 py-1 bg-[#ff3b5b] text-white rounded-md"
                    >
                      View
                    </button>
                  }
                </div>
              </div>
            )
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 left-[32%] bg-[#121212] opacity-95 w-[500px] h-screen z-50">
      <div className="flex justify-between items-center p-2">
        <h1 className="w-full text-center text-2xl font-semibold">
          {profileUsername}
        </h1>
        <p className="cursor-pointer" onClick={handleClose}>
          <IoClose size={35} />
        </p>
      </div>
      <div className="flex justify-between items-center mt-8">
        <p
          onClick={() => setStage("following")}
          className={`px-6 font-semibold cursor-pointer ${
            stage === "following"
              ? "text-[#ff3b5b] border-b border-[#ff3b5b]"
              : "text-[white] border-b-2 border-transparent"
          }`}
        >
          Following {followingCount}
        </p>
        <p
          onClick={() => setStage("followers")}
          className={`px-6 font-semibold cursor-pointer ${
            stage === "followers"
              ? "text-[#ff3b5b] border-b border-[#ff3b5b]"
              : "text-[white] border-b-2 border-transparent"
          }`}
        >
          Followers {followersCount}
        </p>
        <p
          onClick={() => setStage("suggested")}
          className={`px-6 font-semibold cursor-pointer ${
            stage === "suggested"
              ? "text-[#ff3b5b] border-b border-[#ff3b5b]"
              : "text-[white] border-b-2 border-transparent"
          }`}
        >
          Suggested 0
        </p>
      </div>
      <hr className="opacity-20" />
      <div className="overflow-y-scroll h-[80%]">{renderList()}</div>
    </div>
  );
}

export default FollowersShow;
