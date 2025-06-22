'use client';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';

export type SubjectFormInputs = {
  name: string;
};

const SubjectForm = ({
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
  } = useForm<SubjectFormInputs>({
    defaultValues: data || {},
  });

  const onSubmit = async (formData: SubjectFormInputs) => {
    const method = type === 'create' ? 'POST' : 'PUT';
    const url = type === 'create' ? '/api/subjects' : `/api/subjects/${data?.id}`;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (onSuccess) onSuccess();
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold ">
        {type === 'create' ? 'Create Subject' : 'Update Subject'}
      </h1>
      <div className="flex flex-wrap gap-4">
        <InputField
          label="Subject Name"
          name="name"
          register={register}
          defaultValue={data?.name || ''}
          error={errors.name}
        />
      </div>
      <button className="bg-LYNXPurple text-white py-2 px-4 rounded-md border-none">
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default SubjectForm;
