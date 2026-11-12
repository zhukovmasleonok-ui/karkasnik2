'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Phone, X } from 'lucide-react';
import { Logo } from './Logo';
import { company, nav } from '@/content/site';
import { cn } from '@/lib/utils';
import { openLeadDialog } from '@/components/forms/LeadDialog';

/**
 * Спокойная светлая шапка: тёплая бумага, тонкая линия, никаких
 * «липких» CTA — только телефон и ненавязчивая связь.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const onKeyNav = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', onKeyNav);
    return () => window.removeEventListener('keydown', onKeyNav);
  }, [onKeyNav]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b bg-paper/92 text-graphite transition-colors duration-500',
        scrolled && !open ? 'border-line' : 'border-transparent',
        /* Важно: blur вешаем только при закрытом меню — backdrop-filter
           создаёт containing block и ломает fixed-позиционирование оверлея */
        !open && 'backdrop-blur-md'
      )}
    >
      <div className="container-x flex h-[68px] items-center justify-between gap-4 lg:h-[76px]">
        <Link href="/" aria-label="Строят Крымчане — на главную" className="shrink-0">
          <Logo compact />
        </Link>

        <nav aria-label="Основное меню" className="hidden items-center gap-6 xl:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative whitespace-nowrap text-[14px] font-medium tracking-[0.01em] text-graphite/80 transition-colors hover:text-graphite',
                pathname === item.href && 'text-graphite'
              )}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute -bottom-1.5 left-0 h-px w-full origin-left bg-ember transition-transform duration-300',
                  pathname === item.href ? 'scale-x-100' : 'scale-x-0'
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={company.phoneHref}
            className="hidden items-center gap-2 whitespace-nowrap text-[15px] font-semibold tracking-wide md:flex lg:text-base"
            aria-label={`Позвонить: ${company.phone}`}
          >
            <Phone className="h-4 w-4 text-graphite-soft" strokeWidth={2.2} />
            {company.phone}
          </a>
          <button
            type="button"
            onClick={() => openLeadDialog({ type: 'callback', title: 'Заказать обратный звонок' })}
            className="hidden rounded-sm border border-line px-4 py-2 text-[14px] font-medium text-graphite/85 transition-colors hover:border-ember hover:text-graphite md:inline-flex"
          >
            Заказать звонок
          </button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-line transition-colors hover:bg-paper-2 xl:hidden"
            aria-label="Открыть меню"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Мобильное меню: тёмная «кора», крупная типографика */}
      <div
        className={cn(
          'fixed inset-0 z-[60] flex flex-col bg-night text-[#f2ede2] transition-all duration-300 xl:hidden',
          open ? 'visible opacity-100' : 'invisible opacity-0'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Меню"
      >
        <div className="container-x flex h-[68px] items-center justify-between">
          <Logo compact variant="light" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-[#f2ede2]/25"
            aria-label="Закрыть меню"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Мобильное меню" className="container-x mt-6 flex flex-col">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'group flex items-baseline border-b border-[#f2ede2]/12 py-4 transition-opacity',
                open ? 'opacity-100' : 'opacity-0'
              )}
              style={{ transitionDelay: `${80 + i * 40}ms` }}
            >
              {/* Без порядковых номеров — только спокойная крупная типографика */}
              <span className="font-display text-[26px] font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="container-x mt-auto flex flex-col gap-4 pb-10">
          <a href={company.phoneHref} className="flex items-center gap-3 text-lg font-semibold">
            <Phone className="h-5 w-5 text-oak-soft" />
            {company.phone}
          </a>
          <a
            href={`mailto:${company.email}`}
            className="text-sm text-[#f2ede2]/70 underline underline-offset-4"
          >
            {company.email}
          </a>
        </div>
      </div>
    </header>
  );
}
