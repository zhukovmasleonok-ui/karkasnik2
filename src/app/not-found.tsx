import Link from 'next/link';
import { CtaButton } from '@/components/forms/CtaButton';

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center py-20">
      <div className="container-x max-w-[560px] text-center">
        <p className="font-display text-[clamp(56px,9vw,110px)] font-semibold leading-none text-pine/25">
          404
        </p>
        <h1 className="mt-4 font-display text-[30px] font-medium text-graphite">
          Такой страницы нет
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-graphite-soft">
          Возможно, ссылка устарела. Загляните в каталог проектов или вернитесь на
          главную — а мы поможем подобрать дом под Ваш участок и бюджет.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center rounded-sm bg-pine px-6 py-3.5 text-[15px] font-semibold text-[#f2ede2] transition-colors hover:bg-pine-deep"
          >
            На главную
          </Link>
          <CtaButton variant="outline" payload={{ type: 'consult', title: 'Получить консультацию' }}>
            Получить консультацию
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
