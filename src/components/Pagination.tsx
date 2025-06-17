"use client";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import Link from "next/link";
import { useRouter } from "next/navigation";


const Pagination = ({ page, count }: { page: number; count: number }) => {
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    const router = useRouter()

    const changePage = (newPage: number) => { 
        const params = new URLSearchParams(window.location.search);
        params.set("page", newPage.toString())
        router.push(`${window.location.pathname}?${params}`);
    }


    return (
        <div className="p-4 flex items-center justify-between text-gray-500">
            <Link href={`?page=${page - 1}`}>
                <button
                    disabled={page === 1}
                    className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Prev
                </button>
            </Link>

            <div className="flex items-center gap-2 text-xs">
                {Array.from({ length: totalPages }, (_, index) => {
                    const pageIndex = index + 1;
                    return (
                        <Link key={pageIndex} href={`?page=${pageIndex}`}>
                            <button
                                className={`px-2 rounded-sm ${page === pageIndex
                                        ? "bg-LYNXPurple text-white"
                                        : "bg-slate-200"
                                    }`}
                                onClick={() => changePage(pageIndex)}
                            >
                                {pageIndex}
                            </button>
                        </Link>
                    );
                })}
            </div>

            <Link href={`?page=${page + 1}`}>
                <button
                    disabled={page === totalPages}
                    className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </Link>
        </div>
    );
};

export default Pagination;
