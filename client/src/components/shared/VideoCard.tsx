import { useRef } from "react";

function VideoCard({ file }: { file: string }): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="w-[300px]  sm:w-[280px] h-[390px] bg-black rounded-lg overflow-hidden shadow-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={file}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted
      ></video>
    </div>
  );
}

export default VideoCard;
