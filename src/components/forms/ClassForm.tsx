"use client";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { useEffect, useState } from "react";

export type ClassFormInputs = {
  name: string;
  capacity: number;
  gradeId: number;
  supervisorId?: string;
  schoolId: number;
};

const ClassForm = ({ type, data, onSuccess }: {
  type: "create" | "update";
  data?: any;
  onSuccess?: () => void;
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClassFormInputs>({
    defaultValues: data || {},
  });
  const [grades, setGrades] = useState<{ id: number; level: number }[]>([]);
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
  const [schoolId, setSchoolId] = useState<number>(data?.schoolId || 1);

  useEffect(() => {
    fetch("/api/grades").then(res => res.json()).then(setGrades);
    fetch("/api/teachers").then(res => res.json()).then(setTeachers);
  }, []);

  const onSubmit = async (formData: ClassFormInputs) => {
    const payload = {
      ...formData,
      capacity: Number(formData.capacity),
      gradeId: Number(formData.gradeId),
      supervisorId: formData.supervisorId || null,
      schoolId: Number(formData.schoolId),
    };
    const method = type === "create" ? "POST" : "PUT";
    const url = type === "create" ? "/api/classes" : `/api/classes/${data?.id}`;
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (onSuccess) onSuccess();
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold ">{type === "create" ? "Create Class" : "Update Class"}</h1>
      <div className="flex flex-wrap gap-4">
        <InputField label="Class Name" name="name" register={register} defaultValue={data?.name || ""} error={errors.name} />
        <InputField label="Capacity" name="capacity" type="number" register={register} defaultValue={data?.capacity || ""} error={errors.capacity} />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="gradeId" className="text-xs text-gray-500">Grade</label>
          <select id="gradeId" {...register("gradeId", { valueAsNumber: true })}
            defaultValue={data?.gradeId || ""}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            aria-invalid={!!errors.gradeId}
            aria-describedby={errors.gradeId ? `gradeId-error` : undefined}
          >
            <option value="">Select grade</option>
            {(grades || []).map(grade => (
              <option key={grade.id} value={grade.id}>Grade {grade.level}</option>
            ))}
          </select>
          {errors.gradeId && <p id="gradeId-error" className="text-xs text-red-700">{errors.gradeId.message as string}</p>}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="supervisorId" className="text-xs text-gray-500">Supervisor (Teacher)</label>
          <select id="supervisorId" {...register("supervisorId")}
            defaultValue={data?.supervisorId || ""}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            aria-invalid={!!errors.supervisorId}
            aria-describedby={errors.supervisorId ? `supervisorId-error` : undefined}
          >
            <option value="">None</option>
            {(teachers || []).map(teacher => (
              <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
            ))}
          </select>
          {errors.supervisorId && <p id="supervisorId-error" className="text-xs text-red-700">{errors.supervisorId.message as string}</p>}
        </div>
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

export default ClassForm;
