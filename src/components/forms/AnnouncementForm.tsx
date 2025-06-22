'use client';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { useEffect, useState } from 'react';

export type AnnouncementFormInputs = {
  title: string;
  description: string;
  date: string;
  classId?: number;
};

const AnnouncementForm = ({
  type,
  data,
  onSuccess,
}: {
  type: 'create' | 'update';
  data?: any;
  onSuccess?: () => void;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnnouncementFormInputs>({
    defaultValues: data || {},
  });
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetch('/api/classes')
      .then(res => res.json())
      .then(setClasses);
  }, []);

  const onSubmit = async (formData: AnnouncementFormInputs) => {
    // Convert date to ISO string
    const payload = {
      ...formData,
      date: formData.date ? new Date(formData.date).toISOString() : undefined,
    };
    const method = type === 'create' ? 'POST' : 'PUT';
    const url = type === 'create' ? '/api/announcements' : `/api/announcements/${data?.id}`;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (onSuccess) onSuccess();
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold ">
        {type === 'create' ? 'Create Announcement' : 'Update Announcement'}
      </h1>
      <div className="flex flex-wrap gap-4">
        <InputField
          label="Title"
          name="title"
          register={register}
          defaultValue={data?.title || ''}
          error={errors.title}
        />
        <InputField
          label="Description"
          name="description"
          register={register}
          defaultValue={data?.description || ''}
          error={errors.description}
        />
        <InputField
          label="Date"
          name="date"
          type="date"
          register={register}
          defaultValue={data?.date?.slice(0, 10) || ''}
          error={errors.date}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="classId" className="text-xs text-gray-500">
            Class (optional)
          </label>
          <select
            id="classId"
            {...register('classId', { valueAsNumber: true })}
            defaultValue={data?.class?.id || ''}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            aria-invalid={!!errors.classId}
            aria-describedby={errors.classId ? `classId-error` : undefined}
          >
            <option value="">None</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          {errors.classId && (
            <p id="classId-error" className="text-xs text-red-700">
              {errors.classId.message as string}
            </p>
          )}
        </div>
      </div>
      <button className="bg-LYNXPurple text-white py-2 px-4 rounded-md border-none">
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default AnnouncementForm;
