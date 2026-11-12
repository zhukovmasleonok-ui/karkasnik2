import Image from 'next/image';
import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Reveal } from '@/components/layout/Reveal';
import { CtaButton } from '@/components/forms/CtaButton';
import { FinalCta } from '@/components/home/FinalCta';
import { technologies, modularPrices, pagesMeta, myths } from '@/content/site';

export const metadata = {
  title: pagesMeta.technologies.title,
  description: pagesMeta.technologies.description,
};

export default function TechnologiesPage() {
  return (
    <>
      <section className="bg-paper-2/60 pt-14 lg:pt-20" aria-label="Технологии строительства">
        <div className="container-x">
          <SectionHeading
            eyebrow="Технологии"
            title={
              <>
                Разные технологии строительства — под разные задачи{' '}
                <span className="italic text-pine">и формат жизни</span>
              </>
            }
            text="Не навязываем одну технологию всем. Подбираем дом под Ваш участок, бюджет, сроки и то, каким Вы видите свой будущий дом. Честно рассказываем про состав панелей, каркаса и модулей — без сложных строительных терминов."
          />
          <Reveal delay={120} className="mt-8 flex flex-wrap gap-3 pb-12">
            {technologies.map((t) => (
              <a
                key={t.slug}
                href={`#${t.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-5 py-2.5 text-[13.5px] font-semibold text-graphite/85 transition-colors hover:border-pine hover:text-pine"
              >
                {t.name}
                <span className="text-oak" aria-hidden="true">↓</span>
              </a>
            ))}
          </Reveal>
        </div>
      </section>

      {technologies.map((t, idx) => (
        <section
          key={t.slug}
          id={t.slug}
          className={`scroll-mt-24 border-t border-line py-16 lg:py-24 ${idx % 2 === 1 ? 'bg-paper-2/60' : ''}`}
          aria-label={t.name}
        >
          <div className="container-x">
            <div className={`grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 ${idx % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <Reveal className="relative">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                  <Image
                    src={t.image}
                    alt={t.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                    loading="lazy"
                  />
                  {t.isDemoImage && <span className="demo-chip absolute right-4 top-4">демо-фото</span>}
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-sm border border-line bg-card p-5">
                    <p className="font-display text-[20px] font-semibold text-pine">{t.priceFrom}</p>
                    <p className="mt-1 text-[12.5px] leading-snug text-graphite-soft">{t.priceNote}</p>
                  </div>
                  <div className="rounded-sm border border-line bg-card p-5">
                    <p className="font-display text-[20px] font-semibold text-pine">{t.term.split('—')[1]?.trim() ?? t.term}</p>
                    <p className="mt-1 text-[12.5px] leading-snug text-graphite-soft">
                      {t.term.split('—')[0].trim()}
                    </p>
                  </div>
                </div>
              </Reveal>

              <div>
                <Reveal>
                  <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.22em] text-oak">
                    Технология {String(idx + 1).padStart(2, '0')}
                  </p>
                  <h2 className="text-balance font-display text-[clamp(26px,3.6vw,40px)] font-medium leading-[1.14] text-graphite">
                    {t.name}
                  </h2>
                  <p className="mt-4 text-[16px] font-medium leading-relaxed text-pine-deep">
                    {t.cardNote}
                  </p>
                </Reveal>
                <div className="mt-6 space-y-4 text-pretty text-[15px] leading-relaxed text-graphite/85">
                  {t.description.map((d, i) => (
                    <Reveal key={i} delay={i * 60}>
                      <p>{d}</p>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>

            <Reveal delay={100} className="mt-10">
              <h3 className="font-display text-[22px] font-semibold text-graphite">{t.advTitle}</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {t.features.map((f, i) => (
                  <Reveal key={f} delay={i * 40} as="li" className="flex items-start gap-3 rounded-sm border border-line bg-card p-4">
                    <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-pine" strokeWidth={2.4} aria-hidden="true" />
                    <span className="text-[13.5px] leading-relaxed text-graphite/85">{f}</span>
                  </Reveal>
                ))}
              </ul>
              <div className="mt-8">
                <CtaButton
                  payload={{
                    type: 'consult',
                    title: `Расчёт: ${t.name}`,
                    message: `Интересует: ${t.name}`,
                    submitLabel: 'Получить расчёт',
                  }}
                >
                  Получить расчёт — {t.name}
                </CtaButton>
              </div>
            </Reveal>

            {t.slug === 'modular' && (
              <Reveal delay={150} className="mt-12 overflow-hidden rounded-sm border border-line">
                <table className="w-full border-collapse text-left">
                  <caption className="sr-only">
                    Стоимость модульных домов «под ключ» — реальные цены из материалов компании
                  </caption>
                  <thead>
                    <tr className="bg-pine text-[#f2ede2]">
                      <th className="px-5 py-3.5 text-[13px] font-semibold uppercase tracking-[0.08em]">Площадь</th>
                      <th className="px-5 py-3.5 text-[13px] font-semibold uppercase tracking-[0.08em]">
                        Стоимость «под ключ»
                      </th>
                      <th className="px-5 py-3.5 text-[13px] font-semibold uppercase tracking-[0.08em]">Дополнительно</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modularPrices.map((r, i) => (
                      <tr key={r.area} className={`bg-card ${i % 2 === 1 ? 'bg-paper-2/60' : ''}`}>
                        <td className="px-5 py-3.5 text-[15px] font-semibold text-graphite">{r.area} м²</td>
                        <td className="px-5 py-3.5 text-[15px] font-semibold text-pine">
                          {new Intl.NumberFormat('ru-RU').format(r.price)} ₽
                        </td>
                        <td className="px-5 py-3.5 text-[13px] text-graphite-soft">+ фундамент и доставка</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="border-t border-line bg-oak-soft/30 px-5 py-3 text-[12.5px] leading-relaxed text-graphite-soft">
                  Фундамент (бетонные блоки или свайно-винтовой), доставка и подключение к
                  электроэнергии и водоснабжению оплачиваются отдельно. Комплектация и площадь дома
                  может быть изменена в соответствии с Вашими пожеланиями (от 15 до 90 м²).
                </p>
              </Reveal>
            )}
          </div>
        </section>
      ))}

      <section className="border-t border-line bg-paper-2/60 py-16 lg:py-24" aria-label="Мифы о СИП-панельных и каркасных домах">
        <div className="container-x">
          <SectionHeading
            eyebrow="Развеиваем мифы"
            title={
              <>
                Мифы о СИП-панельных и каркасных домах —{' '}
                <span className="italic text-pine">разбираем честно</span>
              </>
            }
            text="О каркасном и СИП-домостроении ходит много страшилок. Важно понимать: все они не соответствуют действительности и — результат недостатка информации или предвзятого отношения к технологиям. Отвечаем по фактам."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myths.map((m, i) => (
              <Reveal key={m.myth} delay={i * 40} className="rounded-sm border border-line bg-card p-6">
                <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-oak">
                  Миф {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 font-display text-[19px] font-semibold text-graphite">«{m.myth}»</h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-graphite/85">{m.truth}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
