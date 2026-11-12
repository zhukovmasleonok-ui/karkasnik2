import type { Metadata } from 'next';
import { Phone, Mail, Clock, MapPin, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Reveal } from '@/components/layout/Reveal';
import { LeadForm } from '@/components/forms/LeadForm';
import { FinalCta } from '@/components/home/FinalCta';
import { company, cities, pagesMeta } from '@/content/site';

export const metadata = {
  title: pagesMeta.contacts.title,
  description: pagesMeta.contacts.description,
};

export default function ContactsPage() {
  return (
    <>
      <section className="pt-14 lg:pt-20" aria-label="Контакты">
        <div className="container-x">
          <SectionHeading
            eyebrow="Контакты"
            title={
              <>
                Давайте обсудим{' '}
                <span className="italic text-pine">Ваш будущий дом</span>
              </>
            }
            text="Позвоните, напишите или оставьте заявку — консультируем бесплатно, выезжаем на участок по всей территории Крыма."
          />

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div className="space-y-6">
              <Reveal className="grid gap-4 sm:grid-cols-2">
                <a
                  href={company.phoneHref}
                  className="group rounded-sm border border-line bg-card p-6 transition-colors hover:border-pine"
                >
                  <Phone className="h-5 w-5 text-oak" strokeWidth={1.8} aria-hidden="true" />
                  <p className="mt-3 text-[12px] uppercase tracking-[0.1em] text-graphite-soft">Телефон</p>
                  <p className="mt-1 font-display text-[19px] font-semibold text-graphite group-hover:text-pine">
                    {company.phone}
                  </p>
                </a>
                <a
                  href={`mailto:${company.email}`}
                  className="group rounded-sm border border-line bg-card p-6 transition-colors hover:border-pine"
                >
                  <Mail className="h-5 w-5 text-oak" strokeWidth={1.8} aria-hidden="true" />
                  <p className="mt-3 text-[12px] uppercase tracking-[0.1em] text-graphite-soft">Почта</p>
                  <p className="mt-1 break-all font-display text-[17px] font-semibold text-graphite group-hover:text-pine">
                    {company.email}
                  </p>
                </a>
                <div className="rounded-sm border border-line bg-card p-6">
                  <Clock className="h-5 w-5 text-oak" strokeWidth={1.8} aria-hidden="true" />
                  <p className="mt-3 text-[12px] uppercase tracking-[0.1em] text-graphite-soft">Режим работы</p>
                  <p className="mt-1 text-[15px] font-semibold text-graphite">{company.workHours}</p>
                </div>
                <div className="rounded-sm border border-line bg-card p-6">
                  <MapPin className="h-5 w-5 text-oak" strokeWidth={1.8} aria-hidden="true" />
                  <p className="mt-3 text-[12px] uppercase tracking-[0.1em] text-graphite-soft">Производство</p>
                  <p className="mt-1 text-[15px] font-semibold text-graphite">{company.productionBase}</p>
                  <p className="mt-1 text-[12px] text-graphite-soft">
                    Доставка включена в радиусе 100 км (бани до 6×6 м с мансардой — до 250 км)
                  </p>
                </div>
              </Reveal>

              <Reveal delay={100} className="rounded-sm border border-line bg-card p-6 sm:p-7">
                <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-graphite-soft">
                  География работ
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {cities.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-2/70 px-3.5 py-1.5 text-[13px] font-medium text-graphite/80"
                    >
                      <MapPin className="h-3 w-3 text-oak" aria-hidden="true" />
                      {c}
                    </span>
                  ))}
                  <span className="inline-flex items-center rounded-full border border-oak/40 bg-oak-soft/50 px-3.5 py-1.5 text-[13px] font-semibold text-[#7a5a33]">
                    + весь Крым
                  </span>
                </div>
                <p className="mt-4 text-[13.5px] leading-relaxed text-graphite-soft">
                  Работаем только своими бригадами по всей территории Республики Крым.
                </p>
              </Reveal>

              <Reveal delay={130} className="rounded-sm border border-line bg-card p-6 sm:p-7">
                <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-graphite-soft">
                  Реквизиты
                </p>
                <dl className="mt-4 space-y-2.5 text-[13.5px] leading-relaxed text-graphite/85">
                  <div className="flex justify-between gap-4">
                    <dt className="text-graphite-soft">ИНН</dt>
                    <dd className="font-semibold">{company.requisites.inn}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-graphite-soft">ОГРНИП</dt>
                    <dd className="font-semibold">{company.requisites.ogrnip}</dd>
                  </div>
                </dl>
              </Reveal>

              <Reveal delay={150} className="rounded-sm border border-line bg-card p-6 sm:p-7">
                <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-graphite-soft">
                  Социальные сети
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {company.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-line px-4 py-2.5 text-[13.5px] font-semibold text-graphite/85 transition-colors hover:border-pine hover:text-pine"
                    >
                      {s.label}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={120} className="rounded-sm border border-line bg-card p-6 shadow-[0_24px_70px_-45px_rgba(15,42,21,0.4)] sm:p-8 lg:sticky lg:top-28 lg:self-start">
              <h2 className="font-display text-[24px] font-semibold text-graphite">Написать нам</h2>
              <p className="mb-6 mt-2 text-[13.5px] leading-relaxed text-graphite-soft">
                Отвечаем в рабочее время. Для срочных вопросов звоните: {company.phone}
              </p>
              <LeadForm
                type="contact"
                source="contacts-page"
                submitLabel="Отправить сообщение"
                messageLabel="Сообщение"
                messagePlaceholder="Опишите Вашу задачу: участок, желаемая площадь, технология"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
