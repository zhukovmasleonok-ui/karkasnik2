import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/layout/Reveal';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { realProjects } from '@/content/projects';
import {
  manifesto,
  technologies,
  founder,
  productionSlides,
  myths,
  company,
  trustBullets,
  workSteps,
  faq,
} from '@/content/site';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/* ------------------- Философия «Дома с душой» — медленный атмосферный скролл ------------------- */

export function Manifesto() {
  return (
    <section id="filosofiya" className="scroll-mt-24 py-24 lg:py-36" aria-label="Философия компании">
      <div className="container-x">
        <SectionHeading
          eyebrow="Философия"
          title={
            <>
              Мы верим, что счастье живёт там, куда{' '}
              <span className="italic text-oak">вложена душа</span>
            </>
          }
        />

        {/* Большие паузы между мыслями — текст проявляется неспешно */}
        <div className="mt-16 max-w-[680px] space-y-12 lg:mt-24">
          {manifesto.paragraphs.slice(0, 4).map((p, i) => (
            <Reveal key={i} delay={i * 60}>
              <p className="text-pretty font-display text-[clamp(20px,2.4vw,28px)] font-medium leading-[1.35] text-graphite/90">
                {p}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Полноширинная пауза-фотография */}
        <Reveal className="mt-20 lg:mt-28">
          <figure>
            <div className="relative aspect-[16/9] overflow-hidden rounded-sm sm:aspect-[21/9]">
              <Image
                src="/images/family2.jpg"
                alt="Семья дома — семейный подход как внутренняя ценность компании"
                fill
                sizes="100vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <figcaption className="mt-3 text-[12.5px] text-graphite-soft">
              Дом — это место, где стены помнят тёплые объятия
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-20 grid gap-14 lg:mt-28 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div className="space-y-8 text-pretty text-[15.5px] leading-relaxed text-graphite-soft">
            {manifesto.paragraphs.slice(4).map((p, i) => (
              <Reveal key={i} delay={i * 50}>
                <p>{p}</p>
              </Reveal>
            ))}
            <Reveal>
              <div className="space-y-4">
                {manifesto.closing.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Финальный жест секции — крупный serif-станс */}
          <Reveal delay={120} className="lg:pt-6">
            <p className="border-l-2 border-ember/70 pl-6 font-display text-[clamp(26px,3.4vw,40px)] font-medium leading-[1.2] text-graphite">
              {manifesto.final}
            </p>
            <p className="mt-8 max-w-[420px] text-[14px] leading-relaxed text-graphite-soft">
              {manifesto.belief}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------- Основатель — журнальный разворот с цитатой ------------------- */

export function Founder() {
  return (
    <section className="border-y border-line bg-paper-2/50 py-24 lg:py-32" aria-label="Основатель компании">
      <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* Портрет с подписью — как в журнальном интервью */}
        <Reveal>
          <figure className="lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src={founder.image}
                alt={founder.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-3">
              <span className="text-[14px] font-semibold text-graphite">{founder.name}</span>
              <span className="text-right text-[12.5px] text-graphite-soft">{founder.role}</span>
            </figcaption>
          </figure>
        </Reveal>

        <div>
          <Reveal>
            <p className="mb-8 flex items-center gap-3 text-[11.5px] font-bold uppercase tracking-[0.22em] text-graphite-soft">
              <span className="h-[1px] w-8 bg-oak/70" aria-hidden="true" />
              Основатель
            </p>
            {/* Крупная цитата — сильная сторона сайта, человеческая история */}
            <blockquote className="text-balance font-display text-[clamp(30px,4.4vw,52px)] font-medium leading-[1.1] text-graphite">
              «{founder.quote}»
            </blockquote>
            <p className="mt-6 font-display text-[20px] italic text-graphite-soft">
              — {founder.name}
            </p>
          </Reveal>

          <div className="mt-12 columns-1 gap-10 text-pretty text-[15px] leading-relaxed text-graphite/85 sm:columns-2 [&>p]:mb-5">
            {founder.paragraphs.slice(0, 7).map((p, i) => (
              <Reveal key={i} delay={Math.min(i * 40, 160)}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={100} className="mt-8">
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 border-b border-graphite/30 pb-1 text-[14px] font-semibold text-graphite transition-colors hover:border-ember hover:text-ember"
            >
              Читать историю компании
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------- Технологии — спокойные строки-развоты ------------------- */

export function TechnologiesSection() {
  return (
    <section className="py-24 lg:py-32" aria-label="Технологии строительства">
      <div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Технологии"
            title={
              <>
                Разные технологии — под разные задачи{' '}
                <span className="italic text-oak">и формат жизни</span>
              </>
            }
            text="Не навязываем одну технологию всем. Подбираем дом под Ваш участок, задачи, бюджет и то, каким Вы видите свой будущий дом."
          />
          <Reveal delay={100} className="shrink-0">
            <Link
              href="/technologies"
              className="group inline-flex items-center gap-2 border-b border-graphite/30 pb-1 text-[14px] font-semibold text-graphite transition-colors hover:border-ember hover:text-ember"
            >
              Все технологии подробно
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        {/* Строки вместо карточек: номер, название, детали, фото */}
        <div className="mt-16 border-t border-line">
          {technologies.map((t, i) => (
            <Reveal key={t.slug} delay={i * 70} as="div" className="border-b border-line">
              <Link
                href={`/technologies#${t.slug}`}
                className="group grid items-center gap-6 py-8 transition-colors lg:grid-cols-[64px_1.1fr_1.3fr_260px] lg:gap-10 lg:py-10"
              >
                <p className="font-display text-[30px] font-medium leading-none text-oak/80">
                  0{i + 1}
                </p>
                <div>
                  <h3 className="font-display text-[clamp(24px,2.6vw,32px)] font-medium leading-tight text-graphite">
                    {t.name}
                  </h3>
                  <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-graphite-soft">
                    {t.priceFrom} · {t.term.replace(/^Срок.*—\s*/, '')}
                  </p>
                </div>
                <p className="text-pretty text-[14.5px] leading-relaxed text-graphite-soft">
                  {t.short}
                </p>
                <div className="relative aspect-[16/10] overflow-hidden rounded-sm lg:aspect-[4/3]">
                  <Image
                    src={t.image}
                    alt={t.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 260px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  {t.isDemoImage && (
                    <span className="demo-chip absolute right-3 top-3">демо-фото</span>
                  )}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------- Процесс строительства — горизонтальная галерея ------------------- */

export function ProcessGallery() {
  return (
    <section
      className="overflow-hidden border-y border-line bg-paper-2/50 py-24 lg:py-32"
      aria-label="Как строится дом"
    >
      <div className="container-x">
        <SectionHeading
          eyebrow="Процесс"
          title={
            <>
              От каркаса <span className="italic text-oak">до готового дома</span>
            </>
          }
          text="Пока на участке закладывается фундамент, дом уже рождается на производстве — в сухом отапливаемом цеху, под контролем наших бригад. Дальше — сборка как конструктор и отделка любой сложности."
        />
      </div>

      {/* Медленная горизонтальная лента: листается мышью и касанием.
          ВАЖНО: на слайдах со старого сайта текст запечён в само фото.
          Кадр показываем ЦЕЛИКОМ: пропорция 17/10 подобрана под реальные
          снимки (≈1.7:1), а object-contain гарантирует, что ни один край
          и ни одно слово внутри фото не срежутся. */}
      <Reveal delay={120} className="mt-14">
        <div className="scroll-x gap-5 px-5 sm:px-8 lg:gap-7" role="list" aria-label="Этапы строительства в фотографиях">
          {productionSlides.map((s, i) => (
            <figure
              key={s.image + i}
              role="listitem"
              className="group w-[300px] sm:w-[400px] lg:w-[500px]"
            >
              <div className="relative aspect-[17/10] overflow-hidden rounded-sm bg-paper-2/50">
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  sizes="(max-width: 640px) 80vw, 500px"
                  className="object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <span className="absolute left-4 top-4 rounded-full bg-night/75 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#f2ede2] backdrop-blur-sm">
                  {s.tag}
                </span>
              </div>
              <figcaption className="mt-4 border-t border-line pt-3">
                {/* overlayText запечён в самих фотографиях со старого сайта —
                    чтобы не дублировать, под фото только короткая подпись */}
                <p className="font-display text-[19px] font-medium text-graphite">{s.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>

      <div className="container-x mt-8">
        <p className="text-[13px] text-graphite-soft" aria-hidden="true">
          ← Листайте ленту — в ней вся наша работа
        </p>
      </div>
    </section>
  );
}

/* ------------------- Модели — спокойная горизонтальная витрина ------------------- */

const fmt = new Intl.NumberFormat('ru-RU');

export function ModelsStrip() {
  const shown = realProjects.slice(0, 8);
  return (
    <section className="overflow-hidden py-24 lg:py-32" aria-label="Модели домов">
      <div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Модели"
            title={
              <>
                27 проектов — от дачного домика{' '}
                <span className="italic text-oak">до семейной усадьбы</span>
              </>
            }
            text="Реальные модели с действующего прайса: честные площади и три уровня готовности — «черновая», «предчистовая» и «под ключ»."
          />
          <Reveal delay={100} className="shrink-0">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 border-b border-graphite/30 pb-1 text-[14px] font-semibold text-graphite transition-colors hover:border-ember hover:text-ember"
            >
              Открыть каталог с фильтрами
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </div>

      <Reveal delay={120} className="mt-14">
        <div className="scroll-x gap-5 px-5 sm:px-8 lg:gap-7" role="list" aria-label="Модели проектов">
          {shown.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              role="listitem"
              className="group w-[250px] sm:w-[300px] lg:w-[330px]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <Image
                  src={p.images[0] || '/images/project-sip.jpg'}
                  alt={p.imageAlt}
                  fill
                  sizes="(max-width: 640px) 75vw, 330px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 border-t border-line pt-3">
                <h3 className="font-display text-[20px] font-medium leading-snug text-graphite">
                  {p.name}
                </h3>
                <p className="mt-1.5 text-[13px] text-graphite-soft">
                  {p.area} м² · от {fmt.format(p.minPrice)} ₽ · {p.techNames[0].toLowerCase()}
                </p>
              </div>
            </Link>
          ))}

          {/* Финальная карточка-приглашение в каталог */}
          <Link
            href="/projects"
            role="listitem"
            className="group flex w-[250px] flex-col justify-between rounded-sm border border-line bg-paper-2/60 p-6 transition-colors hover:border-ember sm:w-[300px] lg:w-[330px]"
          >
            <p className="font-display text-[clamp(22px,2.2vw,28px)] font-medium leading-snug text-graphite">
              Все 27 моделей, фильтры и честные цены
            </p>
            <span className="mt-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-graphite/25 text-graphite transition-colors group-hover:border-ember group-hover:text-ember">
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------- Мифы о СИП и каркасных домах — спокойные карточки «Миф / Реальность» ------------------- */

export function Myths() {
  return (
    <section
      className="overflow-hidden border-y border-line bg-paper-2/50 py-24 lg:py-32"
      aria-label="Мифы о каркасных и СИП-панельных домах"
    >
      <div className="container-x">
        <SectionHeading
          eyebrow="Мифы и реальность"
          title={
            <>
              О каркасных и СИП-домах говорят{' '}
              <span className="italic text-oak">страшные истории</span>
            </>
          }
          text="Мы собрали семь самых частых мифов и отвечаем на них спокойно, по существу и без эмоций. Листайте карточки — каждая занимает полминуты."
        />
      </div>

      {/* Горизонтальная лента карточек: миф → реальность */}
      <Reveal delay={120} className="mt-14">
        <div className="scroll-x gap-5 px-5 sm:px-8 lg:gap-7" role="list" aria-label="Мифы о домах">
          {myths.map((m, i) => (
            <article
              key={m.myth}
              role="listitem"
              className="flex w-[300px] flex-col rounded-sm border border-line bg-card p-7 sm:w-[360px]"
            >
              <p className="font-display text-[15px] text-oak">0{i + 1}</p>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-graphite-soft">
                Миф
              </p>
              <h3 className="mt-1.5 font-display text-[clamp(22px,2.2vw,26px)] font-medium leading-tight text-graphite">
                «{m.myth}»
              </h3>
              <span className="my-5 h-px w-10 bg-ember/70" aria-hidden="true" />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-graphite-soft">
                Реальность
              </p>
              <p className="mt-2 flex-1 text-pretty text-[13.5px] leading-relaxed text-graphite/85">
                {m.truth}
              </p>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------- Доверие: банки + короткие факты ------------------- */

export function Trust() {
  return (
    <section className="py-24 lg:py-32" aria-label="Почему нам доверяют">
      <div className="container-x grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Доверие"
            title={
              <>
                Нам доверяют банки <span className="italic text-oak">и семьи Крыма</span>
              </>
            }
            text="Мы аккредитованы в ведущих банках страны — их проверка строже любой рекламы."
          />

          {/* Спокойная горизонтальная лента банков */}
          <Reveal delay={80} className="mt-12">
            <ul className="grid grid-cols-3 divide-x divide-line rounded-sm border border-line bg-card">
              {company.bankPartners.map((b) => (
                <li
                  key={b}
                  className="flex min-h-[86px] items-center justify-center px-3 py-5 text-center"
                >
                  <span className="font-display text-[clamp(17px,2vw,24px)] font-semibold tracking-wide text-graphite/85">
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Короткие факты вместо галочек */}
          <Reveal delay={140} className="mt-10">
            <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {trustBullets.map((b) => (
                <li key={b} className="flex items-start gap-3 border-t border-line pt-3">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden="true" />
                  <span className="text-[14px] leading-relaxed text-graphite/85">{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <figure>
            <Image
              src="/images/certificates.jpg"
              alt="Сертификаты соответствия системы добровольной сертификации компании"
              width={1280}
              height={372}
              className="w-full rounded-sm border border-line bg-[#faf7f0] object-cover"
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <figcaption className="mt-3 text-[12.5px] text-graphite-soft">
              Сертификаты соответствия системы добровольной сертификации
            </figcaption>
          </figure>
          <p className="mt-6 border-t border-line pt-4 text-[13.5px] leading-relaxed text-graphite-soft">
            Ипотека и материнский капитал — с документами поможем:{' '}
            <Link
              href="/mortgage"
              className="font-semibold text-graphite underline decoration-ember underline-offset-4 hover:text-ember"
            >
              подробно об оплате
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------- Этапы работы (используется на «Портфолио») ------------------- */

export function WorkSteps() {
  return (
    <section className="border-t border-line py-20 lg:py-24" aria-label="Этапы работы">
      <div className="container-x">
        <SectionHeading
          eyebrow="Как мы работаем"
          title={
            <>
              Шесть шагов — от участка{' '}
              <span className="italic text-oak">до заселения</span>
            </>
          }
        />
        <ol className="mt-12 border-t border-line">
          {workSteps.map((s, i) => (
            <Reveal
              key={s.n}
              delay={i * 50}
              as="li"
              className="grid gap-3 border-b border-line py-7 sm:grid-cols-[72px_260px_1fr] sm:items-baseline sm:gap-8"
            >
              <p className="font-display text-[30px] font-medium leading-none text-oak/80">{s.n}</p>
              <h3 className="font-display text-[19px] font-medium leading-snug text-graphite">{s.title}</h3>
              <p className="text-[14px] leading-relaxed text-graphite-soft">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------- FAQ ------------------- */

export function FaqSection() {
  return (
    <section className="border-t border-line py-24 lg:py-32" aria-label="Частые вопросы">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading
          eyebrow="Вопросы"
          title={
            <>
              Спрашивают <span className="italic text-oak">чаще всего</span>
            </>
          }
          text="Не нашли ответ? Позвоните нам или оставьте заявку — консультируем бесплатно, выезжаем на участок."
        />
        <Reveal delay={100}>
          <Accordion type="single" collapsible className="w-full">
            {faq.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-line">
                <AccordionTrigger className="py-5 text-left font-display text-[18px] font-medium text-graphite hover:text-ember [&>svg]:text-oak">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[14.5px] leading-relaxed text-graphite-soft">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
