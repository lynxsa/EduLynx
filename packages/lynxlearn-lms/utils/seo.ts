// SEO and metadata utilities for EduLynx LMS
import { Metadata } from 'next';

// Base metadata for the application
export const baseMetadata: Metadata = {
  title: {
    template: '%s | LYNXLearn - South African High School',
    default: 'LYNXLearn - South African High School Education Platform',
  },
  description:
    'Premium online learning platform for South African high school students (Grades 8-12). Master your NSC subjects with AI-powered tutoring, interactive lessons, and expert guidance.',
  keywords: [
    'South Africa',
    'high school',
    'NSC',
    'matric',
    'online learning',
    'education',
    'CAPS curriculum',
    'AI tutor',
    'ProfLynx',
    'mathematics',
    'science',
    'english',
    'afrikaans',
    'grade 8',
    'grade 9',
    'grade 10',
    'grade 11',
    'grade 12',
  ],
  authors: [{ name: 'EduLynx', url: 'https://edulynx.co.za' }],
  creator: 'EduLynx',
  publisher: 'EduLynx',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://learn.edulynx.co.za',
    siteName: 'LYNXLearn',
    title: 'LYNXLearn - South African High School Education Platform',
    description:
      'Premium online learning platform for South African high school students with AI-powered tutoring and CAPS-aligned curriculum.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LYNXLearn - South African High School Education Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LYNXLearn - South African High School Education',
    description: 'Master your NSC subjects with AI-powered tutoring and expert guidance.',
    creator: '@EduLynxSA',
    images: ['/twitter-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

// Generate metadata for course pages
export function generateCourseMetadata(course: {
  title: string;
  description: string;
  grade: string;
  subject: string;
  thumbnail?: string;
}): Metadata {
  return {
    title: `${course.title} - Grade ${course.grade} ${course.subject}`,
    description: `${course.description} Master ${course.subject} for Grade ${course.grade} with interactive lessons, practice exercises, and AI tutoring support.`,
    keywords: [
      course.subject.toLowerCase(),
      `grade ${course.grade}`,
      'NSC',
      'CAPS curriculum',
      'South Africa',
      'online learning',
      'high school',
      course.title.toLowerCase(),
    ],
    openGraph: {
      title: `${course.title} - Grade ${course.grade} ${course.subject}`,
      description: course.description,
      images: course.thumbnail
        ? [
            {
              url: course.thumbnail,
              width: 1200,
              height: 630,
              alt: `${course.title} course thumbnail`,
            },
          ]
        : undefined,
    },
    twitter: {
      title: `${course.title} - Grade ${course.grade} ${course.subject}`,
      description: course.description,
      images: course.thumbnail ? [course.thumbnail] : undefined,
    },
  };
}

// Generate metadata for dashboard pages
export function generateDashboardMetadata(user: { name: string; grade: string }): Metadata {
  return {
    title: `Dashboard - ${user.name}`,
    description: `Your personalized learning dashboard. Track your progress in Grade ${user.grade} subjects, access assignments, and continue your educational journey.`,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `${user.name}'s Learning Dashboard`,
      description: `Personalized learning progress for Grade ${user.grade} student`,
    },
  };
}

// Generate metadata for subject pages
export function generateSubjectMetadata(subject: {
  name: string;
  description: string;
  grade?: string;
}): Metadata {
  const gradeText = subject.grade ? `Grade ${subject.grade} ` : '';

  return {
    title: `${gradeText}${subject.name} Courses`,
    description: `${subject.description} Explore comprehensive ${subject.name} courses designed for South African high school students following the CAPS curriculum.`,
    keywords: [
      subject.name.toLowerCase(),
      subject.grade ? `grade ${subject.grade}` : 'high school',
      'NSC',
      'CAPS',
      'South Africa',
      'online learning',
      'education',
    ],
    openGraph: {
      title: `${gradeText}${subject.name} - LYNXLearn`,
      description: subject.description,
    },
  };
}

// JSON-LD structured data generators
export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LYNXLearn',
    description: 'Premium online learning platform for South African high school students',
    url: 'https://learn.edulynx.co.za',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://learn.edulynx.co.za/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    provider: {
      '@type': 'Organization',
      name: 'EduLynx',
      url: 'https://edulynx.co.za',
    },
  };
}

export function generateEducationalOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'EduLynx',
    description:
      'Leading South African educational technology company providing high-quality online learning solutions for high school students.',
    url: 'https://edulynx.co.za',
    logo: 'https://edulynx.co.za/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+27-11-123-4567',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Afrikaans'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ZA',
      addressRegion: 'Gauteng',
      addressLocality: 'Johannesburg',
    },
    sameAs: [
      'https://facebook.com/edulynxsa',
      'https://twitter.com/edulynxsa',
      'https://linkedin.com/company/edulynx',
    ],
  };
}

export function generateCourseJsonLd(course: {
  title: string;
  description: string;
  subject: string;
  grade: string;
  duration?: string;
  instructor?: string;
  thumbnail?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'EduLynx',
      url: 'https://edulynx.co.za',
    },
    educationalCredentialAwarded: 'NSC Certificate',
    educationalLevel: `Grade ${course.grade}`,
    teaches: course.subject,
    timeRequired: course.duration || 'P1Y',
    instructor: course.instructor
      ? {
          '@type': 'Person',
          name: course.instructor,
        }
      : undefined,
    image: course.thumbnail,
    inLanguage: 'en-ZA',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      audienceType: 'high school student',
    },
  };
}

// Breadcrumb JSON-LD generator
export function generateBreadcrumbJsonLd(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

// FAQ JSON-LD generator
export function generateFaqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Utility to inject JSON-LD
export function injectJsonLd(data: object) {
  if (typeof window !== 'undefined') {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }
}
