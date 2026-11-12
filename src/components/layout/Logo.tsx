import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Оригинальный логотип «Строят Крымчане» (PNG со старого сайта).
 * variant:
 *  - 'ink'    — графитовая версия для светлых поверхностей (шапка, подвал)
 *  - 'light'  — белая версия для тёмных секций (кора, ночные блоки)
 */
export function Logo({
  className,
  compact = false,
  variant = 'ink',
}: {
  className?: string;
  compact?: boolean;
  variant?: 'ink' | 'light';
}) {
  return (
    <Image
      src={variant === 'light' ? '/images/logo-white.png' : '/images/logo-ink.png'}
      alt='Логотип строительной компании «Строят Крымчане» — дуб в геральдическом щите'
      width={0}
      height={0}
      sizes='(max-width: 768px) 150px, 190px'
      className={cn('h-auto w-auto max-w-[190px]', compact && 'max-w-[150px]', className)}
      style={{ width: compact ? 150 : 190, height: 'auto' }}
      priority
    />
  );
}
