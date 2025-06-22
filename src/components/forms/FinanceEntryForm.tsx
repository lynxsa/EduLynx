import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';

const schema = z.object({
  title: z.string().min(2),
  amount: z.number().positive(),
  type: z.enum(['Income', 'Expense']),
  category: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
  date: z.string(),
});

type FinanceEntryFormData = z.infer<typeof schema>;

interface Props {
  initialData?: Partial<FinanceEntryFormData>;
  onSuccess?: () => void;
}

const FinanceEntryForm = ({ initialData = {}, onSuccess }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FinanceEntryFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: FinanceEntryFormData) => {
    setError(null);
    try {
      const res = await fetch('/api/finance', {
        method: initialData && initialData.title ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save entry');
      if (onSuccess) onSuccess();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input {...register('title')} className="input" />
        {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          step="0.01"
          {...register('amount', { valueAsNumber: true })}
          className="input"
        />
        {errors.amount && <span className="text-red-500 text-xs">{errors.amount.message}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium">Type</label>
        <select {...register('type')} className="input">
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        {errors.type && <span className="text-red-500 text-xs">{errors.type.message}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium">Category</label>
        <input {...register('category')} className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium">Reference</label>
        <input {...register('reference')} className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium">Notes</label>
        <textarea {...register('notes')} className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium">Date</label>
        <input type="date" {...register('date')} className="input" />
        {errors.date && <span className="text-red-500 text-xs">{errors.date.message}</span>}
      </div>
      {error && <div className="text-red-500 text-xs">{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Entry'}
      </button>
    </form>
  );
};

export default FinanceEntryForm;
