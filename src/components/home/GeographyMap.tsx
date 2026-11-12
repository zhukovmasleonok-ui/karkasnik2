'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { Reveal } from '@/components/layout/Reveal';
import { cn } from '@/lib/utils';
import { asset } from '@/lib/paths';

/**
 * ГЕОГРАФИЯ ОБЪЕКТОВ — 3D-рельеф Крыма с фотографическими метками
 * (как на старом сайте строяткрымчане.рф, но в спокойной землистой стилистике).
 *
 * Нестандартные решения:
 *  1. База — PNG-рельеф с прозрачностью (karta-geografiya.png со старого сайта),
 *     он органично ложится на кремовую «бумагу» без рамок и подложек.
 *  2. Метки позиционируются в процентах ПОД ЭТУ конкретную проекцию рельефа:
 *     координаты подобраны вручную по реальной географии (Тарханкут слева,
 *     Керчь справа, Южный берег вдоль гор) и калибровались по скриншотам.
 *  3. Метка — не иконка, а круглое фото объекта (как на старом сайте):
 *     на тач-экранах клик выбирает объект, карточка под картой всегда
 *     показывает активную точку — hover не является единственным способом
 *     получить информацию (доступность).
 *  4. Ссылка каждой метки ведёт на конкретную карточку объекта в портфолио
 *     (/portfolio#obj-N) — карта становится навигацией, а не украшением.
 */

type MapObject = {
  /** id карточки в портфолио */
  anchor: string;
  image: string;
  title: string;
  location: string;
  /** позиция на рельефе, % от размеров изображения */
  x: number;
  y: number;
};

export const mapObjects: MapObject[] = [
  // Ялта — три объекта, разлёт внутри кластера, чтобы круглые метки не слипались
  { anchor: 'obj-1', image: asset('/images/portfolio/obj-1-1.jpg'), title: 'СИП-дом «под ключ» с перголой', location: 'г. Ялта', x: 41.5, y: 80 },
  { anchor: 'obj-2', image: asset('/images/portfolio/obj-2-1.jpg'), title: 'СИП-дом с террасой', location: 'г. Ялта', x: 45.5, y: 83 },
  { anchor: 'obj-7', image: asset('/images/portfolio/obj-7-1.jpg'), title: 'СИП-дом с террасами и балконом', location: 'г. Ялта', x: 37.5, y: 82.5 },
  // Западное побережье и Тарханкут — координаты калибровались по рельефу
  { anchor: 'obj-3', image: asset('/images/portfolio/obj-3-1.jpg'), title: 'СИП-дом с террасой', location: 'с. Орловка', x: 23.5, y: 61.5 },
  { anchor: 'obj-4', image: asset('/images/portfolio/obj-4-1.jpg'), title: 'А-фрейм по технологии «Префаб»', location: 'пгт. Черноморское, с. Громово', x: 13, y: 44.5 },
  { anchor: 'obj-6', image: asset('/images/portfolio/obj-6-1.jpg'), title: 'Модульный дом «Префаб» с террасой', location: 'пгт. Черноморское', x: 7.5, y: 41 },
  // Севастополь и окрестности
  { anchor: 'obj-9', image: asset('/images/portfolio/obj-9-1.jpg'), title: 'СИП-дом в предчистовой отделке', location: 'п. Любимовка', x: 26, y: 65 },
  { anchor: 'obj-10', image: asset('/images/portfolio/obj-10-1.jpg'), title: 'Пристройка-мастерская', location: 'г. Севастополь', x: 28.5, y: 68 },
  { anchor: 'obj-13', image: asset('/images/portfolio/obj-13-1.jpg'), title: 'Каркасная надстройка «Префаб»', location: 'г. Севастополь', x: 31, y: 72.5 },
  // Бахчисарайский район — предгорья
  { anchor: 'obj-8', image: asset('/images/portfolio/obj-8-1.jpg'), title: 'СИП-дом «под ключ»', location: 'с. Каменское', x: 30.5, y: 52.5 },
  // Керчь — три объекта на востоке полуострова
  { anchor: 'obj-5', image: asset('/images/portfolio/obj-5-1.jpg'), title: 'СИП-дом с фасадом', location: 'г. Керчь', x: 94.5, y: 51 },
  { anchor: 'obj-11', image: asset('/images/portfolio/obj-11-1.jpg'), title: 'СИП-надстройка (2-й этаж)', location: 'г. Керчь', x: 92, y: 56 },
  { anchor: 'obj-12', image: asset('/images/portfolio/obj-12-1.jpg'), title: 'СИП-дом в черновой отделке', location: 'г. Керчь', x: 89, y: 60.5 },
];

export function GeographyMap() {
  const [active, setActive] = useState(0);
  const obj = mapObjects[active];

  return (
    <section
      className="overflow-hidden border-y border-line bg-paper-2/50 py-24 lg:py-32"
      aria-label="География построенных объектов"
    >
      <div className="container-x">
        <SectionHeading
          eyebrow="География"
          title={
            <>
              Строим по всему Крыму —{' '}
              <span className="italic text-oak">от Тарханкута до Керчи</span>
            </>
          }
          text="Каждая метка на карте — реальный дом, построенный нашими бригадами. Нажмите на метку: покажем объект и расскажем, как он строился."
        />
      </div>

      <Reveal delay={120} className="mt-14">
        <div className="container-x">
          <div className="relative mx-auto w-full max-w-[1000px]">
            {/* Рельеф полуострова — PNG с прозрачностью, без рамки и подложки */}
            <Image
              src={asset('/images/karta-geografiya.png')}
              alt="Рельефная карта Крыма с метками построенных объектов компании"
              width={1140}
              height={519}
              sizes="(max-width: 1024px) 100vw, 1000px"
              className="h-auto w-full select-none"
              loading="lazy"
            />

            {/* Метки-фотографии поверх рельефа */}
            {mapObjects.map((o, i) => (
              <button
                key={o.anchor}
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-label={`${o.title}, ${o.location} — показать объект`}
                aria-pressed={active === i}
                className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full p-0"
                style={{ left: `${o.x}%`, top: `${o.y}%` }}
              >
                <span
                  className={cn(
                    'relative block h-7 w-7 overflow-hidden rounded-full border-2 shadow-[0_6px_16px_-6px_rgba(31,27,22,0.55)] transition-all duration-300 sm:h-10 sm:w-10 lg:h-11 lg:w-11',
                    active === i
                      ? 'scale-110 border-ember ring-2 ring-ember/30'
                      : 'border-paper group-hover:scale-[1.08] group-hover:border-oak'
                  )}
                >
                  <Image
                    src={o.image}
                    alt=""
                    fill
                    sizes="60px"
                    className="object-cover"
                    loading="lazy"
                  />
                </span>
                {/* Подпись локации при наведении — только на устройствах с hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-sm bg-night/90 px-2.5 py-1 text-[11px] font-semibold text-[#f2ede2] opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 [@media(hover:hover)]:block"
                >
                  {o.location}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Активный объект: карточка под картой (работает и на тач-экранах) */}
      <Reveal delay={80} className="mt-10">
        <div className="container-x">
          <div
            aria-live="polite"
            className="mx-auto flex max-w-[1000px] flex-col gap-5 rounded-sm border border-line bg-card p-5 sm:flex-row sm:items-center sm:gap-7 sm:p-6"
          >
            <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-sm sm:h-20 sm:w-32">
              <Image
                src={obj.image}
                alt={obj.title}
                fill
                sizes="(max-width: 640px) 100vw, 140px"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-graphite-soft">
                <MapPin className="h-3.5 w-3.5 text-ember" aria-hidden="true" />
                {obj.location}
              </p>
              <p className="mt-1 font-display text-[clamp(20px,2.4vw,26px)] font-medium leading-snug text-graphite">
                {obj.title}
              </p>
              <p className="mt-1 text-[12.5px] text-graphite-soft">
                Объект {active + 1} из {mapObjects.length} · фото с реальной стройки
              </p>
            </div>
            {/* Спокойные стрелки листания: на тач-экране удобно перейти к соседней
                точке без прицеливания в мелкие метки; aria-live обновляет карточку */}
            <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:gap-2">
              <button
                type="button"
                onClick={() => setActive((active - 1 + mapObjects.length) % mapObjects.length)}
                aria-label="Предыдущий объект"
                className="inline-flex h-11 w-11 rotate-180 items-center justify-center rounded-full border border-graphite/25 text-graphite transition-colors hover:border-ember hover:text-ember"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setActive((active + 1) % mapObjects.length)}
                aria-label="Следующий объект"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-graphite/25 text-graphite transition-colors hover:border-ember hover:text-ember"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <Link
              href={`/portfolio#${obj.anchor}`}
              className="group inline-flex shrink-0 items-center gap-2 border-b border-graphite/30 pb-1 text-[14px] font-semibold text-graphite transition-colors hover:border-ember hover:text-ember"
            >
              Смотреть объект
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
