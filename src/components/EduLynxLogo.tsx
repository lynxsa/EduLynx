import { useState, useCallback } from 'react';
import Image from 'next/image';

// Base64 encoded logo as ultimate fallback
const LOGO_BASE64 = "data:image/png;base64,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";

// Multiple logo fallback paths
const LOGO_PATHS = [
  '/logo.png',
  '/edulynx-logo.png',
  '/lynx-logo.png',
  '/brand-logo.png',
  '/assets/logos/edulynx-main.png',
  '/assets/logos/edulynx-primary.png',
  '/assets/logos/edulynx-fallback.png'
];

interface EduLynxLogoProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
}

export default function EduLynxLogo({ 
  width = 64, 
  height = 64, 
  className = "object-contain", 
  alt = "EduLynx Logo",
  priority = true 
}: EduLynxLogoProps) {
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [useBase64, setUseBase64] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleError = useCallback(() => {
    console.warn(`Logo failed to load from: ${LOGO_PATHS[currentPathIndex]}`);
    
    if (currentPathIndex < LOGO_PATHS.length - 1) {
      // Try next logo path
      setCurrentPathIndex(prev => prev + 1);
      console.log(`Trying fallback logo: ${LOGO_PATHS[currentPathIndex + 1]}`);
    } else {
      // Use base64 fallback as last resort
      console.log('Using base64 fallback logo');
      setUseBase64(true);
    }
  }, [currentPathIndex]);

  const handleLoad = useCallback(() => {
    console.log(`✅ Logo loaded successfully from: ${useBase64 ? 'base64 fallback' : LOGO_PATHS[currentPathIndex]}`);
    setHasLoaded(true);
  }, [currentPathIndex, useBase64]);

  // If we're using base64, render base64 image
  if (useBase64) {
    return (
      <img
        src={LOGO_BASE64}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onLoad={handleLoad}
        onError={() => console.error('❌ Even base64 logo failed to load')}
        style={{ 
          maxWidth: `${width}px`, 
          maxHeight: `${height}px`,
          opacity: hasLoaded ? 1 : 0.8
        }}
      />
    );
  }

  // Otherwise use Next.js Image with current fallback path
  return (
    <Image
      src={LOGO_PATHS[currentPathIndex]}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onLoad={handleLoad}
      onError={handleError}
      style={{ 
        opacity: hasLoaded ? 1 : 0.8 
      }}
    />
  );
}
