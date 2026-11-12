'use client';

import Link from 'next/link';
import { Phone, Mail, Clock } from 'lucide-react';
import { Logo } from './Logo';
import { company, nav, technologies, cities } from '@/content/site';

/**
 * Светлый «бумажный» подвал: крупная serif-подпись, тонкие линии,
 * реквизиты и города. Без тёмной корпоративной плиты.
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-paper-2/70">
      <div className="container-x pb-10 pt-14 lg:pt-16">
        {/* Крупная спокойная подпись */}
        <p className="font-display text-[clamp(34px,6vw,64px)] font-medium leading-[1.05] text-graphite">
          Дома с душой <span className="italic text-oak">в Крыму</span>
        </p>

        <div className="mt-10 grid gap-10 border-t border-line pt-10 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          {/* Бренд */}
          <div>
            <Link href="/" className="inline-block w-fit" aria-label="На главную — Строят Крымчане">
              <Logo compact />
            </Link>
            <p className="mt-5 max-w-[300px] text-pretty text-[13.5px] leading-relaxed text-graphite-soft">
              Для жизни, отдыха и семейной истории, которая начинается с доверия.
            </p>
            <div className="mt-6 flex gap-2.5">
              {company.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-[12px] font-bold text-graphite/75 transition-colors hover:border-ember hover:text-graphite"
                >
                  {s.label.slice(0, 2)}
                </a>
              ))}
            </div>
          </div>

          {/* Навигация */}
          <nav aria-label="Меню в подвале">
            <p className="text-[11.5px] font-bold uppercase tracking-[0.18em] text-graphite-soft/80">
              Меню
            </p>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[14.5px] text-graphite/85 transition-colors hover:text-graphite"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/selection"
                  className="text-[14.5px] text-graphite/85 transition-colors hover:text-graphite"
                >
                  Подбор дома
                </Link>
              </li>
            </ul>
          </nav>

          {/* Технологии */}
          <nav aria-label="Технологии">
            <p className="text-[11.5px] font-bold uppercase tracking-[0.18em] text-graphite-soft/80">
              Технологии
            </p>
            <ul className="mt-4 space-y-2.5">
              {technologies.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/technologies#${t.slug}`}
                    className="text-[14.5px] text-graphite/85 transition-colors hover:text-graphite"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Контакты */}
          <div>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.18em] text-graphite-soft/80">
              Контакты
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href={company.phoneHref}
                className="flex items-center gap-2.5 text-[16px] font-semibold text-graphite"
              >
                <Phone className="h-4 w-4 text-oak" />
                {company.phone}
              </a>
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-2.5 text-[14.5px] text-graphite/85 hover:text-graphite"
              >
                <Mail className="h-4 w-4 text-oak" />
                {company.email}
              </a>
              <p className="flex items-center gap-2.5 text-[13.5px] text-graphite-soft">
                <Clock className="h-4 w-4 text-oak" />
                {company.workHours}
              </p>
              <p className="text-[13.5px] text-graphite-soft">
                Работаем по всей территории Республики Крым
              </p>
            </div>
          </div>
        </div>

        {/* Города */}
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-7 text-[13px] text-graphite-soft/90">
          {cities.map((c) => (
            <span key={c}>{c}</span>
          ))}
          <span>и весь Крым</span>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-7 text-[12.5px] text-graphite-soft/90 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <p>© {new Date().getFullYear()} ИП Амерьян Вячеслав · «Строят Крымчане». Все права защищены.</p>
            <p>
              ИНН {company.requisites.inn} · ОГРНИП {company.requisites.ogrnip}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-graphite">
              Политика конфиденциальности
            </Link>
            <Link href="/privacy#consent" className="transition-colors hover:text-graphite">
              Согласие на обработку данных
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
