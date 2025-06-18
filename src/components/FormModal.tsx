"use client";
import dynamic from "next/dynamic";

const TeacherForm = dynamic(() => import("@/components/forms/TeacherForm"), { ssr: false });
const AssignmentForm = dynamic(() => import("@/components/forms/AssignmentForm"), { ssr: false });
const ClassForm = dynamic(() => import("@/components/forms/ClassForm"), { ssr: false });
const QuizForm = dynamic(() => import("@/components/forms/QuizForm"), { ssr: false });
const StudentForm = dynamic(() => import("@/components/forms/StudentForm"), { ssr: false });
const ParentForm = dynamic(() => import("@/components/forms/ParentForm"), { ssr: false });
const SubjectForm = dynamic(() => import("@/components/forms/SubjectForm"), { ssr: false });
const AnnouncementForm = dynamic(() => import("@/components/forms/AnnouncementForm"), { ssr: false });

import Image from "next/image";
import { useState } from "react";


const FormModal = ({ table, type, data, id, onSuccess }: {
    table: "teacher" | "students" | "parents" | "classes" | "subjects" | "lessons" | "assignment" | "exams" | "assignments" | "results" | "attendance" | "events" | "announcements" | "quizzes";
    type: "create" | "update" | "delete" | "view";
    data?: any;
    id?: string | number;
    onSuccess?: () => void;
}) => {
    const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
    const bgColor = type === "create" 
                    ? "bg-LYNXLavendar" : type=== "update" 
                    ? "bg-LYNXPurple" 
                    : "bg-LYNXMauve";
    
   const [open, setOpen] = useState(false);
   const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) onSuccess();
};
   const Form = () => {
    if (type === "delete" && id) {
        if (table === "assignments") {
            const handleDelete = async (e: React.FormEvent) => {
                e.preventDefault();
                await fetch(`/api/assignments/${id}`, { method: "DELETE" });
                handleSuccess();
            };
            return (
                <form className="p-4 flex flex-col gap-4" onSubmit={handleDelete}>
                    <span className="text-center font-medium">All data will be lost. Are you sure you want to delete this assignment?</span>
                    <button className="btn-danger">Delete</button>
                </form>
            );
        }
        if (table === "classes") {
            const handleDelete = async (e: React.FormEvent) => {
                e.preventDefault();
                await fetch(`/api/classes/${id}`, { method: "DELETE" });
                handleSuccess();
            };
            return (
                <form className="p-4 flex flex-col gap-4" onSubmit={handleDelete}>
                    <span className="text-center font-medium">All data will be lost. Are you sure you want to delete this class?</span>
                    <button className="btn-danger">Delete</button>
                </form>
            );
        }
        if (table === "quizzes") {
            const handleDelete = async (e: React.FormEvent) => {
                e.preventDefault();
                await fetch(`/api/quizzes/${id}`, { method: "DELETE" });
                handleSuccess();
            };
            return (
                <form className="p-4 flex flex-col gap-4" onSubmit={handleDelete}>
                    <span className="text-center font-medium">All data will be lost. Are you sure you want to delete this quiz?</span>
                    <button className="btn-danger">Delete</button>
                </form>
            );
        }
        if (table === "students") {
            const handleDelete = async (e: React.FormEvent) => {
                e.preventDefault();
                await fetch(`/api/students/${id}`, { method: "DELETE" });
                handleSuccess();
            };
            return (
                <form className="p-4 flex flex-col gap-4" onSubmit={handleDelete}>
                    <span className="text-center font-medium">All data will be lost. Are you sure you want to delete this student?</span>
                    <button className="btn-danger">Delete</button>
                </form>
            );
        }
        if (table === "teacher") {
            const handleDelete = async (e: React.FormEvent) => {
                e.preventDefault();
                await fetch(`/api/teachers/${id}`, { method: "DELETE" });
                handleSuccess();
            };
            return (
                <form className="p-4 flex flex-col gap-4" onSubmit={handleDelete}>
                    <span className="text-center font-medium">All data will be lost. Are you sure you want to delete this teacher?</span>
                    <button className="btn-danger">Delete</button>
                </form>
            );
        }
        if (table === "parents") {
            const handleDelete = async (e: React.FormEvent) => {
                e.preventDefault();
                await fetch(`/api/parents/${id}`, { method: "DELETE" });
                handleSuccess();
            };
            return (
                <form className="p-4 flex flex-col gap-4" onSubmit={handleDelete}>
                    <span className="text-center font-medium">All data will be lost. Are you sure you want to delete this parent?</span>
                    <button className="btn-danger">Delete</button>
                </form>
            );
        }
        if (table === "subjects") {
            const handleDelete = async (e: React.FormEvent) => {
                e.preventDefault();
                await fetch(`/api/subjects/${id}`, { method: "DELETE" });
                handleSuccess();
            };
            return (
                <form className="p-4 flex flex-col gap-4" onSubmit={handleDelete}>
                    <span className="text-center font-medium">All data will be lost. Are you sure you want to delete this subject?</span>
                    <button className="btn-danger">Delete</button>
                </form>
            );
        }
        if (table === "announcements") {
            const handleDelete = async (e: React.FormEvent) => {
                e.preventDefault();
                await fetch(`/api/announcements/${id}`, { method: "DELETE" });
                handleSuccess();
            };
            return (
                <form className="p-4 flex flex-col gap-4" onSubmit={handleDelete}>
                    <span className="text-center font-medium">All data will be lost. Are you sure you want to delete this announcement?</span>
                    <button className="btn-danger">Delete</button>
                </form>
            );
        }
        // ...existing code for other tables...
        return (
            <form action="" className="p-4 flex flex-col gap-4">
                <span className="text-center font-medium">All data will be lost. Are you sure you want to delete this {table}?</span>
                <button className="btn-danger">Delete</button>
            </form>
        );
    }
    if (table === "assignments") {
        return <AssignmentForm type={type as any} data={data} onSuccess={handleSuccess} />;
    }
    if (table === "classes") {
        return <ClassForm type={type as any} data={data} onSuccess={handleSuccess} />;
    }
    if (table === "quizzes") {
        return <QuizForm type={type as any} data={data} onSuccess={handleSuccess} />;
    }
    if (table === "students") {
        return <StudentForm type={type as any} data={data} onSuccess={handleSuccess} />;
    }
    if (table === "teacher") {
        return <TeacherForm type={type as any} data={data} onSuccess={handleSuccess} />;
    }
    if (table === "parents") {
        return <ParentForm type={type as any} data={data} onSuccess={handleSuccess} />;
    }
    if (table === "subjects") {
        return <SubjectForm type={type as any} data={data} onSuccess={handleSuccess} />;
    }
    if (table === "announcements") {
        return <AnnouncementForm type={type as any} data={data} onSuccess={handleSuccess} />;
    }
    // ...existing code for other tables...
    return <div />;
};

    return (<>
        
        <button className={ `${size} flex items-center justify-center rounded-full ${bgColor}`}  
         onClick={() => setOpen(true)}>
            <Image src={`/${type}.png`} alt="" width={16} height={16} /> 
        </button>

        {open && <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
            <div className="card relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]"> 
                <Form/>
            <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setOpen(false)}>
                <Image src="/close.png" alt="" width={14} height={14}/>
            </div>
            </div>
           
        </div>}


    </> );
};

export default FormModal