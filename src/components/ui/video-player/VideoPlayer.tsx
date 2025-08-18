
import React, { useState, useEffect } from "react";
import YoutubePlayer from "./YoutubePlayer";
import NativePlayer from "./NativePlayer";
import VideoOverlays from "./VideoOverlays";

interface VideoPlayerProps {
  src: string;
  title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Determine if the source is a YouTube URL
  const isYouTube = src.includes("youtube.com") || src.includes("youtu.be");
  
  useEffect(() => {
    // Reset states when source changes
    setIsLoading(true);
    setError(null);
    setIsPlaying(false);
    
    // For YouTube videos, loading is handled differently
    if (isYouTube) {
      // YouTube loading will be managed by the YouTube component
      setIsLoading(false);
    }

    // Set a timeout to clear loading state if it persists too long
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        console.warn('Video loading timeout - clearing loading state');
      }
    }, 8000); // Augmenté à 8 secondes
    
    return () => clearTimeout(timeoutId);
  }, [src, isYouTube, isLoading]);

  // Fonction pour gérer les erreurs de manière plus robuste
  const handleError = (errorMessage: string) => {
    console.error('Video error:', errorMessage);
    setError(errorMessage);
    setIsLoading(false);
  };

  // Fonction pour gérer les changements d'état de chargement
  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
    if (!loading) {
      setError(null); // Clear any previous errors when loading completes
    }
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-charcoal-800">
      {isYouTube ? (
        <YoutubePlayer 
          src={src} 
          title={title} 
          onPlayStateChange={setIsPlaying}
          onLoadingChange={handleLoadingChange}
          onError={handleError}
        />
      ) : (
        <NativePlayer 
          src={src} 
          onPlayStateChange={setIsPlaying}
          onLoadingChange={handleLoadingChange}
          onError={handleError}
        />
      )}
      
      {/* Overlays avec l'URL de la vidéo pour les liens alternatifs */}
      {(isLoading || error) && (
        <VideoOverlays 
          isLoading={isLoading} 
          error={error} 
          videoUrl={src}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
