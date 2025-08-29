import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Types pour les particules
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
  energy: number;
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

// Configuration des thèmes de particules
const PARTICLE_THEMES = {
  auto: {
    colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'],
    baseSize: 3,
    speed: 0.5,
    magnetism: 50
  },
  morning: {
    colors: ['#F59E0B', '#EAB308', '#F97316', '#FB923C', '#FBBF24'],
    baseSize: 4,
    speed: 0.8,
    magnetism: 60
  },
  afternoon: {
    colors: ['#3B82F6', '#1D4ED8', '#2563EB', '#1E40AF', '#60A5FA'],
    baseSize: 3,
    speed: 0.6,
    magnetism: 40
  },
  evening: {
    colors: ['#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE', '#EC4899'],
    baseSize: 3.5,
    speed: 0.4,
    magnetism: 70
  },
  night: {
    colors: ['#1F2937', '#374151', '#4B5563', '#6B7280', '#9CA3AF'],
    baseSize: 2.5,
    speed: 0.3,
    magnetism: 30
  },
  premium: {
    colors: ['#F59E0B', '#EAB308', '#FBBF24', '#FCD34D', '#FDE047'],
    baseSize: 5,
    speed: 1.0,
    magnetism: 80
  },
  creative: {
    colors: ['#EC4899', '#F472B6', '#FB7185', '#FBBF24', '#34D399'],
    baseSize: 4,
    speed: 0.9,
    magnetism: 90
  }
};

export const InteractiveParticles: React.FC<InteractiveParticlesProps> = ({
  count = 50,
  interactive = true,
  magnetic = true,
  energy = false,
  theme = 'auto',
  className = '',
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  const themeConfig = PARTICLE_THEMES[theme];

  // Création des particules
  const createParticle = (id: number, canvas: HTMLCanvasElement): Particle => {
    return {
      id,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * themeConfig.speed,
      vy: (Math.random() - 0.5) * themeConfig.speed,
      size: themeConfig.baseSize + Math.random() * 2,
      color: themeConfig.colors[Math.floor(Math.random() * themeConfig.colors.length)],
      opacity: 0.3 + Math.random() * 0.7,
      life: 0,
      maxLife: 1000 + Math.random() * 2000,
      energy: 0
    };
  };

  // Initialisation des particules
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newParticles = Array.from({ length: count }, (_, i) => 
      createParticle(i, canvas)
    );
    setParticles(newParticles);
    particlesRef.current = newParticles;
  }, [count, theme]); // Utiliser theme au lieu de themeConfig

  // Animation des particules
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const animate = () => {
      // Redimensionnement du canvas
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Effacement
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.map(particle => {
          let { x, y, vx, vy, energy } = particle;

          // Effet magnétique
          if (magnetic && interactive && isActive) {
            const dx = mouseRef.current.x - x;
            const dy = mouseRef.current.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < themeConfig.magnetism) {
              const force = (themeConfig.magnetism - distance) / themeConfig.magnetism;
              vx += (dx / distance) * force * 0.1;
              vy += (dy / distance) * force * 0.1;
              energy = Math.min(energy + force * 0.5, 2);
            }
          }

          // Mouvement
          x += vx;
          y += vy;

          // Rebonds sur les bords
          if (x <= 0 || x >= canvas.width) vx *= -0.8;
          if (y <= 0 || y >= canvas.height) vy *= -0.8;

          // Contraintes
          x = Math.max(0, Math.min(canvas.width, x));
          y = Math.max(0, Math.min(canvas.height, y));

          // Friction
          vx *= 0.99;
          vy *= 0.99;
          energy *= 0.95;

          // Vie de la particule
          const life = particle.life + 1;
          const lifeRatio = life / particle.maxLife;

          // Régénération
          if (life > particle.maxLife) {
            return createParticle(particle.id, canvas);
          }

          return {
            ...particle,
            x, y, vx, vy, energy, life
          };
        });

      // Rendu des particules
      particlesRef.current.forEach(particle => {
        const { x, y, size, color, opacity, energy } = particle;
        
        ctx.save();
        ctx.globalAlpha = opacity + energy * 0.3;
        
        // Particule principale
        ctx.beginPath();
        ctx.arc(x, y, size + energy, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Effet d'énergie
        if (energy > 0.5) {
          ctx.beginPath();
          ctx.arc(x, y, (size + energy) * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = energy * 0.2;
          ctx.fill();
        }

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles, magnetic, interactive, isActive, themeConfig]);

  // Gestion des événements souris
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handleMouseEnter = () => {
    setIsActive(true);
  };

  const handleMouseLeave = () => {
    setIsActive(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!energy) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Explosion d'énergie
      setParticles(prev => prev.map(particle => {
        const dx = particle.x - clickX;
        const dy = particle.y - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          return {
            ...particle,
            vx: particle.vx + (dx / distance) * force * 5,
            vy: particle.vy + (dy / distance) * force * 5,
            energy: Math.min(particle.energy + force * 2, 3)
          };
        }
        
        return particle;
      }));
    }
  };

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ zIndex: 0 }}
      />
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
};

// Variantes spécialisées
export const MagneticParticles: React.FC<Omit<InteractiveParticlesProps, 'magnetic'>> = (props) => (
  <InteractiveParticles {...props} magnetic={true} />
);

export const EnergyParticles: React.FC<Omit<InteractiveParticlesProps, 'energy'>> = (props) => (
  <InteractiveParticles {...props} energy={true} />
);

export const SimpleParticles: React.FC<Omit<InteractiveParticlesProps, 'interactive' | 'magnetic' | 'energy'>> = (props) => (
  <InteractiveParticles {...props} interactive={false} magnetic={false} energy={false} />
);