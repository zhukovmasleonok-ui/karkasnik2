import type { Metadata } from 'next';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { CatalogClient } from '@/components/projects/CatalogClient';
import { FinalCta } from '@/components/home/FinalCta';
import { pagesMeta } from '@/content/site';

export const metadata = {
  title: pagesMeta.projects.title,
  description: pagesMeta.projects.description,
};

export default function ProjectsPage() {
  return (
    <>
      <section className="pt-14 lg:pt-20" aria-label="Каталог проектов">
        <div className="container-x">
          <SectionHeading
            eyebrow="Каталог"
            title={
              <>
                Проекты домов — <span className="italic text-oak">медленно и по существу</span>
              </>
            }
            text="27 реальных моделей: названия, площади, состав помещений и три уровня цен — от «черновой» до «под ключ». Отфильтруйте по типу дома, площади, назначению и бюджету — без спешки."
          />
          <CatalogClient />
        </div>
      </section>
      <div className="mt-20 lg:mt-28">
        <FinalCta />
      </div>
    </>
  );
}
