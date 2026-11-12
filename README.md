# Сайт застройщика «Строят Крымчане»

Премиальный корпоративный сайт строительной компании в спокойной землистой стилистике (Kōzōwood): тёплая кремовая «бумага» `#F2EDE2`, светлый песок `#E9E2D2`, глубокий графитово-коричневый текст `#2C2620`, детали — мох `#6F7A58` и глина `#B3876A`. Единственный точечный акцент (ARDENA) — тёплый оранжевый `#E86A33`. Шрифты с кириллицей лежат локально в `public/fonts/`: Cormorant (заголовки) + Manrope (текст).

## Стек

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4, дизайн-токены в `src/app/globals.css`
- Prisma + SQLite (`db/custom.db`, модель `Lead`)
- shadcn/ui, lucide-react, sonner

## Как запустить

```bash
npm install          # если зависимости ещё не стоят
npm run build        # production-сборка (standalone + копирование статики)
npm start            # сервер на :3000
# разработка: npm run dev
```

База данных: `npm run db:push` (Prisma-схема уже готова, файл БД `db/custom.db` существует).

## Деплой через GitHub Actions (автоматический)

В репозитории лежит готовый workflow `.github/workflows/deploy.yml`:
push в `main` → GitHub сам собирает standalone-бандл → заливает на сервер по SSH →
применяет схему БД (данные заявок не трогаются) → перезапускает pm2 → проверяет HTTP 200.
На pull-запросы и ручной запуск (вкладка Actions → Run workflow) работает только сборка-проверка.

### 1. Залить проект на GitHub

```bash
# распакуйте архив, зайдите в папку, затем:
git init -b main
git add .
git commit -m "Сайт «Строят Крымчане»"
git remote add origin git@github.com:ВАШ_ЛОГИН/stryat-krymchane.git
git push -u origin main
```

База данных (`db/*.db`) и `.env` в git не попадают — это правильные исключения в `.gitignore`.

### 2. Одноразовая подготовка сервера

```bash
# на сервере (Ubuntu/Debian):
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs
sudo npm i -g pm2 && pm2 startup      # автозапуск pm2 после ребута
sudo mkdir -p /opt/stryat && sudo chown $USER /opt/stryat
mkdir -p /opt/stryat/db
echo 'DATABASE_URL=file:/opt/stryat/db/custom.db' > /opt/stryat/.env
# доступ по ключу (если ещё не настроен):
ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519   # на вашем компьютере
ssh-copy-id user@server                            # положить публичный ключ на сервер
```

Проксирование на 80/443 + HTTPS — через Caddy (пример в `Caddyfile`) или Nginx + certbot.

### 3. Секреты в GitHub

`Settings → Secrets and variables → Actions → New repository secret`:

| Секрет | Значение |
| --- | --- |
| `SSH_HOST` | IP или домен сервера |
| `SSH_USER` | SSH-пользователь |
| `SSH_PRIVATE_KEY` | приватный ключ целиком (включая `BEGIN/END`) |

SSH не на 22 порту — раскомментируйте строки `port:` в workflow.

### 4. Деплой

```bash
git add . && git commit -m "обновление" && git push   # → Actions соберёт и задеплоит сам
```

Ход выполнения — во вкладке **Actions** репозитория. Откат: на сервере
`cd /opt/stryat && rm -rf current && mv old current && pm2 restart stryat`.

**Альтернатива без Actions:** Vercel — импортировать репозиторий на vercel.com,
команда сборки `npm run build`; но SQLite-заявки тогда лучше вынести на VPS-вариант
или Turso/Postgres.

## Деплой на сервер вручную (VPS)

Требования: Node.js 20+ (или Bun 1.1+), 1 ГБ RAM достаточно.

```bash
# 1. Распаковать архив и зайти в папку проекта
npm ci               # или npm install / bun install
npx prisma generate  # клиент Prisma
npm run db:push      # создать/синхронизировать SQLite (файл db/custom.db)
npm run build        # сборка: Next standalone + статика копируются автоматически

# 2. Запуск (standalone-сервер не требует node_modules)
NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 node .next/standalone/server.js
```

Рекомендуется держать процесс под pm2/systemd и проксировать через Nginx/Caddy
на 80/443 с HTTPS-сертификатом (certbot). Пример Caddy-конфига — файл `Caddyfile`.

**Деплой на Vercel** (альтернатива): импортировать репозиторий, команда build —
`npm run build`, Vercel сам выставит `next start`; SQLite заменить на Turso/Postgres
или оставить файловую БД на VPS-варианте.

После переноса на боевой домен проверить `metadataBase` в `src/app/layout.tsx`
(сейчас — `https://строяткрымчане.рф` в punycode: `xn--80aknigcncfkc7d8byc.xn--p1ai`)
и то же значение в `src/app/sitemap.ts`.

## Структура

```
src/
  app/                 страницы: /, technologies, projects, projects/[slug],
                       selection (квиз), portfolio, about, mortgage, contacts,
                       privacy + API /api/leads, sitemap, robots
  content/site.ts      ЕДИНЫЙ источник контента: факты, цены, тексты, nav
  components/
    layout/            Header, Footer, Logo, SectionHeading, Reveal, Gallery
    home/              Hero, sections (манифест, технологии, доверие…), FinalCta
    projects/          CatalogClient (фильтры + слайдер бюджета)
    selection/         HomeQuiz — «Подбор дома за 4 шага»
    mortgage/          Calculators — стоимость стройки + ипотечный
    forms/             LeadForm, LeadDialog, CtaButton
```

Все факты (телефон, email, основатель, цены, сроки, банки, спецусловия, тексты манифеста) собраны в `src/content/site.ts` — правки контента делаются только там.

## Перенос со старого сайта (строяткрымчане.рф)

Вся информация со старого сайта перенесена в новый дизайн:

- **Каталог «Проекты»** — 27 реальных моделей (`src/content/projects.ts`): названия, площади, состав помещений, описания, фото с объекта. У каждой модели три цены — «черновая» / «предчистовая» / «под ключ» (acf-поля WooCommerce старого сайта).
- **«Портфолио»** — 13 построенных объектов в Ялте, Керчи, Севастополе, Орловке, Черноморском, Каменском, Любимовке + 10 дословных отзывов заказчиков с Авито (`src/content/portfolio.ts`).
- **«Комплектации»** (`/komplektacii`) — Терра («черновая»), Оптимум («предчистовая»), Абсолют («под ключ») с полными списками работ.
- **Контакты**: ИНН 920250180716, ОГРНИП 325920000005113, производственная база — Симферополь, доставка 100 км (бани — 250 км), реальные соцсети vk.com/drevo_krym_stroy и t.me/drevo_krym_stroy.
- **Логотип** — оригинальный PNG со старого сайта (`public/images/logo-white.png`, `logo-footer.png`).
- **Карта географии** — 3D-рельеф Крыма с оригинала старого сайта (`public/images/karta-geografiya.png`) + 13 круглых меток-фото реальных объектов (`src/components/home/GeographyMap.tsx`); клик по метке ведёт на карточку объекта в «Портфолио» (`/portfolio#obj-N`).
- Категория «Бани» и «Коммерческие» объекты — фильтр «Тип постройки» в каталоге.
- Отзывы на старом сайте (/reviews) были шаблонными заглушками темы WordPress — НЕ перенесены; на новом сайте отзывы только реальные, из портфолио.

## Что уже работает

- Все страницы и ссылки, мобильное меню, SEO-мета + OG, sitemap.xml, robots.txt
- Квиз «за 4 шага»: город → технология → бюджет → контакты; заявка пишется в БД (таблица `Lead`, поля name/phone/email/city/technology/area/source/consent)
- Формы с валидацией имени и телефона + обязательное согласие на обработку данных
- Калькуляторы ипотеки и стоимости, фильтры каталога
- Заявки смотреть: `sqlite db/custom.db` / Prisma Studio (`npx prisma studio`)

## Что подключить при переносе на боевой домен (TODO)

1. **Уведомления о заявках** — сейчас лиды только в БД. Подключить Telegram-бот или e-mail (webhook в `src/app/api/leads/route.ts`).
2. **Реальные фото объектов** — часть визуалов (`project-*.jpg`, `hero-aframe.jpg`, `interior.jpg`, `terrace.jpg`, `work-*-clean.jpg`) — сгенерированные демо-изображения (помечены `isDemoImage`). Заменить съёмкой готовых домов. Слайды компании с подписями (`work-aframe.jpg`, `work-brick.jpg` в «Портфолио») — реальные, текст на них из ваших материалов.
3. **Карта офиса/работы** — на «Контактах» заглушка-схема; подключить Яндекс.Карты.
4. **Соцсети** — ссылки-заглушки в футере (`site.ts → company.socials`).
5. **Адрес офиса** — в материалах не указан (`site.ts → company.address`).
6. **Ставки ипотеки** — демо-ставки в калькуляторе (`site.ts → demoRates`), уточнить по программам банков.
7. **Отзывы клиентов** — секции отзывов нет в материалах; добавить после сбора реальных отзывов.
8. **Аналитика** — подключить Яндекс.Метрику/Google Analytics в `layout.tsx`.
9. **Домен + HTTPS** — `metadataBase` уже выставлен на боевой домен (punycode), проверить после переноса.

## Оставшиеся демо-данные

- Ставки ипотеки в калькуляторе (`demoRates`) — уточнить по программам банков.
- Часть фото на «Технологиях» и в hero — сгенерированные визуалы (`isDemoImage`), заменить съёмкой при необходимости.
- Полные тексты отзывов ведут на Авито — сейчас показаны выдержки.
