import type { NextConfig } from "next";

// GitHub Pages отдаёт сайт по адресу https://<логин>.github.io/<название-репозитория>/.
// Нужный префикс пути (basePath) передаёт workflow при сборке через env
// NEXT_PUBLIC_BASE_PATH — так же его видят клиентские компоненты (asset()).
// Для сайта в корне (<логин>.github.io, без папки репозитория) — префикс пустой.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  // GitHub Pages — статический хостинг без сервера оптимизации картинок
  images: { unoptimized: true },
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
