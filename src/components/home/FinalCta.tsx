import { Reveal } from '@/components/layout/Reveal';
import { LeadForm } from '@/components/forms/LeadForm';
import { company } from '@/content/site';

/**
 * Финальный блок: спокойное приглашение к разговору, а не агрессивный CTA.
 * Светлая «бумага», тонкие линии, телефон — главный элемент.
 */
export function FinalCta() {
  return (
    <section className="border-t border-line py-20 lg:py-28" aria-label="Связаться с нами">
      <div className="container-x grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Reveal>
          <p className="mb-4 flex items-center gap-3 text-[11.5px] font-bold uppercase tracking-[0.22em] text-graphite-soft">
            <span className="h-[1px] w-8 bg-oak/70" aria-hidden="true" />
            Первый шаг
          </p>
          <h2 className="text-balance font-display text-[clamp(30px,4.6vw,52px)] font-medium leading-[1.08] text-graphite">
            Начнём с разговора —{' '}
            <span className="italic text-oak">без обязательств</span>
          </h2>
          <p className="mt-6 max-w-[520px] text-pretty text-[16px] leading-relaxed text-graphite-soft">
            Сметный расчёт и эскизный проект Вашего дома — бесплатно. Расскажите
            об участке и задуманном доме: предложим варианты, честно ответим на
            вопросы.
          </p>
          <div className="mt-10 space-y-3 border-t border-line pt-8">
            <a
              href={company.phoneHref}
              className="block font-display text-[clamp(26px,3.4vw,40px)] font-medium text-graphite transition-colors hover:text-ember"
            >
              {company.phone}
            </a>
            <a
              href={`mailto:${company.email}`}
              className="block text-[15px] text-graphite-soft underline decoration-graphite/30 underline-offset-4 transition-colors hover:text-ember"
            >
              {company.email}
            </a>
            <p className="text-[13.5px] text-graphite-soft">{company.workHours}</p>
          </div>
        </Reveal>

        <Reveal delay={120} className="rounded-sm border border-line bg-card p-6 sm:p-8">
          <LeadForm
            type="consult"
            source="home-final"
            submitLabel="Оставить заявку"
            messagePlaceholder="Например: участок в Судаке, дом 60 м² под ключ"
          />
        </Reveal>
      </div>
    </section>
  );
}
