import video from '../../assets/video.mp4'

const VideoLoop = () => {
  return (
    <div className="flex items-center justify-center">
      <video
        className="w-[50vw] h-[50vh] object-cover"
        src={video}
        loop
        autoPlay
        muted
      ></video>
    </div>
  );
};

export default VideoLoop;
