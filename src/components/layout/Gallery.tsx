'use client';

import Image from 'next/image';
import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Лёгкая галерея-лайтбокс без внешних зависимостей.
 * Клавиши: Esc — закрыть, ←/→ — листать.
 */
export function Gallery({
  items,
  className,
  cols = 3,
}: {
  items: { src: string; alt: string; caption?: string }[];
  className?: string;
  cols?: 2 | 3 | 4;
}) {
  const [active, setActive] = useState<number | null>(null);

  const onKey = (e: React.KeyboardEvent) => {
    if (active === null) return;
    if (e.key === 'Escape') setActive(null);
    if (e.key === 'ArrowRight') setActive((a) => (a === null ? a : (a + 1) % items.length));
    if (e.key === 'ArrowLeft') setActive((a) => (a === null ? a : (a - 1 + items.length) % items.length));
  };

  return (
    <div onKeyDown={onKey} className={cn('contents', className)}>
      <div
        className={cn(
          'grid gap-4 sm:gap-5',
          cols === 2 && 'grid-cols-1 sm:grid-cols-2',
          cols === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          cols === 4 && 'grid-cols-2 lg:grid-cols-4'
        )}
      >
        {items.map((item, i) => (
          <button
            key={item.src + i}
            type="button"
            onClick={() => setActive(i)}
            className="group relative overflow-hidden rounded-sm bg-paper-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine"
            aria-label={`Открыть фото: ${item.alt}`}
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
            {item.caption && (
              <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-8 text-[13px] font-medium text-white">
                {item.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 sm:p-10"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фотографии"
          onClick={() => setActive(null)}
        >
          <figure className="relative max-h-full max-w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={items[active].src}
              alt={items[active].alt}
              width={1280}
              height={800}
              className="max-h-[78vh] w-auto max-w-full rounded-sm object-contain"
              priority
            />
            <figcaption className="mt-3 text-center text-[13.5px] text-white/80">
              {items[active].alt}
            </figcaption>
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute -top-2 right-0 translate-y-[-100%] rounded-sm border border-white/30 p-2 text-white transition-colors hover:bg-white/10 sm:top-0 sm:-right-2 sm:translate-x-[100%] sm:translate-y-0"
              aria-label="Закрыть просмотр"
              autoFocus
            >
              <X className="h-5 w-5" />
            </button>
          </figure>
        </div>
      )}
    </div>
  );
}
