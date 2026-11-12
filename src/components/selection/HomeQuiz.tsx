'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Home } from 'lucide-react';
import { cities, technologies } from '@/content/site';
import { cn } from '@/lib/utils';

/**
 * Квиз подбора дома — по реальной воронке компании
 * («В каком городе вы планируете строительство?» и т.д.).
 * Отправка: POST /api/leads (type: quiz).
 */
export function HomeQuiz() {
  const [step, setStep] = useState(0); // 0..2 вопросы, 3 — контакты, 4 — готово
  const [city, setCity] = useState<string | null>(null);
  const [customCity, setCustomCity] = useState('');
  const [tech, setTech] = useState<string | null>(null);
  const [area, setArea] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState('');

  const chosenCity = city === 'custom' ? customCity.trim() : city;
  const chosenTech = technologies.find((t) => t.slug === tech)?.name ?? null;

  const steps = ['Город', 'Технология', 'Площадь и бюджет', 'Контакты'];
  const progress = Math.round(((step + (done ? 4 : 0)) / 4) * 100);

  function next() {
    const errs: Record<string, string> = {};
    if (step === 0 && !chosenCity) errs.city = 'Выберите город или укажите свой вариант';
    if (step === 1 && !tech) errs.tech = 'Выберите технологию';
    if (step === 2 && !area) errs.area = 'Выберите вариант';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setStep((s) => Math.min(s + 1, 3));
  }

  async function submit() {
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = 'Укажите имя';
    if (!/^[+]?[\d\s()\-]{10,18}$/.test(phone.trim())) errs.phone = 'Укажите корректный телефон';
    if (!consent) errs.consent = 'Необходимо согласие';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSending(true);
    setServerError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quiz',
          name: name.trim(),
          phone: phone.trim(),
          city: chosenCity ?? '',
          technology: chosenTech ?? '',
          area: area ?? '',
          source: 'quiz-selection',
          consent,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (data?.fieldErrors) setErrors(data.fieldErrors);
        setServerError(data?.error ?? 'Не удалось отправить. Попробуйте позвонить.');
        return;
      }
      setDone(true);
    } catch {
      setServerError('Проблема с соединением. Позвоните нам — поможем.');
    } finally {
      setSending(false);
    }
  }

  const optionCls = (active: boolean) =>
    cn(
      'flex w-full min-h-[56px] items-center justify-between gap-3 rounded-sm border px-5 py-3.5 text-left text-[15px] font-medium transition-all',
      active
        ? 'border-pine bg-pine text-[#f2ede2]'
        : 'border-line bg-card text-graphite/85 hover:border-pine/50 hover:bg-paper-2/60'
    );

  return (
    <div className="overflow-hidden rounded-sm border border-line bg-card shadow-[0_24px_70px_-40px_rgba(15,42,21,0.4)]">
      {/* Прогресс */}
      <div className="border-b border-line bg-paper-2/70 px-6 py-5 sm:px-9">
        <div className="flex items-center justify-between text-[12px] font-bold uppercase tracking-[0.16em] text-graphite-soft">
          <span className="flex items-center gap-2.5">
            <Home className="h-4 w-4 text-oak" aria-hidden="true" />
            Подбор дома за 4 шага
          </span>
          <span aria-hidden="true">
            {done ? 'Готово' : `Шаг ${step + 1} из 4`}
          </span>
        </div>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-pine transition-all duration-500"
            style={{ width: `${Math.max(progress, 6)}%` }}
          />
        </div>
        {!done && (
          <ol className="mt-3 hidden gap-4 text-[12px] font-semibold text-graphite-soft sm:flex">
            {steps.map((s, i) => (
              <li
                key={s}
                className={cn(
                  'flex items-center gap-1.5',
                  i < step && 'text-pine',
                  i === step && 'text-graphite'
                )}
              >
                {i < step ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-pine" aria-hidden="true" />
                ) : (
                  <span className={cn('h-1.5 w-1.5 rounded-full', i === step ? 'bg-oak' : 'bg-line')} />
                )}
                {s}
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="px-6 py-8 sm:px-9 sm:py-10">
        {done ? (
          <div className="flex flex-col items-center py-6 text-center" role="status" aria-live="polite">
            <CheckCircle2 className="h-12 w-12 text-pine" strokeWidth={1.5} />
            <h3 className="mt-4 font-display text-2xl font-semibold text-graphite">
              Заявка принята!
            </h3>
            <p className="mt-3 max-w-[440px] text-[14.5px] leading-relaxed text-graphite-soft">
              Спасибо{city ? `, ${name.trim()}` : ''}! Подготовим персональное предложение
              {chosenCity ? ` для строительства в городе ${chosenCity}` : ''}
              {chosenTech ? ` по технологии «${chosenTech}»` : ''} и перезвоним в рабочее
              время. Сметный расчёт и эскизный проект — бесплатно.
            </p>
            <button
              type="button"
              onClick={() => {
                setDone(false);
                setStep(0);
                setCity(null);
                setTech(null);
                setArea(null);
                setName('');
                setPhone('');
                setConsent(false);
              }}
              className="mt-6 min-h-[44px] rounded-sm border border-pine/50 px-5 py-2.5 text-[14px] font-semibold text-pine hover:bg-pine hover:text-[#f2ede2]"
            >
              Пройти подбор заново
            </button>
          </div>
        ) : step === 0 ? (
          <fieldset>
            <legend className="font-display text-[clamp(22px,3vw,30px)] font-medium text-graphite">
              В каком городе вы планируете строительство?
            </legend>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {cities.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCity(c)}
                  aria-pressed={city === c}
                  className={optionCls(city === c)}
                >
                  {c}
                  {city === c && <CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
                </button>
              ))}
              <div
                className={cn(
                  'flex min-h-[56px] items-center gap-2 rounded-sm border px-5 py-3.5 transition-all',
                  city === 'custom' ? 'border-pine bg-pine/5' : 'border-line bg-card'
                )}
              >
                <input
                  type="text"
                  value={customCity}
                  onFocus={() => setCity('custom')}
                  onChange={(e) => {
                    setCustomCity(e.target.value);
                    setCity('custom');
                  }}
                  placeholder="Ваш вариант"
                  aria-label="Свой вариант города"
                  className="w-full bg-transparent text-[15px] font-medium text-graphite placeholder:text-graphite-soft/60 focus:outline-none"
                  maxLength={60}
                />
                {city === 'custom' && <CheckCircle2 className="h-5 w-5 shrink-0 text-pine" aria-hidden="true" />}
              </div>
            </div>
            {errors.city && <p className="mt-3 text-[13px] text-destructive">{errors.city}</p>}
          </fieldset>
        ) : step === 1 ? (
          <fieldset>
            <legend className="font-display text-[clamp(22px,3vw,30px)] font-medium text-graphite">
              Какая технология Вам интересна?
            </legend>
            <p className="mt-2 text-[14px] text-graphite-soft">
              Не уверены? Выберите близкий вариант — на консультации подберём дом под Ваш
              участок, задачи и бюджет.
            </p>
            <div className="mt-6 grid gap-3">
              {technologies.map((t) => (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => setTech(t.slug)}
                  aria-pressed={tech === t.slug}
                  className={optionCls(tech === t.slug)}
                >
                  <span>
                    <span className="block">{t.name}</span>
                    <span className={cn('mt-0.5 block text-[12.5px] font-normal', tech === t.slug ? 'text-[#f2ede2]/80' : 'text-graphite-soft')}>
                      {t.priceFrom} · {t.term.toLowerCase()}
                    </span>
                  </span>
                  {tech === t.slug && <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />}
                </button>
              ))}
            </div>
            {errors.tech && <p className="mt-3 text-[13px] text-destructive">{errors.tech}</p>}
          </fieldset>
        ) : step === 2 ? (
          <fieldset>
            <legend className="font-display text-[clamp(22px,3vw,30px)] font-medium text-graphite">
              Какая площадь и бюджет Вам ближе?
            </legend>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { key: 's', title: 'Компактный — до 40 м²', note: 'от 1 180 000 ₽ (бани) / от 1 430 000 ₽ (дома)' },
                { key: 'm', title: 'Для семьи — 45–80 м²', note: 'от 1 500 000 ₽ («Лазурный Крым» 30 м²) до 3 000 000 ₽' },
                { key: 'l', title: 'Просторный — 80–130 м²', note: 'от 3 000 000 ₽ («Урбан Крым» 81 м²)' },
                { key: 'xl', title: 'Максимум — от 130 м²', note: 'от 4 450 000 ₽ («Тихая гавань» 112 м² + терраса)' },
              ].map((o) => (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => setArea(o.title)}
                  aria-pressed={area === o.title}
                  className={optionCls(area === o.title)}
                >
                  <span>
                    <span className="block">{o.title}</span>
                    <span className={cn('mt-0.5 block text-[12.5px] font-normal', area === o.title ? 'text-[#f2ede2]/80' : 'text-graphite-soft')}>
                      {o.note}
                    </span>
                  </span>
                  {area === o.title && <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />}
                </button>
              ))}
            </div>
            {errors.area && <p className="mt-3 text-[13px] text-destructive">{errors.area}</p>}
          </fieldset>
        ) : (
          <fieldset>
            <legend className="font-display text-[clamp(22px,3vw,30px)] font-medium text-graphite">
              Куда прислать персональное предложение?
            </legend>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="q-name" className="mb-1.5 block text-[13px] font-semibold text-graphite">
                  Ваше имя <span className="text-oak">*</span>
                </label>
                <input
                  id="q-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как к Вам обращаться"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  className="h-12 w-full rounded-sm border border-line bg-[#fffdf9] px-4 text-[15px] focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20"
                  maxLength={80}
                />
                {errors.name && <p className="mt-1 text-[12.5px] text-destructive">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="q-phone" className="mb-1.5 block text-[13px] font-semibold text-graphite">
                  Телефон <span className="text-oak">*</span>
                </label>
                <input
                  id="q-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                  className="h-12 w-full rounded-sm border border-line bg-[#fffdf9] px-4 text-[15px] focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20"
                  maxLength={18}
                />
                {errors.phone && <p className="mt-1 text-[12.5px] text-destructive">{errors.phone}</p>}
              </div>
            </div>
            <div className="mt-4">
              <div className="rounded-sm bg-paper-2/70 px-4 py-3 text-[13px] leading-relaxed text-graphite-soft">
                Ваш выбор: <span className="font-semibold text-graphite">{chosenCity || '—'}</span> ·{' '}
                <span className="font-semibold text-graphite">{chosenTech || '—'}</span> ·{' '}
                <span className="font-semibold text-graphite">{area || '—'}</span>
              </div>
            </div>
            <label className="mt-4 flex cursor-pointer items-start gap-3 text-[12.5px] leading-relaxed text-graphite-soft">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4.5 w-4.5 shrink-0 rounded-sm border-line accent-[#e86a33]"
              />
              <span>
                Согласен(на) на{' '}
                <a href="/privacy" target="_blank" className="text-pine underline underline-offset-2">
                  обработку персональных данных
                </a>
                . <span className="text-oak">*</span>
              </span>
            </label>
            {errors.consent && <p className="mt-1 text-[12.5px] text-destructive">{errors.consent}</p>}
            {serverError && (
              <p role="alert" className="mt-3 rounded-sm border border-destructive/30 bg-destructive/5 px-3 py-2 text-[13px] text-destructive">
                {serverError}
              </p>
            )}
          </fieldset>
        )}
      </div>

      {!done && (
        <div className="flex items-center justify-between border-t border-line bg-paper-2/50 px-6 py-4 sm:px-9">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-sm px-4 py-2.5 text-[14px] font-semibold text-graphite-soft transition-colors hover:text-graphite"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Назад
            </button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-sm bg-pine px-6 py-3 text-[15px] font-semibold text-[#f2ede2] transition-colors hover:bg-pine-deep"
            >
              Далее
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={sending}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-sm bg-oak px-6 py-3 text-[15px] font-semibold text-[#1c1408] transition-colors hover:bg-[#b98e5e] disabled:opacity-70"
            >
              {sending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {sending ? 'Отправляем…' : 'Получить предложение'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
