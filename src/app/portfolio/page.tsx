import Image from 'next/image';
import type { Metadata } from 'next';
import { MapPin, Quote, ExternalLink } from 'lucide-react';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Reveal } from '@/components/layout/Reveal';
import { CtaButton } from '@/components/forms/CtaButton';
import { WorkSteps } from '@/components/home/sections';
import { FinalCta } from '@/components/home/FinalCta';
import { productionSlides } from '@/content/site';
import { realObjects } from '@/content/portfolio';

export const metadata = {
  title: 'Построенные объекты и отзывы заказчиков | Строят Крымчане',
  description:
    'Реальные построенные объекты в Ялте, Керчи, Севастополе, Черноморском и других городах Крыма — с фото и отзывами заказчиков. Экскурсии на готовые объекты и производство.',
};

export default function PortfolioPage() {
  const withReviews = realObjects.filter((o) => o.review);
  return (
    <>
      <section className="pt-14 lg:pt-20" aria-label="Портфолио">
        <div className="container-x">
          <SectionHeading
            eyebrow="Портфолио"
            title={
              <>
                Построенные объекты —{' '}
                <span className="italic text-pine">в разных городах Крыма</span>
              </>
            }
            text="СИП-панельные и каркасные дома, модули «Префаб», надстройки и пристройки — от «черновой» отделки до «под ключ». Информация актуальна на 2026 год. Приглашаем на экскурсии на готовые объекты — лучше один раз увидеть."
          />
        </div>
      </section>

      {/* id="obekty" — якорь для меток на карте географии (главная) */}
      <section id="obekty" className="mt-12 scroll-mt-24 pb-4" aria-label="Реальные объекты">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-2">
            {realObjects.map((o, i) => (
              <Reveal
                key={o.title}
                delay={(i % 2) * 80}
                as="article"
                id={`obj-${i + 1}`}
                className="flex flex-col scroll-mt-28 overflow-hidden rounded-sm border border-line bg-card transition-shadow duration-500 hover:shadow-[0_20px_50px_-24px_rgba(15,42,21,0.35)]"
              >
                {o.image && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={o.image}
                      alt={o.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                      loading="lazy"
                    />
                    {o.location && (
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-sm bg-[#f2ede2]/95 px-2.5 py-1.5 text-[11.5px] font-bold text-pine-deep">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        {o.location}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-balance font-display text-[19px] font-semibold leading-snug text-graphite">
                    {o.title}
                  </h3>
                  {o.tags.length > 0 && (
                    <p className="mt-2 flex flex-wrap gap-1.5">
                      {o.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-oak/40 bg-oak-soft/50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[#7a5a33]"
                        >
                          {t}
                        </span>
                      ))}
                    </p>
                  )}
                  {o.review && (
                    <figure className="mt-4 rounded-sm bg-paper-2/70 p-4">
                      <Quote className="h-4 w-4 text-oak" aria-hidden="true" />
                      <blockquote className="mt-1.5 line-clamp-4 text-[13.5px] leading-relaxed text-graphite/85">
                        {o.review.text}
                      </blockquote>
                      <figcaption className="mt-2.5 text-[12.5px] font-semibold text-graphite">
                        {o.review.author || 'Заказчик'}
                        <span className="ml-1.5 font-normal text-graphite-soft">
                          · отзыв с Авито
                        </span>
                      </figcaption>
                    </figure>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {withReviews.length > 0 && (
        <section className="py-16 lg:py-20" aria-label="Отзывы заказчиков">
          <div className="container-x">
            <SectionHeading
              eyebrow="Отзывы"
              title={
                <>
                  Что говорят <span className="italic text-pine">заказчики</span>
                </>
              }
              text="Настоящие отзывы с площадок-источников (Авито и др.) по нашим построенным объектам."
            />
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {withReviews.map((o, i) => (
                <Reveal
                  key={o.title + o.review?.author}
                  delay={(i % 3) * 70}
                  as="figure"
                  className="flex flex-col rounded-sm border border-line bg-card p-6"
                >
                  <blockquote className="flex-1 text-[14px] leading-relaxed text-graphite/85">
                    «{o.review!.text.slice(0, 320)}
                    {o.review!.text.length > 320 ? '…' : ''}»
                  </blockquote>
                  <figcaption className="mt-4 border-t border-line pt-4 text-[13.5px] font-semibold text-graphite">
                    {o.review!.author || 'Заказчик'}
                    <span className="mt-0.5 flex items-center gap-1 text-[12px] font-normal text-graphite-soft">
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      {o.review!.source} · объект: {o.location || 'Крым'}
                    </span>
                  </figcaption>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pb-16 lg:pb-20" aria-label="Производство">
        <div className="container-x">
          <SectionHeading
            eyebrow="Производство"
            title={
              <>
                Как мы <span className="italic text-pine">строим</span>
              </>
            }
            text="Фотографии с наших площадок и производства: каркасы камерной сушки, монтаж «Префаб», дома на сложных участках и отделка «под ключ»."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {productionSlides.map((w, i) => (
              <Reveal
                key={w.image + w.caption}
                delay={(i % 3) * 80}
                as="figure"
                className="group overflow-hidden rounded-sm border border-line bg-card"
              >
                {/* Кадры со старого сайта содержат текст внутри фото —
                    показываем целиком: пропорция под реальный снимок + contain */}
                <div className="relative aspect-[17/10] overflow-hidden bg-paper-2/60">
                  <Image
                    src={w.image}
                    alt={w.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <figcaption className="flex items-start justify-between gap-3 p-5">
                  <div>
                    <p className="font-display text-[17px] font-semibold text-graphite">{w.caption}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-graphite-soft">{w.overlayText}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-oak/40 bg-oak-soft/50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#7a5a33]">
                    {w.tag}
                  </span>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WorkSteps />

      <section className="pb-16 lg:pb-20" aria-label="Экскурсии">
        <div className="container-x">
          <div className="grid gap-8 rounded-sm border border-oak/35 bg-oak-soft/35 p-7 lg:grid-cols-[1.3fr_0.7fr] lg:items-center lg:p-10">
            <SectionHeading
              title={
                <>
                  Экскурсии на производство{' '}
                  <span className="italic text-pine">и готовые объекты</span>
                </>
              }
              text="Приглашаем на производство и проводим экскурсии на строящихся или готовых объектах, чтобы Вы могли оценить качество и задать интересующие вопросы. Консультируем, выезжаем на участок, предоставляем сметный расчёт и эскизный проект бесплатно."
            />
            <CtaButton
              variant="ink"
              className="w-full lg:w-auto"
              payload={{
                type: 'tour',
                title: 'Записаться на экскурсию',
                submitLabel: 'Записаться',
                message: 'Хочу на экскурсию на объект',
              }}
            >
              Записаться на экскурсию
            </CtaButton>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
