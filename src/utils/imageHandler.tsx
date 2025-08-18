
import React, { useState } from "react";
import { ImageIcon } from "lucide-react";

/**
 * Composant pour gérer les images avec fallback
 * @param src URL de l'image
 * @param alt Texte alternatif
 * @param className Classes CSS additionnelles
 * @returns Composant Image avec fallback
 */
export const Image = ({ 
  src, 
  alt, 
  className = "", 
  ...props 
}: { 
  src: string; 
  alt: string; 
  className?: string; 
  [key: string]: any 
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.log(`Échec du chargement de l'image: ${src}`);
    setImageError(true);
  };

  return imageError ? (
    <div className={`fallback-container ${className}`} {...props}>
      <ImageIcon className="fallback-icon" />
    </div>
  ) : (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={handleImageError} 
      loading="lazy"
      {...props} 
    />
  );
};

/**
 * Préfixe l'URL d'une image avec le chemin de base
 * @param path Chemin de l'image
 * @returns URL complète de l'image
 */
export const getImageUrl = (path: string): string => {
  // Vérifie si le chemin est déjà une URL complète
  if (path.startsWith('http')) return path;
  
  // Sinon, ajoute le préfixe
      return `/uploads/${path.startsWith('/') ? path.slice(1) : path}`;
};
