// Curriculum data for Grades 8–12 NSC subjects (partial sample)
export interface Lesson {
  id: string;
  title: string;
  // HTML content for the lesson
  content?: string;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons?: Lesson[];
}

export interface SubjectCurriculum {
  id: string;
  name: string;
  modules: Module[];
}

export interface GradeCurriculum {
  grade: string;
  subjects: SubjectCurriculum[];
}

export const curriculum: GradeCurriculum[] = [
  {
    grade: 'Grade 8',
    subjects: [
      {
        id: 'mathematics',
        name: 'Mathematics',
        modules: [
          {
            id: 'numbers-operations',
            title: 'Numbers and Operations',
            lessons: [
              {
                id: 'whole-numbers',
                title: 'Whole Numbers',
                content: `
                  <h2>Understanding Whole Numbers</h2>
                  <p>Whole numbers are the non-negative integers including zero. They are used for counting and ordering.</p>
                  <ul>
                    <li>0, 1, 2, 3, ...</li>
                    <li>Useful in real-life contexts like counting objects.</li>
                  </ul>
                  <p>Next, we'll explore fractions.</p>
                `,
              },
              { id: 'fractions', title: 'Fractions' },
              { id: 'decimals', title: 'Decimals' },
            ],
          },
          {
            id: 'algebra-intro',
            title: 'Introduction to Algebra',
            lessons: [
              { id: 'expressions-equations', title: 'Expressions & Equations' },
              { id: 'variables', title: 'Understanding Variables' },
              { id: 'simple-equations', title: 'Solving Simple Equations' },
            ],
          },
          {
            id: 'geometry-basics',
            title: 'Basic Geometry',
            lessons: [
              { id: 'points-lines', title: 'Points, Lines & Angles' },
              { id: 'triangles', title: 'Triangles & Properties' },
              { id: 'circles', title: 'Circles Basics' },
            ],
          },
        ],
      },
      {
        id: 'physical-sciences',
        name: 'Physical Sciences',
        modules: [
          {
            id: 'matter-properties',
            title: 'Properties of Matter',
            lessons: [
              { id: 'states-of-matter', title: 'States of Matter' },
              { id: 'mixtures-solutions', title: 'Mixtures & Solutions' },
              { id: 'chemical-changes', title: 'Chemical Changes' },
            ],
          },
          {
            id: 'energy',
            title: 'Energy and Its Forms',
            lessons: [
              { id: 'kinetic-potential', title: 'Kinetic & Potential Energy' },
              { id: 'heat-energy', title: 'Heat Energy' },
              { id: 'energy-transfer', title: 'Energy Transfer' },
            ],
          },
          {
            id: 'motions-forces',
            title: 'Motion and Forces',
            lessons: [
              { id: 'motion', title: 'Describing Motion' },
              { id: 'forces', title: 'Types of Forces' },
              { id: 'newtons-laws', title: "Newton's Laws" },
            ],
          },
        ],
      },
      {
        id: 'english',
        name: 'English',
        modules: [
          {
            id: 'poetry',
            title: 'Poetry and Prose',
            lessons: [
              { id: 'poetic-devices', title: 'Poetic Devices' },
              { id: 'reading-analysis', title: 'Reading Analysis' },
              { id: 'writing-response', title: 'Writing Responses' },
            ],
          },
          {
            id: 'grammar',
            title: 'Grammar and Composition',
            lessons: [
              { id: 'sentence-structure', title: 'Sentence Structure' },
              { id: 'tenses', title: 'Verb Tenses' },
              { id: 'paragraph-writing', title: 'Paragraph Writing' },
            ],
          },
          {
            id: 'reading-comprehension',
            title: 'Reading Comprehension',
            lessons: [
              { id: 'skimming-scanning', title: 'Skimming & Scanning' },
              { id: 'context-clues', title: 'Using Context Clues' },
              { id: 'summarizing', title: 'Summarizing Texts' },
            ],
          },
        ],
      },
    ],
  },
  // Additional grades (9–12) would follow similar structure...
];
