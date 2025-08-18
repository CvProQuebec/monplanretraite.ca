
import React, { useState, useEffect } from "react";
import { Play, ExternalLink, AlertCircle, Info } from "lucide-react";

interface YoutubePlayerProps {
  src: string;
  title?: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  onError?: (error: string | null) => void;
}

const YoutubePlayer: React.FC<YoutubePlayerProps> = ({ 
  src, 
  title, 
  onPlayStateChange,
  onLoadingChange,
  onError 
}) => {
  const [embedError, setEmbedError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  // Extract YouTube ID from URL (supports both youtu.be and youtube.com)
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  const youtubeId = getYoutubeId(src);
  
  // YouTube embed parameters simplifiés
  const getYoutubeEmbedUrl = () => {
    if (!youtubeId) return "";
    
    const params = new URLSearchParams({
      autoplay: '0',
      controls: '1',
      modestbranding: '1',
      rel: '0',
      fs: '1',
      color: 'white',
      playsinline: '1'
    });
    
    return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Recharger l'iframe pour forcer le démarrage
    const iframe = document.querySelector('iframe[src*="youtube.com"]') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
    
    if (onPlayStateChange) onPlayStateChange(true);
    
    console.log("Redémarrage de la vidéo YouTube:", youtubeId);
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setShowInfo(true);
    setShowEmbed(false);
    setEmbedError(false);
    
    if (onLoadingChange) onLoadingChange(false);
  };

  const handleIframeLoad = () => {
    if (onLoadingChange) onLoadingChange(false);
    setEmbedError(false);
    console.log("YouTube iframe chargé avec succès");
  };

  const handleIframeError = () => {
    if (onLoadingChange) onLoadingChange(false);
    setEmbedError(true);
    if (onError) onError("L'intégration YouTube a échoué");
    console.error("YouTube iframe a échoué");
  };

  const handleDirectLink = () => {
    window.open(src, '_blank');
  };

  const handleBackToThumbnail = () => {
    setShowEmbed(false);
    setEmbedError(false);
    setShowInfo(false);
  };

  // Reset states when source changes
  useEffect(() => {
    setEmbedError(false);
    setShowInfo(false);
  }, [src]);

  if (!youtubeId) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-charcoal-800 text-white">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p>URL YouTube invalide</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {!embedError ? (
        // Affichage direct de l'embed YouTube
        <div className="w-full h-full relative">
          <iframe
            src={getYoutubeEmbedUrl()}
            className="w-full h-full absolute inset-0"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            title={title || "Video YouTube"} 
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
          
          {/* Bouton de fallback en cas de problème */}
          <div className="absolute top-2 right-2">
            <button
              onClick={handleDirectLink}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              YouTube
            </button>
          </div>
        </div>
      ) : showInfo ? (
        // Affichage des informations de la vidéo
        <div className="absolute inset-0 flex items-center justify-center bg-charcoal-800">
          <div className="text-center text-white p-6 max-w-md">
            <Info className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Informations de la vidéo</h3>
            <p className="text-gray-300 mb-4">
              {title || "Vidéo YouTube"}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleDirectLink}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Regarder sur YouTube
              </button>
              
              <button
                onClick={handleBackToThumbnail}
                className="bg-charcoal-700 hover:bg-charcoal-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Retour à la miniature
              </button>
            </div>
            
            <div className="mt-4 text-xs text-gray-400">
              <p>Cette vidéo est disponible sur YouTube</p>
            </div>
          </div>
        </div>
      ) : embedError ? (
        // Affichage d'erreur avec options alternatives
        <div className="absolute inset-0 flex items-center justify-center bg-charcoal-800">
          <div className="text-center text-white p-6 max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Vidéo non disponible</h3>
            <p className="text-gray-300 mb-4">
              L'intégration YouTube ne fonctionne pas sur cette page.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleDirectLink}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Regarder sur YouTube
              </button>
              
              <button
                onClick={handleBackToThumbnail}
                className="bg-charcoal-700 hover:bg-charcoal-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Retour à la miniature
              </button>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              <p>Cette limitation peut être causée par :</p>
              <ul className="mt-2 space-y-1 text-left">
                <li>• Paramètres de confidentialité du navigateur</li>
                <li>• Bloqueur de contenu ou d'extensions</li>
                <li>• Restrictions de sécurité de YouTube</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        // Fallback en cas d'erreur - affichage de la miniature
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Thumbnail */}
          <div className="absolute inset-0 bg-black">
            <img 
              src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
              alt={`Miniature de ${title || 'vidéo YouTube'}`}
              className="w-full h-full object-cover opacity-80"
              onLoad={() => { if (onLoadingChange) onLoadingChange(false); }}
              onError={() => { 
                // Fallback vers une qualité inférieure si maxresdefault échoue
                const img = document.querySelector(`img[src*="${youtubeId}"]`) as HTMLImageElement;
                if (img) {
                  img.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                }
                if (onLoadingChange) onLoadingChange(false);
              }}
            />
          </div>
          
          {/* Boutons d'action centrés */}
          <div className="flex items-center gap-4 z-10">
            {/* Bouton de rechargement */}
            <div 
              className="rounded-full bg-gold/90 p-6 hover:bg-gold cursor-pointer transition-all duration-300 transform hover:scale-110 shadow-2xl"
              onClick={handlePlayClick}
            >
              <Play className="w-10 h-10 text-charcoal-900" />
            </div>
            
            {/* Bouton d'information */}
            <div 
              className="rounded-full bg-blue-600/90 p-4 hover:bg-blue-600 cursor-pointer transition-all duration-300 transform hover:scale-110 shadow-2xl"
              onClick={handleInfoClick}
            >
              <Info className="w-6 h-6 text-white" />
            </div>
          </div>
          
                      {/* Bouton de lien direct YouTube */}
            <div className="absolute bottom-4 right-4">
              <button
                onClick={handleDirectLink}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">YouTube</span>
              </button>
            </div>
          
          {/* Indicateur de statut */}
          <div className="absolute top-4 left-4 bg-charcoal-800/80 text-white text-xs px-2 py-1 rounded">
            Vidéo en cours de chargement
          </div>
        </div>
      )}
    </div>
  );
};

export default YoutubePlayer;
