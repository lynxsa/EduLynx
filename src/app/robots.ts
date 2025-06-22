export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/(dashboard)/', '/sign-in'],
    },
    sitemap: 'https://edulynx.co.za/sitemap.xml',
  };
}
