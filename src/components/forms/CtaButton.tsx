'use client';

import { openLeadDialog } from './LeadDialog';
import { cn } from '@/lib/utils';

export type CtaPayload = {
  type?: 'consult' | 'callback' | 'quiz' | 'tour' | 'contact' | 'mortgage';
  title?: string;
  subtitle?: string;
  message?: string;
  submitLabel?: string;
};

/**
 * Кнопка-CTA в новой стилистике.
 * variant:
 *  - 'ink'    — графитовая (спокойное основное действие)
 *  - 'ember'  — точечный ARDENA-акцент: только ключевые действия,
 *               не заливать фоны, не ставить рядом больше одной
 *  - 'outline'— контурная на светлой поверхности
 *  - 'outline-light' — контурная на тёмной поверхности
 */
export function CtaButton({
  children,
  payload,
  variant = 'ink',
  className,
  size = 'md',
}: {
  children: React.ReactNode;
  payload?: CtaPayload;
  variant?: 'ink' | 'ember' | 'outline' | 'outline-light';
  className?: string;
  size?: 'md' | 'lg';
}) {
  return (
    <button
      type="button"
      onClick={() => openLeadDialog(payload)}
      className={cn(
        'inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-sm px-6 py-3.5 text-[15px] font-semibold transition-colors duration-300',
        size === 'lg' && 'min-h-[56px] px-8 py-4 text-base',
        variant === 'ink' && 'bg-pine text-paper hover:bg-pine-deep',
        variant === 'ember' && 'bg-ember text-[#fdf6ef] hover:bg-[#d55a24]',
        variant === 'outline' && 'border border-graphite/30 text-graphite hover:border-graphite hover:bg-graphite hover:text-paper',
        variant === 'outline-light' &&
          'border border-[#f2ede2]/40 text-[#f2ede2] hover:border-oak-soft hover:bg-[#f2ede2]/10',
        className
      )}
    >
      {children}
    </button>
  );
}
