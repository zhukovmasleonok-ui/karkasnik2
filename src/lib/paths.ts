// Помощник путей для GitHub Pages: сайт живёт в подпапке /<репозиторий>/,
// адрес задаётся при сборке через env NEXT_PUBLIC_BASE_PATH (см. workflow).
// Картинки и ссылки пропускаются через asset() / link(), чтобы получить
// корректный префикс; без него (npm run dev локаьно) пути остаются обычными.
export const asset = (p: string): string =>
  `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${p}`;

// Тот же префикс для runtime-ссылок (например <a href>)
export const link = asset;
