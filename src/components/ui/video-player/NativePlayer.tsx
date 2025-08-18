
import React, { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react";

interface NativePlayerProps {
  src: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  onError?: (error: string | null) => void;
}

const NativePlayer: React.FC<NativePlayerProps> = ({ 
  src, 
  onPlayStateChange,
  onLoadingChange,
  onError
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Notify parent that we're loading
    if (onLoadingChange) onLoadingChange(true);
    
    const video = videoRef.current;
    if (!video) return;
    
    // Reset and pause the video when source changes
    video.pause();
    setIsPlaying(false);
    if (onPlayStateChange) onPlayStateChange(false);
    
    const handleCanPlayThrough = () => {
      if (onLoadingChange) onLoadingChange(false);
      console.log("Video can play through");
    };
    
    const handleLoadedData = () => {
      if (onLoadingChange) onLoadingChange(false);
      console.log("Video data loaded");
      
      // Set initial frame
      try {
        video.currentTime = 0.1;
      } catch (err) {
        console.error("Error setting initial frame:", err);
      }
    };
    
    const handleError = () => {
      if (onLoadingChange) onLoadingChange(false);
      if (onError) onError("Erreur de chargement de la vidéo");
      console.error("Video load error for source:", src);
    };
    
    video.addEventListener("canplaythrough", handleCanPlayThrough);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);
    
    // Set timeout to clear loading state if it persists too long
    const timeoutId = setTimeout(() => {
      if (onLoadingChange) onLoadingChange(false);
    }, 5000);
    
    return () => {
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
      clearTimeout(timeoutId);
    };
  }, [src, onLoadingChange, onPlayStateChange, onError]);
  
  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const video = videoRef.current;
    if (!video) return;
    
    try {
      if (video.paused) {
        video.play()
          .then(() => {
            setIsPlaying(true);
            if (onPlayStateChange) onPlayStateChange(true);
            console.log("Video playback started");
          })
          .catch(err => {
            console.error("Playback error:", err);
            if (onError) onError("Erreur de lecture vidéo");
          });
      } else {
        video.pause();
        setIsPlaying(false);
        if (onPlayStateChange) onPlayStateChange(false);
        console.log("Video paused");
      }
    } catch (err) {
      console.error("Play/pause error:", err);
      if (onError) onError("Erreur de contrôle vidéo");
    }
  };

  return (
    <>
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-10" onClick={handlePlayClick}>
          <div className="rounded-full bg-gold/80 p-4 hover:bg-gold cursor-pointer transition-colors">
            <Play className="w-6 h-6 text-charcoal-900" />
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-2xl"
        preload="metadata"
        playsInline
        controls={isPlaying}
        onPause={() => {
          setIsPlaying(false);
          if (onPlayStateChange) onPlayStateChange(false);
        }}
        onPlay={() => {
          setIsPlaying(true);
          if (onPlayStateChange) onPlayStateChange(true);
        }}
        onWaiting={() => {
          if (onLoadingChange) onLoadingChange(true);
        }}
        onPlaying={() => {
          if (onLoadingChange) onLoadingChange(false);
        }}
      >
        <source src={src} type="video/mp4" />
        Votre navigateur ne prend pas en charge les vidéos.
      </video>
    </>
  );
};

export default NativePlayer;
