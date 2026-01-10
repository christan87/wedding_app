import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const animationStyles = {
  'fade-in': {
    initial: 'opacity-0',
    animate: 'opacity-100',
    transition: 'transition-opacity duration-700 ease-out',
  },
  'slide-up': {
    initial: 'opacity-0 translate-y-12',
    animate: 'opacity-100 translate-y-0',
    transition: 'transition-all duration-700 ease-out',
  },
  'slide-down': {
    initial: 'opacity-0 -translate-y-12',
    animate: 'opacity-100 translate-y-0',
    transition: 'transition-all duration-700 ease-out',
  },
  'slide-left': {
    initial: 'opacity-0 translate-x-12',
    animate: 'opacity-100 translate-x-0',
    transition: 'transition-all duration-700 ease-out',
  },
  'slide-right': {
    initial: 'opacity-0 -translate-x-12',
    animate: 'opacity-100 translate-x-0',
    transition: 'transition-all duration-700 ease-out',
  },
  'zoom-in': {
    initial: 'opacity-0 scale-95',
    animate: 'opacity-100 scale-100',
    transition: 'transition-all duration-700 ease-out',
  },
  'zoom-out': {
    initial: 'opacity-0 scale-105',
    animate: 'opacity-100 scale-100',
    transition: 'transition-all duration-700 ease-out',
  },
  'none': {
    initial: '',
    animate: '',
    transition: '',
  },
};

export default function ImageDisplay({
  src,
  alt = '',
  animation = 'fade-in',
  width,
  height,
  fill = false,
  className = '',
  containerClassName = '',
  priority = false,
  delay = 0,
  triggerOnScroll = true,
  threshold = 0.1,
}) {
  const [isVisible, setIsVisible] = useState(!triggerOnScroll);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!triggerOnScroll) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasAnimated(true);
      }, delay);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delay);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [triggerOnScroll, delay, threshold, hasAnimated]);

  const animationConfig = animationStyles[animation] || animationStyles['fade-in'];
  
  const animationClasses = `${animationConfig.transition} ${
    isVisible ? animationConfig.animate : animationConfig.initial
  }`;

  // Determine if src is a URL or a public path
  const isExternalUrl = src?.startsWith('http://') || src?.startsWith('https://');

  return (
    <div ref={ref} className={`${containerClassName}`}>
      {fill ? (
        <div className={`relative ${animationClasses} ${className}`}>
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-cover"
            {...(isExternalUrl && { unoptimized: true })}
          />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className={`${animationClasses} ${className}`}
          {...(isExternalUrl && { unoptimized: true })}
        />
      )}
    </div>
  );
}
