"use client";

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';

const optionSchema = z.object({
  text: z.string().min(1, 'Option text required'),
});

const questionSchema = z.object({
  text: z.string().min(1, 'Question text required'),
  options: z.array(optionSchema).min(2, 'At least 2 options'),
  correctIndex: z.number().min(0, 'Select the correct option'),
});

const quizSchema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  classId: z.string().min(1, 'Class required'),
  questions: z.array(questionSchema).min(1, 'At least 1 question'),
});

type QuizForm = z.infer<typeof quizSchema>;

export default function QuizBuilderPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm<QuizForm>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      classId: '',
      questions: [
        {
          text: '',
          options: [{ text: '' }, { text: '' }],
          correctIndex: 0,
        },
      ],
    },
  });

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = async (data: QuizForm) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create quiz');
      setSuccess(true);
      reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Create New Quiz</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block font-semibold">Title</label>
          <input {...register('title')} className="input input-bordered w-full" />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea {...register('description')} className="input input-bordered w-full" />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>
        <div>
          <label className="block font-semibold">Class ID</label>
          <input {...register('classId')} className="input input-bordered w-full" />
          {errors.classId && <p className="text-red-500 text-sm">{errors.classId.message}</p>}
        </div>
        <div>
          <label className="block font-semibold">Questions</label>
          {questionFields.map((q, qi) => (
            <div key={q.id} className="border p-4 mb-4 rounded bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Question {qi + 1}</span>
                {questionFields.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(qi)} className="text-red-500">Remove</button>
                )}
              </div>
              <input {...register(`questions.${qi}.text`)} placeholder="Question text" className="input input-bordered w-full mb-2" />
              {errors.questions?.[qi]?.text && <p className="text-red-500 text-sm">{errors.questions[qi]?.text?.message}</p>}
              <div className="mb-2">
                <label className="block font-semibold">Options</label>
                <Controller
                  control={control}
                  name={`questions.${qi}.options`}
                  render={({ field }) => (
                    <div>
                      {field.value.map((opt: any, oi: number) => (
                        <div key={oi} className="flex items-center mb-1">
                          <input
                            value={opt.text}
                            onChange={e => {
                              const newOptions = [...field.value];
                              newOptions[oi].text = e.target.value;
                              field.onChange(newOptions);
                            }}
                            placeholder={`Option ${oi + 1}`}
                            className="input input-bordered mr-2"
                          />
                          <input
                            type="radio"
                            {...register(`questions.${qi}.correctIndex`)}
                            value={oi}
                            checked={field.value && field.value.length > 0 && oi === (control._formValues.questions?.[qi]?.correctIndex || 0)}
                            onChange={() => setValue(`questions.${qi}.correctIndex`, oi)}
                          />
                          <span className="ml-1">Correct</span>
                          {field.value.length > 2 && (
                            <button type="button" className="ml-2 text-red-500" onClick={() => {
                              const newOptions = field.value.filter((_: any, idx: number) => idx !== oi);
                              field.onChange(newOptions);
                            }}>Remove</button>
                          )}
                        </div>
                      ))}
                      <button type="button" className="mt-1 text-blue-500" onClick={() => field.onChange([...field.value, { text: '' }])}>Add Option</button>
                    </div>
                  )}
                />
                {errors.questions?.[qi]?.options && <p className="text-red-500 text-sm">{errors.questions[qi]?.options?.message}</p>}
                {errors.questions?.[qi]?.correctIndex && <p className="text-red-500 text-sm">{errors.questions[qi]?.correctIndex?.message}</p>}
              </div>
            </div>
          ))}
          <button type="button" className="text-blue-500" onClick={() => appendQuestion({ text: '', options: [{ text: '' }, { text: '' }], correctIndex: 0 })}>Add Question</button>
          {errors.questions && typeof errors.questions.message === 'string' && <p className="text-red-500 text-sm">{errors.questions.message}</p>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Create Quiz'}</button>
        {success && <p className="text-green-600">Quiz created successfully!</p>}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
