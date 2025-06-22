'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from 'postcss';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import InputField from '../InputField';
import { FieldError } from 'react-hook-form';
import Image from 'next/image';

const schema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be atleast 3 characters' })
    .max(20, { message: 'Username cannot be more than 20 characters' }),
  email: z.string().min(3, { message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be 8 charaters long' }),
  firstname: z.string().min(2, { message: 'First name is required' }),
  lastname: z.string().min(2, { message: 'Last name is required' }),
  phone: z.string().min(10, { message: 'Enter a correct number' }),
  address: z.string().min(5, { message: 'Address is required' }),
  birthdate: z.date({ message: 'Birth Date is required' }),
  sex: z.enum(['male', 'female'], { message: 'Sex is required' }),
  img: z.instanceof(File, { message: 'Image is required' }),
  bloodtype: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    message: 'Slect Blood types',
  }),
});

type Inputs = z.infer<typeof schema>;

const TeacherForm = ({
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
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async formData => {
    // Convert birthdate to ISO string
    const payload = {
      ...formData,
      birthdate:
        formData.birthdate instanceof Date ? formData.birthdate.toISOString() : formData.birthdate,
      sex: formData.sex?.toUpperCase(),
      bloodtype: formData.bloodtype,
      img: typeof formData.img === 'string' ? formData.img : undefined, // handle file upload elsewhere
    };
    // TODO: handle file upload and get URL for img if needed
    await fetch(`/api/teachers${type === 'update' && data?.id ? `/${data.id}` : ''}`, {
      method: type === 'create' ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (onSuccess) onSuccess();
  });

  return (
    <form action="" className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold ">Create A New Teacher</h1>
      <span className="text-xs text-gray-400 font-medium">Authentication Information</span>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors.username}
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          defaultValue={data?.email}
          register={register}
          error={errors.email}
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors.password}
        />
      </div>

      <span className="text-xs text-gray-400 font-medium">Personal Information</span>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="firstname"
          type="firstname"
          defaultValue={data?.firstname}
          register={register}
          error={errors.firstname}
        />

        <InputField
          label="Last Name"
          name="lastname"
          type="lastname"
          defaultValue={data?.lastname}
          register={register}
          error={errors.lastname}
        />

        <InputField
          label="Phone"
          name="phone"
          type="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />

        <InputField
          label="Address"
          name="address"
          type="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="bloodtype" className="text-xs text-gray-500">
            Blood Type
          </label>
          <select
            id="bloodtype"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('bloodtype')}
            defaultValue={data?.bloodtype}
            aria-invalid={!!errors.bloodtype}
            aria-describedby={errors.bloodtype ? `bloodtype-error` : undefined}
          >
            <option value="">Select Blood Type</option>
            <option value="A+">A+ </option>
            <option value="A-">A- </option>
            <option value="B+">B+ </option>
            <option value="B-">B- </option>
            <option value="AB+">AB+ </option>
            <option value="AB-">AB- </option>
            <option value="O+">O+ </option>
            <option value="O-">O- </option>
          </select>
          {errors?.bloodtype && (
            <p id="bloodtype-error" className="text-xs text-red-700">
              {errors.bloodtype.toString()}
            </p>
          )}
        </div>
        <InputField
          label="Birth Date"
          name="birthdate"
          type="date"
          defaultValue={data?.birthdate}
          register={register}
          error={errors.birthdate}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="sex" className="text-xs text-gray-500">
            Sex
          </label>
          <select
            id="sex"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('sex')}
            defaultValue={data?.sex}
            aria-invalid={!!errors.sex}
            aria-describedby={errors.sex ? `sex-error` : undefined}
          >
            <option value="">Select Sex</option>
            <option value="male">Male </option>
            <option value="female">Female </option>
          </select>
          {errors?.sex && (
            <p id="sex-error" className="text-xs text-red-700">
              {errors.sex.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center mt-8 items-center">
          <label
            htmlFor="img"
            className="text-xs text-gray-500 flex items-cener gap-2 cursor-pointer"
          >
            <Image src="/upload.png" alt="Upload" width={28} height={28} />
            <span>Upload Image</span>
          </label>
          <input
            type="file"
            id="img"
            {...register('img')}
            className="hidden"
            aria-invalid={!!errors.img}
            aria-describedby={errors.img ? `img-error` : undefined}
          />
          {errors?.img && (
            <p id="img-error" className="text-xs text-red-700">
              {errors.img.toString()}
            </p>
          )}
        </div>
      </div>

      <button className="bg-blue-400 p-2 text-white rounded-lg">
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default TeacherForm;
