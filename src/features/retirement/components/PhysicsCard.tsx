import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';

// Types pour la physique
interface PhysicsConfig {
  gravity?: boolean;
  friction?: number;
  bounce?: number;
  magnetism?: boolean;
  inertia?: boolean;
}

interface EffectsConfig {
  shadow?: boolean;
  glow?: boolean;
  particles?: boolean;
  ripple?: boolean;
  sound?: boolean;
}

interface PhysicsCardProps {
  children: React.ReactNode;
  drag?: boolean;
  physics?: PhysicsConfig;
  effects?: EffectsConfig;
  className?: string;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onClick?: () => void;
}

export const PhysicsCard: React.FC<PhysicsCardProps> = ({
  children,
  drag = true,
  physics = {},
  effects = {},
  className = '',
  onDragStart,
  onDragEnd,
  onClick
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCount, setDragCount] = useState(0);
  const [energy, setEnergy] = useState(0);

  // Configuration par défaut
  const config = {
    gravity: physics.gravity ?? true,
    friction: physics.friction ?? 0.9,
    bounce: physics.bounce ?? 0.8,
    magnetism: physics.magnetism ?? false,
    inertia: physics.inertia ?? true,
    ...physics
  };

  const effectsConfig = {
    shadow: effects.shadow ?? true,
    glow: effects.glow ?? true,
    particles: effects.particles ?? false,
    ripple: effects.ripple ?? true,
    sound: effects.sound ?? false,
    ...effects
  };

  // Valeurs de mouvement
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const scale = useTransform([x, y], ([latestX, latestY]) => {
    const distance = Math.sqrt(latestX * latestX + latestY * latestY);
    return 1 + Math.min(distance / 500, 0.1);
  });

  // Gestion du drag
  const handleDragStart = () => {
    setIsDragging(true);
    setDragCount(prev => prev + 1);
    onDragStart?.();
    console.log('🎭 Drag commencé - Carte physique');
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    // Calcul de l'énergie basée sur la vitesse
    const velocity = Math.sqrt(info.velocity.x ** 2 + info.velocity.y ** 2);
    const newEnergy = Math.min(velocity / 1000, 2);
    setEnergy(newEnergy);
    
    // Diminution progressive de l'énergie
    setTimeout(() => setEnergy(0), 2000);
    
    onDragEnd?.();
    console.log('🎭 Drag terminé - Vitesse:', velocity, 'Énergie:', newEnergy);
  };

  // Animation de retour avec physique
  const dragConstraints = { left: -150, right: 150, top: -150, bottom: 150 };
  
  const dragTransition = {
    type: "spring",
    damping: config.friction * 30,
    stiffness: config.bounce * 100,
    mass: config.inertia ? 1 : 0.5
  };

  // Classes dynamiques basées sur l'état
  const dynamicClasses = [
    'relative',
    'cursor-grab',
    'select-none',
    'transition-all duration-300',
    // Ombre dynamique
    effectsConfig.shadow && (
      isDragging 
        ? 'shadow-2xl shadow-mpr-interactive/25' 
        : 'shadow-lg hover:shadow-xl'
    ),
    // Lueur d'énergie
    effectsConfig.glow && energy > 0.5 && 'ring-4 ring-mpr-interactive/50',
    // Effet de survol
    'hover:scale-105 active:scale-95',
    className
  ].filter(Boolean).join(' ');

  // Style dynamique
  const dynamicStyle: React.CSSProperties = {
    transformOrigin: 'center',
    willChange: 'transform',
    // Lueur d'énergie
    ...(effectsConfig.glow && energy > 0 && {
      boxShadow: `0 0 ${20 + energy * 30}px rgba(59, 130, 246, ${0.3 + energy * 0.4})`
    })
  };

  // Effet de particules (simulé avec des divs)
  const renderParticles = () => {
    if (!effectsConfig.particles || energy < 0.3) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit">
        {Array.from({ length: Math.floor(energy * 10) }, (_, i) => (
          <motion.div
            key={`particle-${dragCount}-${i}`}
            className="absolute w-1 h-1 bg-mpr-interactive rounded-full"
            initial={{
              x: '50%',
              y: '50%',
              opacity: 1,
              scale: 0
            }}
            animate={{
              x: `${50 + (Math.random() - 0.5) * 200}%`,
              y: `${50 + (Math.random() - 0.5) * 200}%`,
              opacity: 0,
              scale: 1
            }}
            transition={{
              duration: 1 + Math.random(),
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    );
  };

  // Effet de ripple au clic
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent) => {
    if (!effectsConfig.ripple) {
      onClick?.();
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    
    // Nettoyage du ripple
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);
    
    onClick?.();
  };

  return (
    <motion.div
      drag={drag}
      dragConstraints={dragConstraints}
      dragElastic={config.bounce}
      dragTransition={dragTransition}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className={dynamicClasses}
      style={{
        x,
        y,
        rotateX: config.gravity ? rotateX : 0,
        rotateY: config.gravity ? rotateY : 0,
        scale,
        ...dynamicStyle
      }}
      whileHover={{ 
        scale: 1.05,
        rotateZ: Math.random() * 4 - 2,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
    >
      {/* Contenu principal */}
      <div className="relative z-10 p-6 bg-white rounded-xl border border-gray-200">
        {children}
      </div>

      {/* Particules d'énergie */}
      {renderParticles()}

      {/* Effets de ripple */}
      {effectsConfig.ripple && ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute pointer-events-none bg-mpr-interactive/30 rounded-full"
          style={{
            left: `${ripple.x}%`,
            top: `${ripple.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 200, height: 200, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}

      {/* Indicateur d'énergie */}
      {energy > 0.2 && (
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-mpr-interactive to-purple-500 rounded-full z-20"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      )}

      {/* Compteur de drags (pour le debug) */}
      {process.env.NODE_ENV === 'development' && dragCount > 0 && (
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gray-800 text-white text-xs rounded-full flex items-center justify-center z-20">
          {dragCount}
        </div>
      )}
    </motion.div>
  );
};

// Variantes pré-configurées
export const SimplePhysicsCard: React.FC<Omit<PhysicsCardProps, 'physics' | 'effects'>> = (props) => (
  <PhysicsCard
    {...props}
    physics={{ gravity: false, friction: 0.8, bounce: 0.6 }}
    effects={{ shadow: true, glow: false, particles: false, ripple: true }}
  />
);

export const AdvancedPhysicsCard: React.FC<Omit<PhysicsCardProps, 'physics' | 'effects'>> = (props) => (
  <PhysicsCard
    {...props}
    physics={{ gravity: true, friction: 0.9, bounce: 0.9, inertia: true }}
    effects={{ shadow: true, glow: true, particles: true, ripple: true }}
  />
);

export const MagneticPhysicsCard: React.FC<Omit<PhysicsCardProps, 'physics' | 'effects'>> = (props) => (
  <PhysicsCard
    {...props}
    physics={{ gravity: true, friction: 0.95, bounce: 0.7, magnetism: true }}
    effects={{ shadow: true, glow: true, particles: false, ripple: true }}
  />
);