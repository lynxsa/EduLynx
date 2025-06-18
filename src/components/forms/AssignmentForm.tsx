"use client";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { useEffect, useState } from "react";

// Assignment form fields
export type AssignmentFormInputs = {
  title: string;
  startDate: string;
  dueDate: string;
  lessonId: number;
};

const AssignmentForm = ({ type, data, onSuccess }: {
  type: "create" | "update";
  data?: any;
  onSuccess?: () => void;
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AssignmentFormInputs>({
    defaultValues: data || {},
  });
  const [lessons, setLessons] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/lessons")
      .then(res => res.json())
      .then(setLessons);
  }, []);

  const onSubmit = async (formData: AssignmentFormInputs) => {
    // Convert dates to ISO strings
    const payload = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
    };
    const method = type === "create" ? "POST" : "PUT";
    const url = type === "create" ? "/api/assignments" : `/api/assignments/${data?.id}`;
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (onSuccess) onSuccess();
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold ">{type === "create" ? "Create Assignment" : "Update Assignment"}</h1>
      <div className="flex flex-wrap gap-4">
        <InputField label="Title" name="title" register={register} defaultValue={data?.title || ""} error={errors.title} />
        <InputField label="Start Date" name="startDate" type="date" register={register} defaultValue={data?.startDate?.slice(0,10) || ""} error={errors.startDate} />
        <InputField label="Due Date" name="dueDate" type="date" register={register} defaultValue={data?.dueDate?.slice(0,10) || ""} error={errors.dueDate} />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="lessonId" className="text-xs text-gray-500">Lesson</label>
          <select id="lessonId" {...register("lessonId", { valueAsNumber: true })}
            defaultValue={data?.lesson?.id || ""}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            aria-invalid={!!errors.lessonId}
            aria-describedby={errors.lessonId ? `lessonId-error` : undefined}
          >
            <option value="">Select lesson</option>
            {(lessons || []).map(lesson => (
              <option key={lesson.id} value={lesson.id}>{lesson.name}</option>
            ))}
          </select>
          {errors.lessonId && <p id="lessonId-error" className="text-xs text-red-700">{errors.lessonId.message as string}</p>}
        </div>
      </div>
      <button className="bg-LYNXPurple text-white py-2 px-4 rounded-md border-none">{type === "create" ? "Create" : "Update"}</button>
    </form>
  );
};

export default AssignmentForm;
