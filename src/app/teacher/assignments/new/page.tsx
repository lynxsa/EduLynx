"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  title: z.string().min(5, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string(), // ISO date
  classId: z.string(),
});

type AssignmentForm = z.infer<typeof schema>;

export default function NewAssignment() {
  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<AssignmentForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: AssignmentForm) => {
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create assignment");
      alert("Assignment created!");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">New Assignment</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input className="border rounded px-2 py-1 w-full" {...register("title")}/>
          {errors.title && <div className="text-red-500 text-sm">{errors.title.message}</div>}
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea className="border rounded px-2 py-1 w-full" {...register("description")}/>
        </div>
        <div>
          <label className="block font-medium">Due Date</label>
          <input type="date" className="border rounded px-2 py-1 w-full" {...register("dueDate")}/>
          {errors.dueDate && <div className="text-red-500 text-sm">{errors.dueDate.message}</div>}
        </div>
        <div>
          <label className="block font-medium">Class ID</label>
          <input className="border rounded px-2 py-1 w-full" {...register("classId")}/>
          {errors.classId && <div className="text-red-500 text-sm">{errors.classId.message}</div>}
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Assignment"}
        </button>
        {isSubmitSuccessful && <div className="text-green-600 mt-2">Assignment created successfully!</div>}
      </form>
    </div>
  );
}
