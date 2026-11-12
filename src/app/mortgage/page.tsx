import type { Metadata } from 'next';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Reveal } from '@/components/layout/Reveal';
import { CtaButton } from '@/components/forms/CtaButton';
import {
  ConstructionCalculator,
  MortgageCalculator,
} from '@/components/mortgage/Calculators';
import { FinalCta } from '@/components/home/FinalCta';
import { company, pagesMeta } from '@/content/site';
import { Landmark, FileCheck2, Gift, Percent } from 'lucide-react';

export const metadata = {
  title: pagesMeta.mortgage.title,
  description: pagesMeta.mortgage.description,
};

export default function MortgagePage() {
  const offers = [
    {
      icon: Landmark,
      title: 'Аккредитованы в банках',
      text: `Работаем с ведущими банками страны: ${company.bankPartners.join(', ')}.`,
    },
    {
      icon: FileCheck2,
      title: 'Материнский капитал',
      text: 'Принимаем материнский капитал в качестве оплаты при строительстве дома.',
    },
    {
      icon: Percent,
      title: 'Фиксация цены до 1 декабря',
      text: 'Заключаем договор и фиксируем стоимость — рост цен Вас не коснётся. Забудьте о росте цен!',
    },
    {
      icon: Gift,
      title: 'Гибкие условия оплаты',
      text: 'Гибкие условия оплаты и подарки в дом каждому клиенту.',
    },
  ];

  return (
    <>
      <section className="bg-paper-2/60 pt-14 lg:pt-20" aria-label="Ипотека и оплата">
        <div className="container-x">
          <SectionHeading
            eyebrow="Ипотека и оплата"
            title={
              <>
                Договор. Материнский капитал.{' '}
                <span className="italic text-pine">Ипотека</span>
              </>
            }
            text="Мечта о собственном доме не должна ждать: аккредитованы в Сбербанке, ВТБ и ДОМ.РФ, принимаем материнский капитал, предлагаем гибкие условия оплаты и фиксацию цены в договоре."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {offers.map((o, i) => (
              <Reveal key={o.title} delay={i * 70} className="rounded-sm border border-line bg-card p-5">
                <o.icon className="h-5 w-5 text-oak" strokeWidth={1.8} aria-hidden="true" />
                <p className="mt-3 font-display text-[17px] font-semibold text-graphite">{o.title}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-graphite-soft">{o.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-18" aria-label="Калькуляторы">
        <div className="container-x">
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <ConstructionCalculator />
            </Reveal>
            <Reveal delay={100}>
              <MortgageCalculator />
            </Reveal>
          </div>
          <Reveal delay={150} className="mt-10 flex flex-col items-start gap-4 rounded-sm border border-pine/25 bg-pine/5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[640px] text-[14.5px] leading-relaxed text-graphite/85">
              Нужна помощь с ипотекой? Оставьте заявку — подскажем по документам,
              программам банков и применению материнского капитала.
            </p>
            <CtaButton
              payload={{
                type: 'mortgage',
                title: 'Помощь с ипотекой',
                message: 'Нужна помощь с ипотекой / материнским капиталом',
              }}
              className="shrink-0"
            >
              Получить помощь с ипотекой
            </CtaButton>
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
