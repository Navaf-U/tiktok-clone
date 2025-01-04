import { FaUserCircle } from "react-icons/fa";

interface UserProfilePictureProps {
  profile?: string;
  altText?: string;
  className?: string; 
  size?: number; 
}

function UserProfilePicture({
  profile,
  altText = "User profile picture",
  className = "",
}: UserProfilePictureProps): JSX.Element {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden bg-gray-700 ${className}`} // Fallback style for circular images
    >
      {profile ? (
        <img
          className="object-cover w-full h-full"
          src={profile}
          alt={altText}
        />
      ) : (
        <FaUserCircle className="text-white" size={40} />
      )}
    </div>
  );
}

export default UserProfilePicture;
