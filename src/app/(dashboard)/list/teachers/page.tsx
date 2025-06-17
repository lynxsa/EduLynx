import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Table from "@/components/Table";
import React from 'react';
import Link from "next/link";
import { role } from "@/lib/data";
import FormModal from "@/components/FormModal";
import { Class, Subject, Teacher } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] };

const columns = [
    { header: "Info", accessor: "info" },
    { header: "TeacherID", accessor: "teacherID", className: "hidden md:table-cell" },
    { header: "Subjects", accessor: "subjects", className: "hidden md:table-cell" },
    { header: "Classes", accessor: "classes", className: "hidden md:table-cell" },
    { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
    { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "actions", className: "table-cell" }
];

const renderRow = (item: TeacherList) => (
    <tr key={item.id} className="border-b-gray-200 hover:bg-LYNXLavendar even:bg-slate-50 odd:bg-white">
        <td className="flex items-center gap-4 p-3">
            <div className="flex rounded-2xl p-1 pr-4">
                <div className="flex mr-3">
                    <Image
                        src={item.img || "/noAvatar.png"}
                        alt=""
                        width={30}
                        height={30}
                        className="rounded-full"
                    />
                </div>
                <div className="flex flex-col">
                    <div className="font-semibold">{item.name}</div>
                    <p className="text-xs text-gray-500">{item.email}</p>
                </div>
            </div>
        </td>
        <td className="hidden md:table-cell">{item.username}</td>
        <td className="hidden md:table-cell">{item.subjects.map(subject => subject.name).join(", ")}</td>
        <td className="hidden md:table-cell">{item.classes.map(classItem => classItem.name).join(", ")}</td>
        <td className="hidden md:table-cell">{item.phone}</td>
        <td className="hidden md:table-cell">{item.address}</td>
        <td className="table-cell">
            <div className="flex items-center gap-2">
                <Link href={`/list/teachers/${item.id}`}>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-LYNXLight">
                        <Image src="/view.png" alt="" width={16} height={16} />
                    </button>
                </Link>
                {role === "admin" && (
                    <>
                        <FormModal table="teacher" type="update" data={item} />
                        <FormModal table="teacher" type="delete" id={Number(item.id)} />
                    </>
                )}
            </div>
        </td>
    </tr>
);

const TeacherListPage = async ({ searchParams }: {
    searchParams: { [key: string]: string | undefined};
}) => {
    const { page, ...queryParams } = searchParams;
    
    const p = page ? parseInt(page) : 1;

    const [data, count] = await prisma.$transaction([
        prisma.teacher.findMany({
            where: {
                lessons: {
                    some: {classId:parseInt(queryParams.classId!)},
                    }
            },
            include: {
                subjects: true,
                classes: true,
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1),
        }),
        prisma.teacher.count()
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 min-w-full max-w-full m-4 mt-0">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
                <div className="flex flex-row items-center gap-4">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-LYNXLavendar">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-LYNXLavendar">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {role === "admin" && (
                            <FormModal table="teacher" type="create" />
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <Table columns={columns} renderRow={renderRow} data={data} />

            {/* Pagination */}
            <Pagination page={p} count={count} />
        </div>
    );
};

export default TeacherListPage;
