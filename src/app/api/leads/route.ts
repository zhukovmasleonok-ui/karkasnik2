import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

/**
 * ПРИЁМ ЗАЯВОК С САЙТА.
 *
 * ДЕМО-РЕЖИМ: заявка валидируется и сохраняется в SQLite (таблица Lead).
 * TODO: подключить реальную интеграцию — отправка в CRM (amoCRM/Битрикс24),
 * уведомление менеджеру в Telegram или на e-mail stroyat.krymchane@yandex.ru.
 * Место интеграции отмечено комментарием `TODO-INTEGRATION` ниже.
 */

const leadSchema = z.object({
  type: z
    .enum(['consult', 'callback', 'quiz', 'tour', 'contact', 'mortgage'])
    .default('consult'),
  name: z.string().trim().min(2, 'Укажите имя').max(80),
  phone: z
    .string()
    .trim()
    .regex(
      /^[+]?[\d\s()\-]{10,18}$/,
      'Укажите корректный номер телефона'
    ),
  email: z.string().trim().email('Некорректный e-mail').optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  city: z.string().trim().max(80).optional().or(z.literal('')),
  technology: z.string().trim().max(80).optional().or(z.literal('')),
  area: z.string().trim().max(80).optional().or(z.literal('')),
  source: z.string().trim().max(120).optional().or(z.literal('')),
  consent: z.literal(true, {
    message: 'Необходимо согласие на обработку персональных данных',
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? 'form');
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return NextResponse.json(
        { ok: false, error: 'Проверьте форму', fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const lead = await db.lead.create({
      data: {
        type: data.type,
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        message: data.message || null,
        city: data.city || null,
        technology: data.technology || null,
        area: data.area || null,
        source: data.source || null,
        consent: data.consent,
      },
    });

    // TODO-INTEGRATION: здесь отправлять заявку в CRM / Telegram / e-mail.
    // Пример: await notifyManager(lead)

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (e) {
    console.error('Lead API error', e);
    return NextResponse.json(
      { ok: false, error: 'Не удалось отправить заявку. Попробуйте позвонить нам.' },
      { status: 500 }
    );
  }
}
