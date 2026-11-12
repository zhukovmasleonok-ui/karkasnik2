import Image from 'next/image';
import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Reveal } from '@/components/layout/Reveal';
import { Manifesto } from '@/components/home/sections';
import { FinalCta } from '@/components/home/FinalCta';
import { founder, values, pagesMeta, company } from '@/content/site';

export const metadata = {
  title: pagesMeta.about.title,
  description: pagesMeta.about.description,
};

export default function AboutPage() {
  return (
    <>
      <section className="pt-14 lg:pt-20" aria-label="О компании">
        <div className="container-x">
          <SectionHeading
            eyebrow="О компании"
            title={
              <>
                Кто строит дом — тот строит счастье:{' '}
                <span className="italic text-pine">знакомьтесь</span>
              </>
            }
            text="«Строят Крымчане» — компания по деревянному домостроительству, созданная и успешно развивающаяся на территории Республики Крым."
          />

          <div className="mt-12 grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:gap-16">
            <Reveal>
              <div className="relative overflow-hidden rounded-sm">
                <Image
                  src={founder.image}
                  alt={founder.imageAlt}
                  width={412}
                  height={528}
                  className="w-full rounded-sm object-cover"
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div className="mt-5">
                <p className="font-display text-[22px] font-semibold text-graphite">{founder.name}</p>
                <p className="mt-1 text-[13.5px] text-graphite-soft">{founder.role}</p>
                <p className="mt-4 border-l-2 border-oak pl-4 font-display text-[17px] italic leading-relaxed text-pine-deep">
                  {founder.quote}
                </p>
              </div>
            </Reveal>

            <div>
              <div className="space-y-4 text-pretty text-[15.5px] leading-relaxed text-graphite/85">
                {founder.paragraphs.map((p, i) => (
                  <Reveal key={i} delay={Math.min(i * 40, 200)}>
                    <p>{p}</p>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={150} className="mt-8 rounded-sm border border-pine/25 bg-pine/5 p-6">
                <p className="font-display text-[19px] font-semibold text-pine-deep">
                  Наши главные ценности
                </p>
                <ul className="mt-3 space-y-2.5">
                  {['Честный диалог с клиентом', 'Качество выполненной работы'].map((v) => (
                    <li key={v} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-pine" strokeWidth={2.4} aria-hidden="true" />
                      <span className="text-[14.5px] leading-relaxed text-graphite/85">{v}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[13.5px] leading-relaxed text-graphite-soft">
                  Индивидуальный подход к каждому клиенту: учитывая все пожелания и имеющийся
                  бюджет, мы предлагаем разные варианты воплощения любых идей в реальность.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 border-y border-line bg-paper-2/60 py-16 lg:py-20" aria-label="Ценности">
        <div className="container-x">
          <SectionHeading
            eyebrow="Ценности"
            title={
              <>
                Семейный подход к делу —{' '}
                <span className="italic text-pine">настоящая внутренняя ценность</span>
              </>
            }
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 70} className="rounded-sm border border-line bg-card p-6">
                <p className="font-display text-[20px] font-semibold text-pine">{v.title}</p>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-graphite-soft">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Manifesto />

      <section className="border-t border-line py-16 lg:py-20" aria-label="Документы">
        <div className="container-x">
          <SectionHeading
            eyebrow="Документы"
            title={
              <>
                Сертификаты{' '}
                <span className="italic text-pine">и аккредитации</span>
              </>
            }
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <Reveal>
              <Image
                src="/images/certificates.jpg"
                alt="Сертификаты соответствия системы добровольной сертификации"
                width={1280}
                height={372}
                className="rounded-sm border border-line bg-white object-cover"
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <p className="mt-3 text-[12.5px] text-graphite-soft">
                Сертификаты соответствия системы добровольной сертификации
              </p>
            </Reveal>
            <Reveal delay={100}>
              <ul className="space-y-3">
                {[
                  'Сертификаты соответствия системы добровольной сертификации',
                  `Аккредитованы в ${company.bankPartners.join(', ')}`,
                  'Работаем по договору с фиксацией цены',
                  'Гарантия и сопровождение в эксплуатации',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 rounded-sm border border-line bg-card p-4.5 px-5">
                    <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-pine" strokeWidth={2.4} aria-hidden="true" />
                    <span className="text-[14px] leading-relaxed text-graphite/85">{t}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
