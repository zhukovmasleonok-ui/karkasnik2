'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/* ================= Детальная страница проекта: переключение =================
   Фасады / Планировка / Комплектация — честные вкладки по реальным данным.
   Активная вкладка подчёркивается точечным акцентом (EMBER).
============================================================================ */

type Tier = { label: string; amount: number };

export function ProjectTabs({
  name,
  images,
  imageAlt,
  area,
  features,
  prices,
  slug,
}: {
  name: string;
  images: string[];
  imageAlt: string;
  area: number;
  features: string[];
  prices: Tier[];
  slug: string;
}) {
  // images[1] — планировка со старого сайта (png со схемой), остальные — фасады
  const planImage = images.length > 1 ? images[1] : null;
  const facadeImages = images.filter((_, i) => i !== 1);

  const tabs = [
    { key: 'facade', label: 'Фасады', num: '01' },
    ...(planImage ? [{ key: 'plan', label: 'Планировка', num: '02' }] : []),
    { key: 'kit', label: 'Комплектация', num: planImage ? '03' : '02' },
  ] as const;

  const [tab, setTab] = useState<(typeof tabs)[number]['key']>('facade');
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Вкладки: горизонталь, тонкие линии, спокойная типографика */}
      <div role="tablist" aria-label="Разделы проекта" className="flex border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'relative flex min-h-[52px] flex-1 items-center justify-center gap-2 px-3 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors sm:flex-none sm:px-6',
              tab === t.key ? 'text-graphite' : 'text-graphite-soft/70 hover:text-graphite'
            )}
          >
            <span className="hidden font-display text-[15px] font-medium text-oak sm:inline">
              {t.num}
            </span>
            {t.label}
            <span
              aria-hidden="true"
              className={cn(
                'absolute inset-x-0 bottom-0 h-[2px] origin-left bg-ember transition-transform duration-300',
                tab === t.key ? 'scale-x-100' : 'scale-x-0'
              )}
            />
          </button>
        ))}
      </div>

      {/* -------- Фасады -------- */}
      {tab === 'facade' && (
        <div role="tabpanel" aria-label="Фасады проекта" className="mt-6">
          <div className="skeleton relative aspect-[16/10] overflow-hidden rounded-sm">
            <Image
              src={facadeImages[active] || facadeImages[0] || '/images/project-sip.jpg'}
              alt={`${imageAlt} — вид ${active + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
          {facadeImages.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
              {facadeImages.map((img, i) => (
                <button
                  key={img + i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Показать вид ${i + 1} проекта ${name}`}
                  aria-pressed={active === i}
                  className={cn(
                    'skeleton relative aspect-[4/3] overflow-hidden rounded-sm transition-opacity',
                    active === i ? 'ring-2 ring-ember ring-offset-2 ring-offset-paper' : 'opacity-70 hover:opacity-100'
                  )}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="15vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* -------- Планировка -------- */}
      {tab === 'plan' && planImage && (
        <div role="tabpanel" aria-label="Планировка и состав помещений" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="skeleton relative aspect-[4/3] overflow-hidden rounded-sm border border-line bg-[#faf7f0]">
              <Image
                src={planImage}
                alt={`${name} — планировка, ${area} м²`}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-contain"
              />
            </div>
            <div className="rounded-sm border border-line bg-card p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-graphite-soft">
                Состав помещений
              </p>
              <ul className="mt-4 space-y-2.5">
                {features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 border-b border-line pb-2.5 text-[14px] leading-relaxed text-graphite/85 last:border-0"
                  >
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[12.5px] leading-relaxed text-graphite-soft">
                Планировку можно адаптировать под Ваш участок и образ жизни —
                обсудим на бесплатной консультации.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* -------- Комплектация -------- */}
      {tab === 'kit' && (
        <div role="tabpanel" aria-label="Комплектации и цены" className="mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            {prices.map((tier, i) => {
              const kitKey = i === 0 ? 'terra' : i === 1 ? 'optimum' : 'absolut';
              return (
                <div key={tier.label} className="flex flex-col rounded-sm border border-line bg-card p-6">
                  <p className="font-display text-[15px] text-oak">0{i + 1}</p>
                  <h3 className="mt-3 font-display text-[20px] font-medium leading-snug text-graphite">
                    {tier.label.replace(/Цена в ["«]?|Цена ["«]?|["»]/g, '')}
                  </h3>
                  <p className="mt-2 font-display text-[22px] font-semibold text-graphite">
                    {new Intl.NumberFormat('ru-RU').format(tier.amount)} ₽
                  </p>
                  <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-graphite-soft">
                    {i === 0 &&
                      'Надёжная основа дома: фундамент, несущая конструкция, кровля, окна и двери — под самостоятельную отделку.'}
                    {i === 1 &&
                      'Всё из «черновой» плюс внешняя отделка, электрика, вода и отопление: ровные стены под финальный декор.'}
                    {i === 2 &&
                      'Полностью готовый дом: потолки, полы, плитка, двери, сантехника — просто расставьте мебель.'}
                  </p>
                  <Link
                    href={`/komplektacii#${kitKey}`}
                    className="mt-5 inline-flex items-center gap-1.5 border-b border-graphite/25 pb-0.5 text-[13px] font-semibold text-graphite transition-colors hover:border-ember hover:text-ember"
                  >
                    Что входит подробно
                  </Link>
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-[13px] leading-relaxed text-graphite-soft">
            Термины «черновая», «предчистовая» и «под ключ» раскрыты на странице{' '}
            <Link
              href="/komplektacii"
              className="font-semibold text-graphite underline decoration-ember underline-offset-4 hover:text-ember"
            >
              «Комплектации»
            </Link>{' '}
            — честно и без сложных строительных терминов.
          </p>
        </div>
      )}
    </div>
  );
}
