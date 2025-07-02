import { Metadata } from 'next';
import CourseBuilder from '../../components/course-builder/CourseBuilder';

export const metadata: Metadata = {
  title: 'Course Builder | LynxLearn LMS',
  description:
    'Create and manage CAPS-aligned educational content with our advanced course builder.',
};

export default function CourseBuilderPage() {
  return <CourseBuilder />;
}
