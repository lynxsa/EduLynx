"use client";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import Link from "next/link";
import { useRouter } from "next/navigation";

function getPageNumbers(current: number, total: number) {
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        range.push(i);
    }
    if (current - delta > 2) range.unshift('...');
    if (current + delta < total - 1) range.push('...');
    range.unshift(1);
    if (total > 1) range.push(total);
    return range;
}

const Pagination = ({ page, count }: { page: number; count: number }) => {
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    const router = useRouter();

    const changePage = (newPage: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", newPage.toString());
        router.push(`${window.location.pathname}?${params}`);
    };

    if (totalPages <= 1) return null;

    const pageNumbers = getPageNumbers(page, totalPages);

    return (
        <div className="p-4 flex items-center justify-between text-gray-500" role="navigation" aria-label="Pagination Navigation">
            <button
                onClick={() => changePage(1)}
                disabled={page === 1}
                className="py-2 px-3 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Go to first page"
            >
                First
            </button>
            <button
                onClick={() => changePage(page - 1)}
                disabled={page === 1}
                className="py-2 px-3 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Go to previous page"
            >
                Prev
            </button>
            <div className="flex items-center gap-2 text-xs">
                {(pageNumbers || []).map((num, idx) =>
                    num === '...'
                        ? <span key={idx} className="px-2" aria-hidden="true">...</span>
                        : <button
                            key={num}
                            className={`px-2 rounded-sm ${page === num ? "bg-LYNXPurple text-white" : "bg-slate-200"}`}
                            onClick={() => changePage(Number(num))}
                            disabled={num === page}
                            aria-label={page === num ? `Current page, page ${num}` : `Go to page ${num}`}
                        >
                            {num}
                        </button>
                )}
            </div>
            <button
                onClick={() => changePage(page + 1)}
                disabled={page === totalPages}
                className="py-2 px-3 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Go to next page"
            >
                Next
            </button>
            <button
                onClick={() => changePage(totalPages)}
                disabled={page === totalPages}
                className="py-2 px-3 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Go to last page"
            >
                Last
            </button>
        </div>
    );
};

export default Pagination;
