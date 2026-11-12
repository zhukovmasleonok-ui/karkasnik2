import { Hero, KeyFacts } from '@/components/home/Hero';
import {
  Manifesto,
  Founder,
  TechnologiesSection,
  ProcessGallery,
  ModelsStrip,
  Myths,
  Trust,
  FaqSection,
} from '@/components/home/sections';
import { GeographyMap } from '@/components/home/GeographyMap';
import { FinalCta } from '@/components/home/FinalCta';
import { pagesMeta } from '@/content/site';

export const metadata = {
  title: pagesMeta.home.title,
  description: pagesMeta.home.description,
};

/**
 * Главная в новом ритме: медленный вдумчивый скролл без агрессии.
 * Полноэкранный hero → факты → философия → человек → технологии →
 * процесс в фотографиях → модели → мифы → доверие → география объектов →
 * вопросы → разговор.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <KeyFacts />
      <Manifesto />
      <Founder />
      <TechnologiesSection />
      <ProcessGallery />
      <ModelsStrip />
      <Myths />
      <Trust />
      <GeographyMap />
      <FaqSection />
      <FinalCta />
    </>
  );
}
