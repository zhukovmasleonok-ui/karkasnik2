import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Reveal } from '@/components/layout/Reveal';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { LeadForm } from '@/components/forms/LeadForm';
import { technologies, company } from '@/content/site';
import { realProjects } from '@/content/projects';
import { ProjectTabs } from '@/components/projects/ProjectTabs';

export function generateStaticParams() {
  return realProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = realProjects.find((x) => x.slug === slug);
  if (!p) return {};
  const fmt = new Intl.NumberFormat('ru-RU');
  return {
    title: `${p.name} — ${p.techNames.join(' / ')} ${p.area} м² | Строят Крымчане`,
    description: `${p.description[0]} Цена от ${fmt.format(p.minPrice)} ₽ (${p.prices
      .map((x) => `${fmt.format(x.amount)} ₽ — ${x.label}`)
      .join('; ')}). Сметный расчёт и эскизный проект бесплатно.`,
    openGraph: { images: [{ url: p.images[0] || '/images/project-sip.jpg' }] },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = realProjects.find((x) => x.slug === slug);
  if (!p) notFound();
  const fmt = new Intl.NumberFormat('ru-RU');
  const tech = technologies.find((t) => p.tech.includes(t.slug as never)) || technologies[0];
  const related = realProjects
    .filter((x) => x.slug !== p.slug && (x.tech.some((t) => p.tech.includes(t)) || x.sections.some((s) => p.sections.includes(s))))
    .slice(0, 3);

  const kindLabel = p.kind === 'bath' ? 'баня' : p.kind === 'commercial' ? 'коммерческий объект' : 'дом';

  return (
    <>
      <section className="pt-10 lg:pt-14" aria-label="Проект">
        <div className="container-x">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-graphite-soft transition-colors hover:text-ember"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Все проекты
          </Link>

          {/* Заголовок проекта — спокойный, журнальный */}
          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <h1 className="text-balance font-display text-[clamp(32px,4.8vw,54px)] font-medium leading-[1.06] text-graphite">
                {p.name}
              </h1>
              <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-graphite-soft">
                {p.area} м² · {p.techNames.join(' / ')} · {kindLabel}
              </p>
            </Reveal>
            <Reveal delay={80} className="shrink-0">
              <p className="font-display text-[clamp(22px,2.4vw,30px)] font-medium text-graphite">
                от {fmt.format(p.minPrice)}{' '}
                <span className="text-[0.72em] text-graphite-soft">₽</span>
              </p>
            </Reveal>
          </div>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.5fr_0.9fr] lg:gap-16">
            {/* Табы: фасады / планировка / комплектация */}
            <Reveal>
              <ProjectTabs
                name={p.name}
                images={p.images}
                imageAlt={p.imageAlt}
                area={p.area}
                features={p.features}
                prices={p.prices}
                slug={p.slug}
              />

              {/* Рассказ о проекте */}
              <div className="mt-12 space-y-5 border-t border-line pt-8 text-pretty text-[15.5px] leading-relaxed text-graphite/85">
                {p.description.map((d, i) => (
                  <p key={i}>{d}</p>
                ))}
              </div>
            </Reveal>

            {/* Спокойная боковая карточка: цены и разговор */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <Reveal delay={100} className="rounded-sm border border-line bg-card p-6 sm:p-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-graphite-soft">
                  Три уровня готовности
                </p>
                <div className="mt-5 space-y-0">
                  {p.prices.map((tier, i) => (
                    <div
                      key={tier.label}
                      className="flex items-baseline justify-between gap-3 border-b border-line py-3.5 first:pt-0 last:border-0"
                    >
                      <span className="text-[13.5px] leading-snug text-graphite/85">
                        {tier.label.replace(/Цена в ["«]?|Цена ["«]?|["»]/g, '')}
                      </span>
                      <span className="whitespace-nowrap font-display text-[17px] font-semibold text-graphite">
                        {fmt.format(tier.amount)} ₽
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[12.5px] leading-relaxed text-graphite-soft">
                  {company.deliveryRadius}
                </p>

                <div className="mt-6 border-t border-line pt-6">
                  <p className="mb-4 font-display text-[20px] font-medium leading-snug text-graphite">
                    Сметный расчёт по этой модели — бесплатно
                  </p>
                  <LeadForm
                    type="consult"
                    source={`project-${p.slug}`}
                    compact
                    withMessage={false}
                    defaultMessage={`Интересует проект «${p.name}» (${p.area} м²)`}
                    submitLabel="Оставить заявку"
                  />
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      {/* О технологии — спокойный разворот */}
      <section className="mt-20 border-t border-line py-20 lg:mt-28 lg:py-24" aria-label="О технологии проекта">
        <div className="container-x">
          <SectionHeading
            eyebrow="Технология"
            title={tech.name}
            text={tech.short}
          />
          <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {tech.features.slice(0, 6).map((f, i) => (
              <Reveal key={f} delay={i * 50} className="bg-card p-6">
                <span className="mt-[7px] mb-3 block h-1.5 w-1.5 rounded-full bg-ember" aria-hidden="true" />
                <p className="text-[14px] leading-relaxed text-graphite/85">{f}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={100} className="mt-8">
            <Link
              href={`/technologies#${tech.slug}`}
              className="group inline-flex items-center gap-2 border-b border-graphite/30 pb-1 text-[14px] font-semibold text-graphite transition-colors hover:border-ember hover:text-ember"
            >
              Подробнее о технологии
            </Link>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-paper-2/50 py-20 lg:py-24" aria-label="Похожие проекты">
          <div className="container-x">
            <SectionHeading
              eyebrow="Смотрите также"
              title={
                <>
                  Похожие <span className="italic text-oak">проекты</span>
                </>
              }
            />
            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <Reveal key={r.slug} delay={i * 60}>
                  <Link href={`/projects/${r.slug}`} className="group block">
                    <div className="skeleton relative aspect-[4/3] overflow-hidden rounded-sm">
                      <Image
                        src={r.images[0] || '/images/project-sip.jpg'}
                        alt={r.imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-4 border-t border-line pt-3">
                      <h3 className="font-display text-[20px] font-medium text-graphite">{r.name}</h3>
                      <p className="mt-1 text-[13px] text-graphite-soft">
                        {r.area} м² · от {fmt.format(r.minPrice)} ₽
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
