import EduLynxLogo from '@/components/EduLynxLogo';

export default function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative mb-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 dark:border-slate-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <EduLynxLogo width={20} height={20} />
        </div>
      </div>
      {label && <span className="text-gray-500 text-sm">{label}</span>}
    </div>
  );
}
