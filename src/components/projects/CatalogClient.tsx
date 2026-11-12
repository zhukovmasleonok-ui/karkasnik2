'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowUpRight, RotateCcw, SearchX } from 'lucide-react';
import { realProjects, type RealProject } from '@/content/projects';
import { cn } from '@/lib/utils';
import { asset } from '@/lib/paths';

/* ================= Villagio: глубокая фильтрация каталога =================
   Фильтры — часть дизайна: горизонтальная панель с тонкими линиями,
   микроподписи и текстовые чипы. Активный чип подсвечивается единственным
   акцентным цветом (EMBER), без заливки фона.
   Тип дома выводится из реальных данных (название + технология):
   А-фрейм и барнхаусы — по названию модели, остальные — по технологии.
=========================================================================== */

type FormKey = 'aframe' | 'barnhouse' | 'modular' | 'sip' | 'frame';

/** Какие «формы» применимы к проекту (проект может попасть в несколько) */
function formsOf(p: RealProject): FormKey[] {
  const forms = new Set<FormKey>();
  const name = p.name.toLowerCase();
  if (name.includes('а-фрейм') || name.includes('a-frame')) forms.add('aframe');
  if (name.includes('барнхаус')) forms.add('barnhouse');
  if (p.tech.includes('modular')) forms.add('modular');
  if (p.tech.includes('sip')) forms.add('sip');
  if (p.tech.includes('prefab')) forms.add('frame');
  return [...forms];
}

const formOptions: { key: FormKey; label: string }[] = [
  { key: 'aframe', label: 'А-фрейм' },
  { key: 'barnhouse', label: 'Барнхаус' },
  { key: 'modular', label: 'Модульный' },
  { key: 'sip', label: 'СИП-панельный' },
  { key: 'frame', label: 'Классический каркасный' },
];

const areaOptions = [
  { key: 'all', label: 'Любая', test: (_a: number) => true },
  { key: 's', label: 'до 40 м²', test: (a: number) => a <= 40 },
  { key: 'm', label: '40–80 м²', test: (a: number) => a > 40 && a <= 80 },
  { key: 'l', label: '80–120 м²', test: (a: number) => a > 80 && a <= 120 },
  { key: 'xl', label: 'от 120 м²', test: (a: number) => a > 120 },
];

const purposeOptions = [
  { key: 'all', label: 'Любое', test: (_k: RealProject['kind']) => true },
  { key: 'house', label: 'Для жизни и дачи', test: (k: RealProject['kind']) => k === 'house' },
  { key: 'bath', label: 'Баня', test: (k: RealProject['kind']) => k === 'bath' },
  { key: 'commercial', label: 'Коммерческий объект', test: (k: RealProject['kind']) => k === 'commercial' },
];

const budgetOptions = [
  { key: 'all', label: 'Любой', test: (_p: number) => true },
  { key: 'b1', label: 'до 1,5 млн ₽', test: (p: number) => p < 1_500_000 },
  { key: 'b2', label: '1,5–3 млн ₽', test: (p: number) => p >= 1_500_000 && p < 3_000_000 },
  { key: 'b3', label: '3–5 млн ₽', test: (p: number) => p >= 3_000_000 && p < 5_000_000 },
  { key: 'b4', label: 'от 5 млн ₽', test: (p: number) => p >= 5_000_000 },
];

/** Чип фильтра: текстовая кнопка, активное состояние — точечный акцент */
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'min-h-[38px] rounded-full border px-4 py-1.5 text-[13.5px] leading-tight transition-all duration-300',
        active
          ? 'border-ember/70 bg-transparent font-semibold text-ember'
          : 'border-line bg-transparent font-medium text-graphite/70 hover:border-graphite/40 hover:text-graphite'
      )}
    >
      {children}
    </button>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-line py-5 lg:flex-1 lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-graphite-soft">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

const fmt = new Intl.NumberFormat('ru-RU');

export function CatalogClient() {
  const [forms, setForms] = useState<FormKey[]>([]);
  const [area, setArea] = useState('all');
  const [purpose, setPurpose] = useState('all');
  const [budget, setBudget] = useState('all');

  const filtered = useMemo(() => {
    const aOpt = areaOptions.find((o) => o.key === area)!;
    const pOpt = purposeOptions.find((o) => o.key === purpose)!;
    const bOpt = budgetOptions.find((o) => o.key === budget)!;
    return realProjects.filter((p) => {
      if (forms.length > 0 && !forms.some((f) => formsOf(p).includes(f))) return false;
      if (!aOpt.test(p.area)) return false;
      if (!pOpt.test(p.kind)) return false;
      if (!bOpt.test(p.minPrice)) return false;
      return true;
    });
  }, [forms, area, purpose, budget]);

  const activeCount =
    (forms.length > 0 ? 1 : 0) +
    (area !== 'all' ? 1 : 0) +
    (purpose !== 'all' ? 1 : 0) +
    (budget !== 'all' ? 1 : 0);

  const reset = () => {
    setForms([]);
    setArea('all');
    setPurpose('all');
    setBudget('all');
  };

  const toggleForm = (k: FormKey) =>
    setForms((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  return (
    <>
      {/* ------- Горизонтальная панель фильтров: тонкие линии, без сайдбара ------- */}
      <form
        className="mt-12 border-y border-line"
        role="search"
        aria-label="Фильтры проектов"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          <FilterGroup label="Тип дома">
            {formOptions.map((o) => (
              <Chip key={o.key} active={forms.includes(o.key)} onClick={() => toggleForm(o.key)}>
                {o.label}
              </Chip>
            ))}
          </FilterGroup>
          <FilterGroup label="Площадь">
            {areaOptions.map((o) => (
              <Chip key={o.key} active={area === o.key} onClick={() => setArea(o.key)}>
                {o.label}
              </Chip>
            ))}
          </FilterGroup>
          <FilterGroup label="Назначение">
            {purposeOptions.map((o) => (
              <Chip key={o.key} active={purpose === o.key} onClick={() => setPurpose(o.key)}>
                {o.label}
              </Chip>
            ))}
          </FilterGroup>
          <FilterGroup label="Бюджет">
            {budgetOptions.map((o) => (
              <Chip key={o.key} active={budget === o.key} onClick={() => setBudget(o.key)}>
                {o.label}
              </Chip>
            ))}
          </FilterGroup>
        </div>

        <div className="flex items-center justify-between border-t border-line py-3.5">
          <p className="text-[13.5px] text-graphite-soft" role="status" aria-live="polite">
            {filtered.length === realProjects.length
              ? `Все ${realProjects.length} проектов`
              : (
                <>
                  Найдено:{' '}
                  <span className="font-semibold text-graphite">{filtered.length}</span>
                </>
              )}
          </p>
          <button
            type="button"
            onClick={reset}
            disabled={activeCount === 0}
            className={cn(
              'inline-flex items-center gap-2 text-[13.5px] font-semibold transition-colors',
              activeCount === 0
                ? 'cursor-default text-graphite-soft/50'
                : 'text-ember hover:underline underline-offset-4'
            )}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Сбросить{activeCount > 0 ? ` (${activeCount})` : ''}
          </button>
        </div>
      </form>

      {/* ------- Витрина результатов ------- */}
      {filtered.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-sm border border-dashed border-line px-6 py-20 text-center">
          <SearchX className="h-9 w-9 text-oak" strokeWidth={1.6} aria-hidden="true" />
          <p className="font-display text-2xl text-graphite">Под такой набор фильтров ничего нет</p>
          <p className="max-w-[440px] text-[14px] leading-relaxed text-graphite-soft">
            Мы реализуем и уникальные проекты — напишите нам, и мы спроектируем
            дом под Ваш участок и бюджет. А пока можно просто ослабить фильтры.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-2 min-h-[44px] rounded-sm border border-graphite/30 px-5 py-2.5 text-[14px] font-semibold text-graphite transition-colors hover:border-ember hover:text-ember"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="mt-10 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {filtered.map((p) => (
            <article key={p.slug} className="group">
              <Link href={`/projects/${p.slug}`} className="block">
                {/* Skeleton-шиммер под фото: пока грузится — спокойная текстура */}
                <div className="skeleton relative aspect-[4/3] overflow-hidden rounded-sm">
                  <Image
                    src={p.images[0] || asset('/images/project-sip.jpg')}
                    alt={p.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-graphite backdrop-blur-sm">
                    {formsOf(p)[0] === 'aframe'
                      ? 'А-фрейм'
                      : formsOf(p)[0] === 'barnhouse'
                        ? 'Барнхаус'
                        : p.techNames[0]}
                  </span>
                </div>
                <div className="mt-5 border-t border-line pt-4">
                  <h3 className="font-display text-[clamp(20px,2vw,24px)] font-medium leading-snug text-graphite">
                    {p.name}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] text-graphite-soft">
                    {p.area} м² · {p.techNames.join(' / ').toLowerCase()} ·{' '}
                    {p.kind === 'bath' ? 'баня' : p.kind === 'commercial' ? 'коммерческий' : 'дом'}
                  </p>
                  <div className="mt-3 flex items-baseline justify-between gap-3">
                    <p className="font-display text-[18px] font-semibold text-graphite">
                      от {fmt.format(p.minPrice)} ₽
                    </p>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-graphite transition-colors group-hover:border-ember group-hover:text-ember">
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}

      {/* Спокойное примечание под каталогом */}
      <p className="mt-14 max-w-[640px] border-t border-line pt-6 text-[13.5px] leading-relaxed text-graphite-soft">
        Все цены — с действующего прайса: у каждой модели три уровня готовности
        («черновая», «предчистовая», «под ключ»). Доставка включена в радиусе
        100 км от производственной базы в Симферополе. Сметный расчёт и эскизный
        проект — бесплатно.
      </p>
    </>
  );
}
