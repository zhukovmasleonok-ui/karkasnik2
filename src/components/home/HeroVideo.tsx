'use client';

import { useState } from 'react';
import { asset } from '@/lib/paths';

/**
 * Фоновое видео главного экрана без «мигания» при загрузке:
 * снизу лежит статичный кадр (первый кадр ролика), сверху —
 * само видео; оно проявляется кроссфейдом, только когда реально
 * готово играть, поэтому смена картинки незаметна.
 */
export function HeroVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <>
      <img
        src={asset('/images/hero-poster.jpg')}
        alt=""
        aria-hidden="true"
        className="hero-img absolute inset-0 h-full w-full object-cover"
      />
      <video
        src={asset('/videos/hero.mp4')}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onPlaying={() => setPlaying(true)}
        className={`hero-img absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          playing ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  );
}
