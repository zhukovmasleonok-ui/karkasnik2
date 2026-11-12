'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type LeadFormProps = {
  type: 'consult' | 'callback' | 'quiz' | 'tour' | 'contact' | 'mortgage';
  source: string;
  submitLabel?: string;
  defaultMessage?: string;
  withMessage?: boolean;
  messageLabel?: string;
  messagePlaceholder?: string;
  className?: string;
  compact?: boolean;
};

type FieldErrors = Record<string, string>;

const phoneMask = (v: string) => v;

export function LeadForm({
  type,
  source,
  submitLabel = 'Отправить заявку',
  defaultMessage,
  withMessage = true,
  messageLabel = 'Комментарий',
  messagePlaceholder = 'Например: участок в Судаке, дом 60 м²',
  className,
  compact = false,
}: LeadFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(defaultMessage ?? '');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: FieldErrors = {};
    if (name.trim().length < 2) errs.name = 'Укажите имя';
    if (!/^[+]?[\d\s()\-]{10,18}$/.test(phone.trim()))
      errs.phone = 'Укажите корректный телефон, например +7 (978) 123-45-67';
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim()))
      errs.email = 'Некорректный e-mail';
    if (!consent) errs.consent = 'Необходимо согласие на обработку данных';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('sending');
    setServerError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          message: message.trim(),
          source,
          consent,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (data?.fieldErrors) setErrors(data.fieldErrors);
        setServerError(data?.error ?? 'Не удалось отправить заявку');
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setServerError('Проблема с соединением. Позвоните нам — поможем.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        className={cn(
          'flex flex-col items-center gap-3 rounded-sm border border-pine/25 bg-pine/5 px-6 py-10 text-center',
          className
        )}
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="h-10 w-10 text-pine" strokeWidth={1.6} />
        <p className="font-display text-xl font-semibold text-graphite">Заявка отправлена</p>
        <p className="max-w-[300px] text-[14px] leading-relaxed text-graphite-soft">
          Спасибо! Мы свяжемся с Вами в рабочее время. Если вопрос срочный — позвоните нам.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-1 text-[13.5px] font-semibold text-pine underline underline-offset-4"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  const inputCls =
    'w-full rounded-sm border bg-[#faf7f0] px-4 py-3 text-[15px] text-graphite placeholder:text-graphite-soft/60 transition-colors focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/20 aria-[invalid=true]:border-destructive';

  return (
    <form onSubmit={onSubmit} className={cn('flex flex-col gap-4', className)} noValidate>
      <div>
        <label htmlFor={`${source}-name`} className="mb-1.5 block text-[13px] font-semibold text-graphite">
          Ваше имя <span className="text-oak">*</span>
        </label>
        <input
          id={`${source}-name`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Как к Вам обращаться"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? `${source}-name-err` : undefined}
          className={cn(inputCls, errors.name && 'border-destructive')}
          maxLength={80}
        />
        {errors.name && (
          <p id={`${source}-name-err`} className="mt-1 text-[12.5px] text-destructive">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${source}-phone`} className="mb-1.5 block text-[13px] font-semibold text-graphite">
          Телефон <span className="text-oak">*</span>
        </label>
        <input
          id={`${source}-phone`}
          type="tel"
          value={phone}
          onChange={(e) => setPhone(phoneMask(e.target.value))}
          placeholder="+7 (___) ___-__-__"
          autoComplete="tel"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? `${source}-phone-err` : undefined}
          className={cn(inputCls, errors.phone && 'border-destructive')}
          maxLength={18}
        />
        {errors.phone && (
          <p id={`${source}-phone-err`} className="mt-1 text-[12.5px] text-destructive">
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${source}-email`} className="mb-1.5 block text-[13px] font-semibold text-graphite">
          E-mail <span className="font-normal text-graphite-soft">(по желанию)</span>
        </label>
        <input
          id={`${source}-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="для отправки расчёта"
          autoComplete="email"
          aria-invalid={!!errors.email}
          className={cn(inputCls, errors.email && 'border-destructive')}
          maxLength={80}
        />
        {errors.email && <p className="mt-1 text-[12.5px] text-destructive">{errors.email}</p>}
      </div>

      {withMessage && !compact && (
        <div>
          <label htmlFor={`${source}-msg`} className="mb-1.5 block text-[13px] font-semibold text-graphite">
            {messageLabel}
          </label>
          <textarea
            id={`${source}-msg`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={messagePlaceholder}
            rows={3}
            className={cn(inputCls, 'resize-none')}
            maxLength={2000}
          />
        </div>
      )}

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[12.5px] leading-relaxed text-graphite-soft">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={!!errors.consent}
            className="mt-0.5 h-4.5 w-4.5 shrink-0 rounded-sm border-line accent-[#e86a33]"
          />
          <span>
            Согласен(на) на{' '}
            <a href="/privacy" className="text-pine underline underline-offset-2" target="_blank">
              обработку персональных данных
            </a>{' '}
            в соответствии с{' '}
            <a href="/privacy" className="text-pine underline underline-offset-2" target="_blank">
              политикой конфиденциальности
            </a>
            . <span className="text-oak">*</span>
          </span>
        </label>
        {errors.consent && (
          <p className="mt-1 text-[12.5px] text-destructive">{errors.consent}</p>
        )}
      </div>

      {serverError && (
        <p role="alert" className="rounded-sm border border-destructive/30 bg-destructive/5 px-3 py-2 text-[13px] text-destructive">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-1 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-sm bg-pine px-6 py-3.5 text-[15px] font-semibold text-paper transition-colors hover:bg-pine-deep disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'sending' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {status === 'sending' ? 'Отправляем…' : submitLabel}
      </button>
    </form>
  );
}
