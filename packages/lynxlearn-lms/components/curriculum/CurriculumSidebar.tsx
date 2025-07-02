import Link from 'next/link';
import { FC } from 'react';
import { GradeCurriculum } from '../../data/curriculum';

interface Props {
  data: GradeCurriculum[];
}

export const CurriculumSidebar: FC<Props> = ({ data }) => (
  <div className="w-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-4 rounded-2xl border border-white/30 dark:border-slate-700/50">
    {data.map(grade => (
      <div key={grade.grade} className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
          {grade.grade}
        </h3>
        <ul className="space-y-1">
          {grade.subjects.map(subject => (
            <li key={subject.id}>
              <Link
                href={`/courses/${subject.id}`}
                className="block py-1 px-2 rounded hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
              >
                {subject.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);
