'use client';

import { useEffect, useState, type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { LeadForm } from './LeadForm';

export type LeadDialogPayload = {
  type?: 'consult' | 'callback' | 'quiz' | 'tour' | 'contact' | 'mortgage';
  title?: string;
  subtitle?: string;
  message?: string;
  submitLabel?: string;
};

const EVENT = 'open-lead-dialog';

export function openLeadDialog(payload: LeadDialogPayload = {}) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<LeadDialogPayload>(EVENT, { detail: payload }));
  }
}

export function LeadDialog() {
  const [state, setState] = useState<(LeadDialogPayload & { open: boolean })>({ open: false });

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<LeadDialogPayload>).detail ?? {};
      setState({ ...detail, open: true });
    };
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  return (
    <Dialog open={state.open} onOpenChange={(open) => setState((s) => ({ ...s, open }))}>
      <DialogContent className="max-w-[460px] rounded-sm border-line bg-card p-0 sm:rounded-sm">
        <div className="max-h-[85vh] overflow-y-auto p-7">
          <DialogHeader className="text-left">
            <DialogTitle className="font-display text-2xl font-semibold text-graphite">
              {state.title ?? 'Оставить заявку'}
            </DialogTitle>
            <DialogDescription className="mt-1 text-[14px] leading-relaxed text-graphite-soft">
              {state.subtitle ??
                'Перезвоним в рабочее время и ответим на все вопросы. Сметный расчёт и эскизный проект — бесплатно.'}
            </DialogDescription>
          </DialogHeader>
          <LeadForm
            type={state.type ?? 'consult'}
            source={state.title ?? 'dialog'}
            submitLabel={state.submitLabel ?? 'Отправить заявку'}
            defaultMessage={state.message}
            className="mt-5"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Провайдер: один диалог на всё приложение */
export function LeadDialogProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <LeadDialog />
    </>
  );
}
