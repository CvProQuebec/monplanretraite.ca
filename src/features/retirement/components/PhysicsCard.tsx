// Composant de carte avec physique réaliste et effets 3D
import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useDragControls, PanInfo } from 'framer-motion';
import { useDynamicTheme } from '../hooks/useDynamicTheme';

interface PhysicsCardProps {
  children: React.ReactNode;
  drag?: boolean;
  dragConstraints?: boolean | { left: number; right: number; top: number; bottom: number };
  dragElastic?: number;
  dragMomentum?: boolean;
  dragSnapToOrigin?: boolean;
  onDragStart?: () => void;
  onDragEnd?: (event: any, info: PanInfo) => void;
  className?: string;
  initialScale?: number;
  hoverScale?: number;
  tapScale?: number;
  springConfig?: {
    stiffness: number;
    damping: number;
    mass: number;
  };
  physics?: {
    gravity?: boolean;
    friction?: number;
    bounce?: number;
    airResistance?: number;
  };
  effects?: {
    shadow?: boolean;
    glow?: boolean;
    particles?: boolean;
    ripple?: boolean;
  };
}

export const PhysicsCard: React.FC<PhysicsCardProps> = ({
  children,
  drag = true,
  dragConstraints = { left: -50, right: 50, top: -50, bottom: 50 },
  dragElastic = 0.1,
  dragMomentum = true,
  dragSnapToOrigin = false,
  onDragStart,
  onDragEnd,
  className = '',
  initialScale = 1,
  hoverScale = 1.05,
  tapScale = 0.95,
  springConfig = { stiffness: 300, damping: 20, mass: 1 },
  physics = { gravity: true, friction: 0.95, bounce: 0.8, airResistance: 0.98 },
  effects = { shadow: true, glow: true, particles: true, ripple: true }
}) => {
  const { currentTheme } = useDynamicTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; scale: number }>>([]);

  // Valeurs de mouvement avec physique
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(initialScale);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const z = useMotionValue(0);

  // Ressorts physiques réalistes
  const springX = useSpring(x, {
    stiffness: springConfig.stiffness,
    damping: springConfig.damping,
    mass: springConfig.mass
  });

  const springY = useSpring(y, {
    stiffness: springConfig.stiffness,
    damping: springConfig.damping,
    mass: springConfig.mass
  });

  const springScale = useSpring(scale, {
    stiffness: springConfig.stiffness * 2,
    damping: springConfig.damping,
    mass: springConfig.mass
  });

  const springRotateX = useSpring(rotateX, {
    stiffness: springConfig.stiffness * 0.5,
    damping: springConfig.damping * 1.5,
    mass: springConfig.mass * 2
  });

  const springRotateY = useSpring(rotateY, {
    stiffness: springConfig.stiffness * 0.5,
    damping: springConfig.damping * 1.5,
    mass: springConfig.mass * 2
  });

  // Transformations 3D basées sur la position
  const rotateXTransform = useTransform(y, [-100, 100], [30, -30]);
  const rotateYTransform = useTransform(x, [-100, 100], [-30, 30]);
  const zTransform = useTransform(scale, [0.8, 1.2], [-20, 20]);

  // Contrôles de glissement
  const dragControls = useDragControls();

  // Gestion du glissement avec physique
  const handleDragStart = () => {
    setIsDragging(true);
    onDragStart?.();
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    
    // Physique de rebond
    if (physics.bounce && physics.bounce > 0) {
      const velocity = Math.sqrt(info.velocity.x ** 2 + info.velocity.y ** 2);
      if (velocity > 100) {
        // Rebond avec friction
        const bounceX = info.velocity.x * physics.bounce * physics.friction;
        const bounceY = info.velocity.y * physics.bounce * physics.friction;
        
        x.set(x.get() + bounceX * 0.1);
        y.set(y.get() + bounceY * 0.1);
      }
    }

    // Retour à l'origine si activé
    if (dragSnapToOrigin) {
      x.set(0);
      y.set(0);
    }

    onDragEnd?.(event, info);
  };

  // Gestion du hover avec physique
  const handleHoverStart = () => {
    setIsHovered(true);
    if (physics.gravity) {
      // Lévitation légère
      z.set(10);
    }
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    if (physics.gravity) {
      // Retour à la normale
      z.set(0);
    }
  };

  // Gestion du clic avec effet ripple
  const handleTap = (event: React.MouseEvent) => {
    if (!effects.ripple) return;

    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const newRipple = {
        id: Date.now(),
        x,
        y,
        scale: 0
      };

      setRipples(prev => [...prev, newRipple]);

      // Suppression automatique du ripple
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 1000);
    }
  };

  // Effet de gravité
  useEffect(() => {
    if (!physics.gravity || isDragging) return;

    let animationId: number;
    let lastTime = performance.now();

    const animateGravity = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Simulation de gravité
      const gravity = 0.5;
      const currentY = y.get();
      const currentVelocity = (currentY - y.get()) / deltaTime;
      
      // Application de la gravité avec friction
      const newVelocity = currentVelocity + gravity;
      const newY = currentY + newVelocity * physics.friction!;
      
      // Rebond au sol
      if (newY > 0) {
        y.set(0);
        y.set(-newVelocity * physics.bounce!);
      } else {
        y.set(newY);
      }

      animationId = requestAnimationFrame(animateGravity);
    };

    animationId = requestAnimationFrame(animateGravity);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [physics.gravity, isDragging, y, physics.friction, physics.bounce]);

  // Mise à jour des transformations 3D
  useEffect(() => {
    rotateX.set(rotateXTransform.get());
    rotateY.set(rotateYTransform.get());
    z.set(zTransform.get());
  }, [rotateXTransform, rotateYTransform, zTransform, rotateX, rotateY, z]);

  // Configuration des couleurs selon le thème
  const getThemeColors = () => {
    if (!currentTheme) return { primary: 'from-blue-500 to-purple-600', accent: 'from-pink-400 to-rose-500' };
    
    return {
      primary: currentTheme.primary,
      accent: currentTheme.accent
    };
  };

  const themeColors = getThemeColors();

  return (
    <motion.div
      ref={cardRef}
      drag={drag}
      dragControls={dragControls}
      dragConstraints={dragConstraints}
      dragElastic={dragElastic}
      dragMomentum={dragMomentum}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onTap={handleTap}
      style={{
        x: springX,
        y: springY,
        scale: springScale,
        rotateX: springRotateX,
        rotateY: springRotateY,
        z: z,
        transformStyle: "preserve-3d"
      }}
      whileHover={{ 
        scale: hoverScale,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: tapScale,
        transition: { duration: 0.1, ease: "easeOut" }
      }}
      className={`
        relative cursor-grab active:cursor-grabbing
        transform-gpu perspective-1000
        ${className}
      `}
    >
      {/* Effet de bordure lumineuse */}
      {effects.glow && (
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
          style={{
            background: `linear-gradient(45deg, ${themeColors.primary})`,
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
            zIndex: -1
          }}
          animate={{
            opacity: isHovered ? 0.3 : 0,
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Effet de particules flottantes */}
      {effects.particles && isHovered && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full"
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + Math.sin(i) * 20}%`
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [0, -20, -40]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Effet de ripple au clic */}
      {effects.ripple && ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute w-4 h-4 bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x - 8,
            top: ripple.y - 8,
            transformOrigin: 'center'
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}

      {/* Contenu principal de la carte */}
      <motion.div
        className={`
          relative bg-white rounded-xl p-6 shadow-lg border border-gray-200
          transform-gpu transition-all duration-300
          ${isDragging ? 'shadow-2xl' : 'shadow-lg'}
          ${isHovered ? 'border-blue-300' : 'border-gray-200'}
        `}
        style={{
          transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)'
        }}
      >
        {/* Effet de brillance au hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl"
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '100%' : '-100%' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Contenu de la carte */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Indicateur de glissement */}
        {drag && (
          <motion.div
            className="absolute bottom-2 right-2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
            animate={{
              scale: isDragging ? 1.2 : 1,
              rotate: isDragging ? 180 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </motion.div>
        )}
      </motion.div>

      {/* Effet d'ombre dynamique */}
      {effects.shadow && (
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0"
          style={{
            background: `radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, transparent 70%)`,
            transform: 'translateZ(-10px)',
            filter: 'blur(10px)'
          }}
          animate={{
            opacity: isHovered ? 0.3 : 0,
            scale: isHovered ? 1.2 : 1
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

// Composant de carte avec configuration par défaut
export const SimplePhysicsCard: React.FC<Omit<PhysicsCardProps, 'physics' | 'effects'>> = (props) => {
  return (
    <PhysicsCard
      {...props}
      physics={{ gravity: false, friction: 0.95, bounce: 0.5, airResistance: 0.98 }}
      effects={{ shadow: true, glow: false, particles: false, ripple: true }}
    />
  );
};

// Composant de carte avec physique avancée
export const AdvancedPhysicsCard: React.FC<Omit<PhysicsCardProps, 'physics' | 'effects'>> = (props) => {
  return (
    <PhysicsCard
      {...props}
      physics={{ gravity: true, friction: 0.9, bounce: 0.8, airResistance: 0.95 }}
      effects={{ shadow: true, glow: true, particles: true, ripple: true }}
      springConfig={{ stiffness: 400, damping: 15, mass: 0.8 }}
    />
  );
};
