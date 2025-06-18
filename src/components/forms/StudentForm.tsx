"use client";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { useEffect, useState } from "react";

export type StudentFormInputs = {
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  img?: string;
  bloodType: string;
  sex: string;
  gender: string;
  homeLanguage?: string;
  allergies?: string;
  medicalInfo?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  guardianRelationship?: string;
  specialNeeds?: string;
  extracurriculars?: string;
  admissionYear?: number;
  status?: string;
  profileImage?: string;
  birthday: string;
  parentId: string;
  classId: number;
  gradeId: number;
  schoolId: number;
};

const StudentForm = ({ type, data, onSuccess }: {
  type: "create" | "update";
  data?: any;
  onSuccess?: () => void;
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<StudentFormInputs>({
    defaultValues: data || {},
  });
  const [parents, setParents] = useState<{ id: string; name: string }[]>([]);
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
  const [grades, setGrades] = useState<{ id: number; level: number }[]>([]);
  const [schoolId, setSchoolId] = useState<number>(data?.schoolId || 1);

  useEffect(() => {
    fetch("/api/parents").then(res => res.json()).then(setParents);
    fetch("/api/classes").then(res => res.json()).then(setClasses);
    fetch("/api/grades").then(res => res.json()).then(setGrades);
  }, []);

  const onSubmit = async (formData: StudentFormInputs) => {
    // Convert birthday to ISO string
    const payload = {
      ...formData,
      birthday: formData.birthday ? new Date(formData.birthday).toISOString() : undefined,
      sex: formData.sex?.toUpperCase(),
      img: typeof formData.img === 'string' ? formData.img : undefined // handle file upload elsewhere
    };
    const method = type === "create" ? "POST" : "PUT";
    const url = type === "create" ? "/api/students" : `/api/students/${data?.id}`;
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (onSuccess) onSuccess();
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold ">{type === "create" ? "Create Student" : "Update Student"}</h1>
      <div className="flex flex-wrap gap-4">
        <InputField label="Username" name="username" register={register} defaultValue={data?.username || ""} error={errors.username} />
        <InputField label="Name" name="name" register={register} defaultValue={data?.name || ""} error={errors.name} />
        <InputField label="Surname" name="surname" register={register} defaultValue={data?.surname || ""} error={errors.surname} />
        <InputField label="Email" name="email" register={register} defaultValue={data?.email || ""} error={errors.email} />
        <InputField label="Phone" name="phone" register={register} defaultValue={data?.phone || ""} error={errors.phone} />
        <InputField label="Address" name="address" register={register} defaultValue={data?.address || ""} error={errors.address} />
        <InputField label="Birthday" name="birthday" type="date" register={register} defaultValue={data?.birthday?.slice(0,10) || ""} error={errors.birthday} />
        <InputField label="Blood Type" name="bloodType" register={register} defaultValue={data?.bloodType || ""} error={errors.bloodType} />
        <InputField label="Sex" name="sex" register={register} defaultValue={data?.sex || ""} error={errors.sex} />
        <InputField label="Gender" name="gender" register={register} defaultValue={data?.gender || ""} error={errors.gender} />
        <InputField label="Home Language" name="homeLanguage" register={register} defaultValue={data?.homeLanguage || ""} error={errors.homeLanguage} />
        <InputField label="Allergies" name="allergies" register={register} defaultValue={data?.allergies || ""} error={errors.allergies} />
        <InputField label="Medical Info" name="medicalInfo" register={register} defaultValue={data?.medicalInfo || ""} error={errors.medicalInfo} />
        <InputField label="Emergency Contact Name" name="emergencyContactName" register={register} defaultValue={data?.emergencyContactName || ""} error={errors.emergencyContactName} />
        <InputField label="Emergency Contact Phone" name="emergencyContactPhone" register={register} defaultValue={data?.emergencyContactPhone || ""} error={errors.emergencyContactPhone} />
        <InputField label="Guardian Relationship" name="guardianRelationship" register={register} defaultValue={data?.guardianRelationship || ""} error={errors.guardianRelationship} />
        <InputField label="Special Needs" name="specialNeeds" register={register} defaultValue={data?.specialNeeds || ""} error={errors.specialNeeds} />
        <InputField label="Extracurriculars" name="extracurriculars" register={register} defaultValue={data?.extracurriculars || ""} error={errors.extracurriculars} />
        <InputField label="Admission Year" name="admissionYear" type="number" register={register} defaultValue={data?.admissionYear || ""} error={errors.admissionYear} />
        <InputField label="Status" name="status" register={register} defaultValue={data?.status || ""} error={errors.status} />
        <InputField label="Profile Image URL" name="profileImage" register={register} defaultValue={data?.profileImage || ""} error={errors.profileImage} />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="parentId" className="text-xs text-gray-500">Parent</label>
          <select id="parentId" {...register("parentId")}
            defaultValue={data?.parent?.id || ""}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            aria-invalid={!!errors.parentId}
            aria-describedby={errors.parentId ? `parentId-error` : undefined}
          >
            <option value="">Select parent</option>
            {(parents || []).map(parent => (
              <option key={parent.id} value={parent.id}>{parent.name}</option>
            ))}
          </select>
          {errors.parentId && <p id="parentId-error" className="text-xs text-red-700">{errors.parentId.message as string}</p>}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="classId" className="text-xs text-gray-500">Class</label>
          <select id="classId" {...register("classId", { valueAsNumber: true })}
            defaultValue={data?.class?.id || ""}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            aria-invalid={!!errors.classId}
            aria-describedby={errors.classId ? `classId-error` : undefined}
          >
            <option value="">Select class</option>
            {(classes || []).map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
          {errors.classId && <p id="classId-error" className="text-xs text-red-700">{errors.classId.message as string}</p>}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="gradeId" className="text-xs text-gray-500">Grade</label>
          <select id="gradeId" {...register("gradeId", { valueAsNumber: true })}
            defaultValue={data?.grade?.id || ""}
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
      </div>
      <button className="bg-LYNXPurple text-white py-2 px-4 rounded-md border-none">{type === "create" ? "Create" : "Update"}</button>
    </form>
  );
};

export default StudentForm;
