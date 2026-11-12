import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { Reveal } from '@/components/layout/Reveal';
import { company } from '@/content/site';
import { asset } from '@/lib/paths';

/**
 * Hero в духе Nordhaus: полноэкранная атмосфера, сдержанный заголовок,
 * одна ненавязчивая ссылка внизу. Никаких ценников и кнопок в лоб.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-night text-[#f2ede2]" aria-label="Главный экран">
      <div className="absolute inset-0">
        <Image
          src={asset('/images/hero-aframe.jpg')}
          alt="А-образный дом среди крымских гор — атмосферное фото"
          fill
          priority
          sizes="100vw"
          className="hero-img object-cover"
        />
        {/* Мягкое затемнение графитом: фото дышит, текст читается (AA) */}
        <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/25 to-night/30" />
      </div>

      <div className="container-x relative flex min-h-[88svh] flex-col justify-end pb-16 pt-36 sm:min-h-[92svh] lg:pb-20">
        <Reveal className="max-w-[860px]">
          <p className="mb-6 flex items-center gap-3 text-[11.5px] font-bold uppercase tracking-[0.26em] text-[#e9e2d2]/80">
            <span className="h-[1px] w-10 bg-[#e9e2d2]/50" aria-hidden="true" />
            {company.tagline}
          </p>
          <h1 className="text-balance font-display text-[clamp(44px,8vw,96px)] font-medium leading-[1.02]">
            Кто строит дом —{' '}
            <span className="italic text-oak-soft">тот строит счастье</span>
          </h1>
          <p className="mt-7 max-w-[540px] text-pretty text-[16.5px] leading-relaxed text-[#e9e2d2]/85 sm:text-[17.5px]">
            СИП-панельные, каркасные и модульные дома на территории Республики
            Крым. Спокойно, честно и по-домашнему — от первого разговора до
            ключей.
          </p>
        </Reveal>

        {/* Одна ненавязчивая ссылка внизу экрана */}
        <Reveal delay={200} className="mt-14 lg:mt-20">
          <Link
            href="#filosofiya"
            className="group inline-flex items-center gap-4 text-[14px] font-semibold uppercase tracking-[0.18em] text-[#e9e2d2]/85 transition-colors hover:text-white"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e9e2d2]/35 transition-colors group-hover:border-oak-soft">
              <ArrowDown className="h-4 w-4 transition-transform duration-500 group-hover:translate-y-0.5" aria-hidden="true" />
            </span>
            Узнать нас ближе
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Краткая строка реальных фактов — спокойная, без бегущих строк:
   тонкие линии, serif-цифры, второстепенный текст.
 */
export function KeyFacts() {
  const items = [
    { value: 'от 650 000 ₽', label: 'модульный дом 15 м² «под ключ»' },
    { value: 'до 20 дней', label: 'возведение СИП-панельного дома' },
    { value: 'до 30 дней', label: 'производство каркасного «Префаб»' },
    { value: 'весь Крым', label: 'работаем только своими бригадами' },
  ];
  return (
    <section aria-label="Ключевые факты" className="border-b border-line">
      <div className="container-x grid grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <Reveal
            key={it.value}
            delay={i * 70}
            className="border-line px-2 py-9 sm:px-6 lg:py-12 [&:nth-child(-n+2)]:border-b lg:[&:nth-child(-n+2)]:border-b-0 lg:border-l lg:first:border-l-0"
          >
            <p className="font-display text-[clamp(24px,2.8vw,38px)] font-medium leading-tight text-graphite">
              {it.value}
            </p>
            <p className="mt-2 max-w-[220px] text-[13.5px] leading-snug text-graphite-soft">
              {it.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
