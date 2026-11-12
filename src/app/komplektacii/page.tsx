import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Reveal } from '@/components/layout/Reveal';
import { FinalCta } from '@/components/home/FinalCta';
import { CtaButton } from '@/components/forms/CtaButton';
import { configurations } from '@/content/site';

export const metadata = {
  title: 'Комплектации домов: Терра, Оптимум, Абсолют | Строят Крымчане',
  description:
    'Три комплекта готовности дома: «Терра» (черновая), «Оптимум» (предчистовая), «Абсолют» (под ключ). Что входит в каждую комплектацию: фундамент, каркас, инженерные системы, чистовые работы.',
};

export default function KomplektaciiPage() {
  return (
    <>
      <section className="pt-14 lg:pt-20" aria-label="Комплектации">
        <div className="container-x">
          <SectionHeading
            eyebrow="Комплектации"
            title={
              <>
                Три уровня готовности —{' '}
                <span className="italic text-pine">от фундамента до мебели</span>
              </>
            }
            text="Выберите, за какой этап вы платите: надёжная основа «Терры», подготовленное к отделке «Оптимум» или полностью готовый «Абсолют». Один и тот же проект имеет три цены — сравнивайте в каталоге проектов."
          />
        </div>
      </section>

      <section className="mt-12 pb-16 lg:pb-20" aria-label="Три комплекта">
        <div className="container-x">
          <div className="grid gap-6 lg:grid-cols-3">
            {configurations.map((c, i) => (
              <Reveal
                key={c.slug}
                delay={i * 90}
                as="article"
                className={
                  'flex flex-col rounded-sm border p-7 ' +
                  (i === 2
                    ? 'border-pine bg-night text-[#f2ede2]'
                    : 'border-line bg-card')
                }
              >
                <p
                  className={
                    'text-[12px] font-bold uppercase tracking-[0.2em] ' +
                    (i === 2 ? 'text-[#c9b48a]' : 'text-oak')
                  }
                >
                  {c.n} · {c.name}
                </p>
                <h2
                  className={
                    'mt-3 font-display text-[22px] font-semibold leading-snug ' +
                    (i === 2 ? 'text-[#f2ede2]' : 'text-graphite')
                  }
                >
                  {c.tagline}
                </h2>
                <p
                  className={
                    'mt-3 flex-1 text-[14px] leading-relaxed ' +
                    (i === 2 ? 'text-[#e9e2d2]/85' : 'text-graphite-soft')
                  }
                >
                  {c.desc}
                </p>
                <ul className={'mt-5 space-y-2.5 border-t pt-5 ' + (i === 2 ? 'border-[#f2ede2]/15' : 'border-line')}>
                  {c.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-2.5">
                      <Check
                        className={'mt-0.5 h-4 w-4 shrink-0 ' + (i === 2 ? 'text-[#c9b48a]' : 'text-pine')}
                        strokeWidth={2.4}
                        aria-hidden="true"
                      />
                      <span
                        className={
                          'text-[13px] leading-relaxed ' +
                          (i === 2 ? 'text-[#e9e2d2]/85' : 'text-graphite/85')
                        }
                      >
                        {inc}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <CtaButton
                    variant={i === 2 ? 'outline-light' : 'outline'}
                    className="w-full"
                    payload={{
                      type: 'consult',
                      title: `Уточнить стоимость комплектации «${c.name}»`,
                      submitLabel: 'Узнать условия',
                      message: `Интересует комплектация «${c.name}»`,
                    }}
                  >
                    Узнать условия
                  </CtaButton>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-8 rounded-sm border border-line bg-card px-5 py-4 text-[13.5px] leading-relaxed text-graphite-soft">
            Один и тот же проект можно построить в любой из трёх комплектаций — цены на
            странице каждого проекта: «черновая», «предчистовая» и «под ключ».
            В стоимость уже входит доставка (в радиусе 100 км от производственной базы в
            г. Симферополь), сборка и проживание бригады. Для бань размером до 6×6 м с
            мансардой радиус доставки увеличен до 250 км.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-pine/30 bg-paper-2/60 p-6">
            <p className="max-w-[640px] text-[15px] leading-relaxed text-graphite">
              <span className="font-semibold text-graphite">Как выбрать?</span> Хотите
              сами управлять отделкой — «Терра». Хотите быстро переехать, но своими руками
              выбрать стиль — «Оптимум». Хотите просто заехать и жить — «Абсолют».
            </p>
            <Link
              href="/projects"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-sm bg-pine px-6 py-3 text-[15px] font-semibold text-[#f2ede2] transition-colors hover:bg-pine-deep"
            >
              Смотреть каталог проектов с ценами
              <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
