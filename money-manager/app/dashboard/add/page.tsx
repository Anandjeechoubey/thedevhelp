'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCurrency } from '@/lib/currencyContext';
import { SpendLogSchema } from '@/lib/schemas';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function AddSpendPage() {
  const router = useRouter();
  const { currency, symbol } = useCurrency();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<z.infer<typeof SpendLogSchema>>({
    resolver: zodResolver(SpendLogSchema),
    defaultValues: {
      category: '',
      note: '',
      amount: undefined,
      date: new Date().toISOString().split('T')[0], // Today's date
      payment_method: 'Card',
    },
  });

  const onSubmit = async (data: z.infer<typeof SpendLogSchema>) => {
    const toastId = toast.loading('Adding spend log...');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to add a spend.', { id: toastId });
        router.push('/login');
        return;
      }

      const { error } = await supabase.from('spend_logs').insert([{ ...data, user_id: user.id }]);

      if (error) {
        toast.error(error.message, { id: toastId });
        return;
      }

      toast.success('Spend log added successfully!', { id: toastId });
      router.push('/dashboard');
    } catch (error) {
      toast.error('An unexpected error occurred.', { id: toastId });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Add New Spend</h2>
        <Link href="/dashboard" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 border border-gray-50 dark:border-gray-700 transition-colors duration-200">
        <div>
          <Label htmlFor="category" className="dark:text-gray-200">Category</Label>
          <Input id="category" {...register('category')} placeholder="e.g., Food, Transport" className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
          {errors.category && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>}
        </div>

        <div>
          <Label htmlFor="amount" className="dark:text-gray-200">Amount ({currency})</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 dark:text-gray-300">{symbol}</span>
            <Input 
              id="amount" 
              type="number" 
              step="0.01" 
              {...register('amount')} 
              placeholder="0.00" 
              className="pl-6 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          {errors.amount && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount.message}</p>}
        </div>

        <div>
          <Label htmlFor="date" className="dark:text-gray-200">Date</Label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
        </div>

        <div>
          <Label htmlFor="payment_method" className="dark:text-gray-200">Payment Method</Label>
          <Input id="payment_method" {...register('payment_method')} placeholder="e.g., Card, Cash, UPI" className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
          {errors.payment_method && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.payment_method.message}</p>}
        </div>

        <div>
          <Label htmlFor="note" className="dark:text-gray-200">Note (Optional)</Label>
          <Input id="note" {...register('note')} placeholder="e.g., Lunch with friends" className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
          {errors.note && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.note.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full dark:bg-indigo-700 dark:hover:bg-indigo-800 dark:text-white transition-colors duration-200">
          {isSubmitting ? 'Adding...' : 'Add Spend'}
        </Button>
      </form>
    </div>
  );
}

