import type { Metadata } from 'next';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { HomeQuiz } from '@/components/selection/HomeQuiz';
import { Reveal } from '@/components/layout/Reveal';
import { trustBullets, pagesMeta } from '@/content/site';
import { Check } from 'lucide-react';

export const metadata = {
  title: pagesMeta.selection.title,
  description: pagesMeta.selection.description,
};

export default function SelectionPage() {
  return (
    <>
      <section className="bg-paper-2/60 pt-14 pb-16 lg:pt-20 lg:pb-20" aria-label="Подбор дома">
        <div className="container-x">
          <SectionHeading
            eyebrow="Подбор"
            title={
              <>
                Подберём дом за 4 шага —{' '}
                <span className="italic text-pine">под Ваш участок и бюджет</span>
              </>
            }
            text="Ответьте на несколько вопросов — и мы подготовим персональное предложение со сметным расчётом и эскизным проектом. Это бесплатно и ни к чему не обязывает."
            align="center"
          />
          <Reveal delay={120} className="mx-auto mt-10 max-w-[860px]">
            <HomeQuiz />
          </Reveal>
        </div>
      </section>

      <section className="py-14 lg:py-18" aria-label="Что вы получите">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <SectionHeading
              eyebrow="Результат"
              title={
                <>
                  Что Вы получите{' '}
                  <span className="italic text-pine">после подбора</span>
                </>
              }
              text="Мы не навязываем одну технологию всем: подбираем дом под Ваши задачи, бюджет и участок, а затем предлагаем посмотреть качество вживую."
            />
            <ul className="space-y-4">
              {[
                'Персональный подбор технологии и комплектации',
                'Сметный расчёт и эскизный проект Вашего дома — бесплатно',
                'Консультация и выезд на участок',
                'Приглашение на производство и экскурсию на готовые объекты',
                ...trustBullets.slice(3, 6),
              ].map((t, i) => (
                <Reveal key={t} delay={i * 60} as="li" className="flex items-start gap-3 rounded-sm border border-line bg-card p-4.5 px-5">
                  <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-pine" strokeWidth={2.4} aria-hidden="true" />
                  <span className="text-[14.5px] leading-relaxed text-graphite/85">{t}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
