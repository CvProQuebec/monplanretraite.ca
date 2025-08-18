// Composant de particules interactives avec IA et réactivité
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useDynamicTheme } from '../hooks/useDynamicTheme';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'floating' | 'reactive' | 'magnetic' | 'energy';
  opacity: number;
  scale: number;
}

interface InteractiveParticlesProps {
  count?: number;
  interactive?: boolean;
  magnetic?: boolean;
  energy?: boolean;
  theme?: 'auto' | 'morning' | 'afternoon' | 'evening' | 'night' | 'premium' | 'creative';
  className?: string;
  children?: React.ReactNode;
}

export const InteractiveParticles: React.FC<InteractiveParticlesProps> = ({
  count = 50,
  interactive = true,
  magnetic = true,
  energy = true,
  theme = 'auto',
  className = '',
  children
}) => {
  const { currentTheme } = useDynamicTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Valeurs de mouvement pour les particules
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springMouseX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springMouseY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  // Configuration des couleurs selon le thème
  const getThemeColors = useCallback(() => {
    if (theme === 'auto' && currentTheme) {
      return {
        primary: currentTheme.primary,
        secondary: currentTheme.secondary,
        accent: currentTheme.accent
      };
    }

    // Couleurs par thème
    const themeColors = {
      morning: {
        primary: 'from-orange-400 to-yellow-400',
        secondary: 'from-green-400 to-emerald-400',
        accent: 'from-pink-400 to-rose-400'
      },
      afternoon: {
        primary: 'from-blue-500 to-indigo-500',
        secondary: 'from-cyan-400 to-blue-400',
        accent: 'from-emerald-400 to-teal-400'
      },
      evening: {
        primary: 'from-purple-400 to-pink-400',
        secondary: 'from-indigo-400 to-purple-400',
        accent: 'from-amber-400 to-orange-400'
      },
      night: {
        primary: 'from-slate-600 to-gray-600',
        secondary: 'from-blue-600 to-indigo-600',
        accent: 'from-cyan-400 to-blue-400'
      },
      premium: {
        primary: 'from-amber-400 to-yellow-400',
        secondary: 'from-purple-500 to-pink-500',
        accent: 'from-emerald-400 to-teal-400'
      },
      creative: {
        primary: 'from-pink-400 to-purple-400',
        secondary: 'from-cyan-400 to-blue-400',
        accent: 'from-yellow-400 to-orange-400'
      }
    };

    return themeColors[theme as keyof typeof themeColors] || themeColors.afternoon;
  }, [theme, currentTheme]);

  // Initialisation des particules
  useEffect(() => {
    const colors = getThemeColors();
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const type = Math.random() > 0.7 ? 'reactive' : 
                   Math.random() > 0.5 ? 'magnetic' : 
                   Math.random() > 0.3 ? 'energy' : 'floating';

      const colorMap = {
        floating: colors.secondary,
        reactive: colors.primary,
        magnetic: colors.accent,
        energy: colors.primary
      };

      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 1,
        color: colorMap[type],
        life: Math.random() * 100 + 50,
        maxLife: Math.random() * 100 + 50,
        type,
        opacity: Math.random() * 0.6 + 0.4,
        scale: Math.random() * 0.5 + 0.5
      });
    }

    setParticles(newParticles);
  }, [count, getThemeColors]);

  // Gestion des événements de souris
  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setMousePos({ x, y });
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [interactive, mouseX, mouseY]);

  // Animation des particules
  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();

    const animateParticles = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      setParticles(prevParticles => 
        prevParticles.map(particle => {
          let newX = particle.x;
          let newY = particle.y;
          let newVx = particle.vx;
          let newVy = particle.vy;
          let newLife = particle.life;
          let newOpacity = particle.opacity;
          let newScale = particle.scale;

          // Physique de base
          newX += newVx * (deltaTime / 16);
          newY += newVy * (deltaTime / 16);

          // Effet magnétique vers la souris
          if (magnetic && isHovered) {
            const dx = mousePos.x - newX;
            const dy = mousePos.y - newY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 30 && particle.type === 'magnetic') {
              const force = 0.1;
              newVx += (dx / distance) * force;
              newVy += (dy / distance) * force;
            }
          }

          // Effet réactif à la souris
          if (interactive && isHovered && particle.type === 'reactive') {
            const dx = mousePos.x - newX;
            const dy = mousePos.y - newY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 20) {
              newVx = -newVx * 1.5;
              newVy = -newVy * 1.5;
              newScale = Math.min(newScale * 1.2, 2);
              newOpacity = Math.min(newOpacity * 1.3, 1);
            }
          }

          // Effet d'énergie au clic
          if (energy && isActive && particle.type === 'energy') {
            const dx = mousePos.x - newX;
            const dy = mousePos.y - newY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 40) {
              newVx += (dx / distance) * 3;
              newVy += (dy / distance) * 3;
              newScale = Math.min(newScale * 1.5, 3);
              newOpacity = 1;
            }
          }

          // Friction et air resistance
          newVx *= 0.98;
          newVy *= 0.98;

          // Rebond aux bords
          if (newX < 0 || newX > 100) {
            newVx = -newVx * 0.8;
            newX = Math.max(0, Math.min(100, newX));
          }
          if (newY < 0 || newY > 100) {
            newVy = -newVy * 0.8;
            newY = Math.max(0, Math.min(100, newY));
          }

          // Vie et régénération
          newLife -= deltaTime * 0.1;
          if (newLife < 0) {
            newLife = particle.maxLife;
            newX = Math.random() * 100;
            newY = Math.random() * 100;
            newVx = (Math.random() - 0.5) * 2;
            newVy = (Math.random() - 0.5) * 2;
            newOpacity = Math.random() * 0.6 + 0.4;
            newScale = Math.random() * 0.5 + 0.5;
          }

          // Normalisation des valeurs
          newOpacity = Math.max(0.1, Math.min(1, newOpacity));
          newScale = Math.max(0.1, Math.min(3, newScale));

          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            life: newLife,
            opacity: newOpacity,
            scale: newScale
          };
        })
      );

      animationId = requestAnimationFrame(animateParticles);
    };

    animationId = requestAnimationFrame(animateParticles);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [magnetic, interactive, energy, isHovered, isActive, mousePos]);

  // Composant de particule individuelle
  const ParticleComponent: React.FC<{ particle: Particle }> = ({ particle }) => {
    const particleVariants = {
      floating: {
        animate: {
          y: [particle.y, particle.y - 10, particle.y],
          opacity: [particle.opacity, particle.opacity * 0.8, particle.opacity],
          scale: [particle.scale, particle.scale * 1.1, particle.scale]
        },
        transition: {
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      },
      reactive: {
        animate: {
          scale: [particle.scale, particle.scale * 1.2, particle.scale],
          opacity: [particle.opacity, particle.opacity * 1.3, particle.opacity]
        },
        transition: {
          duration: 1 + Math.random(),
          repeat: Infinity,
          ease: "easeInOut"
        }
      },
      magnetic: {
        animate: {
          rotate: [0, 360],
          scale: [particle.scale, particle.scale * 1.1, particle.scale]
        },
        transition: {
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          ease: "linear"
        }
      },
      energy: {
        animate: {
          scale: [particle.scale, particle.scale * 1.5, particle.scale],
          opacity: [particle.opacity, 1, particle.opacity],
          filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
        },
        transition: {
          duration: 2 + Math.random(),
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    };

    const variant = particleVariants[particle.type];

    return (
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          width: particle.size,
          height: particle.size,
          opacity: particle.opacity,
          scale: particle.scale
        }}
        variants={variant}
        animate="animate"
        initial="animate"
      >
        <div
          className={`w-full h-full rounded-full bg-gradient-to-r ${particle.color}`}
          style={{
            filter: particle.type === 'energy' ? 'drop-shadow(0 0 4px currentColor)' : 'none'
          }}
        />
      </motion.div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight: '200px' }}
    >
      {/* Particules de fond */}
      <div className="absolute inset-0">
        {particles.map(particle => (
          <ParticleComponent key={particle.id} particle={particle} />
        ))}
      </div>

      {/* Effet de connexion entre particules proches */}
      {isHovered && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {particles.slice(0, 10).map((particle, i) => {
            const nextParticle = particles[i + 1];
            if (nextParticle) {
              const distance = Math.sqrt(
                Math.pow(particle.x - nextParticle.x, 2) + 
                Math.pow(particle.y - nextParticle.y, 2)
              );
              
              if (distance < 15) {
                return (
                  <line
                    key={`${particle.id}-${nextParticle.id}`}
                    x1={`${particle.x}%`}
                    y1={`${particle.y}%`}
                    x2={`${nextParticle.x}%`}
                    y2={`${nextParticle.y}%`}
                    stroke="url(#connectionGradient)"
                    strokeWidth="0.5"
                    opacity={0.3}
                  />
                );
              }
            }
            return null;
          })}
        </svg>
      )}

      {/* Contenu principal */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Indicateur d'interactivité */}
      {interactive && (
        <motion.div
          className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full opacity-0"
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1.2 : 1
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  );
};

// Composant de particules avec configuration par défaut
export const SimpleParticles: React.FC<Omit<InteractiveParticlesProps, 'interactive' | 'magnetic' | 'energy'>> = (props) => {
  return (
    <InteractiveParticles
      {...props}
      interactive={false}
      magnetic={false}
      energy={false}
    />
  );
};

// Composant de particules magnétiques
export const MagneticParticles: React.FC<Omit<InteractiveParticlesProps, 'magnetic'>> = (props) => {
  return (
    <InteractiveParticles
      {...props}
      magnetic={true}
      interactive={true}
      energy={false}
    />
  );
};

// Composant de particules énergétiques
export const EnergyParticles: React.FC<Omit<InteractiveParticlesProps, 'energy'>> = (props) => {
  return (
    <InteractiveParticles
      {...props}
      energy={true}
      interactive={true}
      magnetic={true}
    />
  );
};
