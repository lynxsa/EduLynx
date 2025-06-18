"use client";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { useEffect, useState } from "react";

export type ParentFormInputs = {
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  img?: string;
  sex: string;
  schoolId: number;
};

const ParentForm = ({ type, data, onSuccess }: {
  type: "create" | "update";
  data?: any;
  onSuccess?: () => void;
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ParentFormInputs>({
    defaultValues: data || {},
  });
  const [schoolId, setSchoolId] = useState<number>(data?.schoolId || 1);

  const onSubmit = async (formData: ParentFormInputs) => {
    const payload = {
      ...formData,
      sex: formData.sex?.toUpperCase(),
      img: typeof formData.img === 'string' ? formData.img : undefined // handle file upload elsewhere
    };
    const method = type === "create" ? "POST" : "PUT";
    const url = type === "create" ? "/api/parents" : `/api/parents/${data?.id}`;
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (onSuccess) onSuccess();
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold ">{type === "create" ? "Create Parent" : "Update Parent"}</h1>
      <div className="flex flex-wrap gap-4">
        <InputField label="Username" name="username" register={register} defaultValue={data?.username || ""} error={errors.username} />
        <InputField label="Name" name="name" register={register} defaultValue={data?.name || ""} error={errors.name} />
        <InputField label="Surname" name="surname" register={register} defaultValue={data?.surname || ""} error={errors.surname} />
        <InputField label="Email" name="email" register={register} defaultValue={data?.email || ""} error={errors.email} />
        <InputField label="Phone" name="phone" register={register} defaultValue={data?.phone || ""} error={errors.phone} />
        <InputField label="Address" name="address" register={register} defaultValue={data?.address || ""} error={errors.address} />
        <InputField label="Sex" name="sex" register={register} defaultValue={data?.sex || ""} error={errors.sex} />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="schoolId" className="text-xs text-gray-500">School</label>
          <input id="schoolId" type="number" {...register("schoolId", { valueAsNumber: true })}
            defaultValue={data?.schoolId || 1}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            aria-invalid={!!errors.schoolId}
            aria-describedby={errors.schoolId ? `schoolId-error` : undefined}
          />
          {errors.schoolId && <p id="schoolId-error" className="text-xs text-red-700">{errors.schoolId.message as string}</p>}
        </div>
      </div>
      <button className="bg-LYNXPurple text-white py-2 px-4 rounded-md border-none">{type === "create" ? "Create" : "Update"}</button>
    </form>
  );
};

export default ParentForm;
