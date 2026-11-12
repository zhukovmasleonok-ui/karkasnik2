'use client';

import { useMemo, useState } from 'react';
import { Calculator } from 'lucide-react';
import { costPerSqm, demoRates } from '@/content/site';
import { cn } from '@/lib/utils';

const fmt = new Intl.NumberFormat('ru-RU');

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-[13px] font-semibold text-graphite">
        <span>{label}</span>
        <span className="font-display text-[16px] font-semibold text-pine">
          {format ? format(value) : fmt.format(value)}
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-[#e86a33]"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
    </div>
  );
}

/* ---------- Калькулятор стоимости строительства ---------- */

export function ConstructionCalculator() {
  const [tech, setTech] = useState<'sip' | 'prefab' | 'modular'>('sip');
  const [area, setArea] = useState(60);
  const [config, setConfig] = useState(1.25); // комплектация: базовая 1.0 / с отделкой 1.25 / под ключ 1.45

  const price = useMemo(() => Math.round((costPerSqm[tech] * area * config) / 1000) * 1000, [tech, area, config]);

  const configs = [
    { key: 1.0, label: 'Базовая' },
    { key: 1.25, label: 'С отделкой' },
    { key: 1.45, label: '«Под ключ»' },
  ];

  return (
    <div className="rounded-sm border border-line bg-card p-6 sm:p-8" aria-label="Калькулятор стоимости строительства">
      <p className="flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.18em] text-graphite-soft">
        <Calculator className="h-4 w-4 text-oak" aria-hidden="true" />
        Калькулятор стоимости строительства
      </p>

      <div className="mt-6">
        <span className="mb-2 block text-[13px] font-semibold text-graphite">Технология</span>
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Технология">
          {(
            [
              { key: 'sip', label: 'СИП' },
              { key: 'prefab', label: 'Каркас' },
              { key: 'modular', label: 'Модуль' },
            ] as const
          ).map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => setTech(o.key)}
              aria-pressed={tech === o.key}
              className={cn(
                'min-h-[44px] rounded-sm border px-3 py-2.5 text-[13.5px] font-semibold transition-colors',
                tech === o.key
                  ? 'border-pine bg-pine text-[#f2ede2]'
                  : 'border-line text-graphite/75 hover:border-pine/50'
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <Slider
          id="calc-area"
          label="Площадь дома"
          value={area}
          min={15}
          max={120}
          step={5}
          onChange={setArea}
          format={(v) => `${v} м²`}
        />
        <div>
          <span className="mb-2 block text-[13px] font-semibold text-graphite">Комплектация</span>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Комплектация">
            {configs.map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => setConfig(o.key)}
                aria-pressed={config === o.key}
                className={cn(
                  'min-h-[44px] rounded-sm border px-3 py-2.5 text-[13.5px] font-semibold transition-colors',
                  config === o.key
                    ? 'border-oak bg-oak text-[#1c1408]'
                    : 'border-line text-graphite/75 hover:border-oak/60'
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7 rounded-sm bg-pine px-6 py-5 text-[#f2ede2]">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#f2ede2]/60">
          Ориентировочная стоимость
        </p>
        <p className="mt-1.5 font-display text-[clamp(24px,3.4vw,34px)] font-semibold" aria-live="polite">
          {fmt.format(price)} ₽
        </p>
        <p className="mt-1 text-[12.5px] text-[#f2ede2]/70">
          Расчёт от реальной базы цен компании. Фиксируем стоимость в договоре до 1 декабря.
        </p>
      </div>
    </div>
  );
}

/* ---------- Ипотечный калькулятор ---------- */

export function MortgageCalculator() {
  const [price, setPrice] = useState(2_000_000);
  const [downPct, setDownPct] = useState(20);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(demoRates.base);
  const [program, setProgram] = useState<'base' | 'family' | 'it'>('base');

  const down = Math.round((price * downPct) / 100);
  const loan = price - down;
  const monthly = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return Math.round(loan / n);
    return Math.round((loan * r) / (1 - Math.pow(1 + r, -n)));
  }, [loan, rate, years]);

  const programs = [
    { key: 'base' as const, label: 'Базовая', rate: demoRates.base },
    { key: 'family' as const, label: 'Семейная', rate: demoRates.family },
    { key: 'it' as const, label: 'IT-ипотека', rate: demoRates.it },
  ];

  return (
    <div className="rounded-sm border border-line bg-card p-6 sm:p-8" aria-label="Ипотечный калькулятор">
      <p className="flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.18em] text-graphite-soft">
        <Calculator className="h-4 w-4 text-oak" aria-hidden="true" />
        Ипотечный калькулятор
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2" role="group" aria-label="Программа ипотеки">
        {programs.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => {
              setProgram(o.key);
              setRate(o.rate);
            }}
            aria-pressed={program === o.key}
            className={cn(
              'min-h-[44px] rounded-sm border px-3 py-2.5 text-[13.5px] font-semibold transition-colors',
              program === o.key
                ? 'border-pine bg-pine text-[#f2ede2]'
                : 'border-line text-graphite/75 hover:border-pine/50'
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-6">
        <Slider
          id="m-price"
          label="Стоимость дома"
          value={price}
          min={650_000}
          max={8_000_000}
          step={50_000}
          onChange={setPrice}
          format={(v) => `${fmt.format(v)} ₽`}
        />
        <Slider
          id="m-down"
          label="Первоначальный взнос"
          value={downPct}
          min={10}
          max={80}
          step={5}
          onChange={setDownPct}
          format={(v) => `${v}% · ${fmt.format(Math.round((price * v) / 100))} ₽`}
        />
        <Slider
          id="m-years"
          label="Срок кредита"
          value={years}
          min={3}
          max={30}
          step={1}
          onChange={setYears}
          format={(v) => `${v} лет`}
        />
        <Slider
          id="m-rate"
          label="Ставка"
          value={rate}
          min={2}
          max={25}
          step={0.5}
          onChange={(v) => {
            setRate(v);
            setProgram('base');
          }}
          format={(v) => `${v.toLocaleString('ru-RU')} %`}
        />
      </div>

      <dl className="mt-7 grid grid-cols-2 gap-4" aria-live="polite">
        <div className="rounded-sm border border-line bg-paper-2/60 p-4">
          <dt className="text-[12px] uppercase tracking-[0.08em] text-graphite-soft">Сумма кредита</dt>
          <dd className="mt-1 font-display text-[19px] font-semibold text-graphite">{fmt.format(loan)} ₽</dd>
        </div>
        <div className="rounded-sm border border-pine/30 bg-pine/5 p-4">
          <dt className="text-[12px] uppercase tracking-[0.08em] text-graphite-soft">Платёж в месяц</dt>
          <dd className="mt-1 font-display text-[19px] font-semibold text-pine">{fmt.format(monthly)} ₽</dd>
        </div>
      </dl>
      <p className="mt-4 text-[12px] leading-relaxed text-graphite-soft">
        Расчёт предварительный. Ставки по умолчанию — демо-значения: уточняйте актуальные
        условия в банках. Мы аккредитованы в Сбербанке, ВТБ и ДОМ.РФ, принимаем материнский
        капитал.
      </p>
    </div>
  );
}
