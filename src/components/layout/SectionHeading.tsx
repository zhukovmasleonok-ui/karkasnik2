import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';

/**
 * Заголовок секции: спокойный serif Cormorant через clamp(),
 * микроподпись-eyebrow без крика. Пауза перед текстом — много воздуха.
 */
export function SectionHeading({
  eyebrow,
  title,
  text,
  align = 'left',
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        'max-w-[760px]',
        align === 'center' && 'mx-auto text-center',
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            'mb-4 flex items-center gap-3 text-[11.5px] font-bold uppercase tracking-[0.22em]',
            align === 'center' && 'justify-center',
            dark ? 'text-oak-soft' : 'text-graphite-soft'
          )}
        >
          <span className={cn('h-[1px] w-8', dark ? 'bg-oak-soft/60' : 'bg-oak/70')} aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'text-balance font-display text-[clamp(30px,4.6vw,52px)] font-medium leading-[1.08]',
          dark ? 'text-[#f2ede2]' : 'text-graphite'
        )}
      >
        {title}
      </h2>
      {text && (
        <p
          className={cn(
            'mt-5 text-pretty text-[16px] leading-relaxed',
            dark ? 'text-[#e9e2d2]/75' : 'text-graphite-soft'
          )}
        >
          {text}
        </p>
      )}
    </Reveal>
  );
}
