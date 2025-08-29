
import React from "react";
import { Loader2, AlertCircle, ExternalLink } from "lucide-react";

interface VideoOverlaysProps {
  isLoading?: boolean;
  error?: string | null;
  videoUrl?: string;
}

const VideoOverlays: React.FC<VideoOverlaysProps> = ({ 
  isLoading, 
  error, 
  videoUrl 
}) => {
  if (!isLoading && !error) return null;

  return (
    <div className="absolute inset-0 bg-charcoal-900/90 backdrop-blur-sm flex items-center justify-center">
      {isLoading && (
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gold" />
          <p className="text-lg">Chargement de la vidéo...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center text-white p-6 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Vidéo non disponible</h3>
          <p className="text-gray-300 mb-4">
            {error.includes('YouTube') 
              ? "Cette vidéo YouTube ne peut pas être affichée directement sur cette page."
              : error
            }
          </p>
          
          {videoUrl && videoUrl.includes('youtube') && (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                Vous pouvez essayer de :
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => window.open(videoUrl, '_blank')}
                  className="bg-gold hover:bg-gold-600 text-charcoal-900 px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ouvrir sur YouTube
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-charcoal-700 hover:bg-charcoal-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Actualiser la page
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-4 text-xs text-gray-500">
            <p>Conseils de dépannage :</p>
            <ul className="mt-2 space-y-1 text-left">
              <li>• Vérifiez votre connexion internet</li>
              <li>• Désactivez temporairement votre bloqueur de publicités</li>
              <li>• Essayez un autre navigateur</li>
              <li>• Vérifiez les paramètres de confidentialité de votre navigateur</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoOverlays;
