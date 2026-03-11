import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  if (!locale || !['en', 'fr'].includes(locale)) {
    locale = 'fr';
  }

  const common = (await import(`../messages/${locale}/common.json`)).default;
  const docs = (await import(`../messages/${locale}/docs.json`)).default;
  const landing = (await import(`../messages/${locale}/landing.json`)).default;

  return {
    locale,
    messages: {
      ...common,
      docs,
      landing
    }
  };
});
