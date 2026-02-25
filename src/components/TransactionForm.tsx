import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAddTransaction } from '@/hooks/usePortfolio';
import { useToast } from '@/hooks/use-toast';

const transactionSchema = z.object({
  transaction_type: z.enum(['purchase', 'sale', 'valuation', 'income'], {
    required_error: 'Please select a transaction type',
  }),
  asset_type: z.enum(['motor_vehicle', 'land', 'real_estate', 'business', 'art_collectibles', 'livestock', 'personal_loan', 'other'], {
    required_error: 'Please select an asset type',
  }),
  asset_name: z.string()
    .min(1, 'Asset name is required')
    .max(100, 'Asset name must be less than 100 characters')
    .trim(),
  amount: z.number()
    .positive('Amount must be greater than 0')
    .max(1000000000, 'Amount exceeds maximum limit'),
  quantity: z.number().positive('Quantity must be greater than 0').optional(),
  price_per_unit: z.number().positive('Price must be greater than 0').optional(),
  fees: z.number().min(0, 'Fees cannot be negative').max(1000000, 'Fees exceed maximum limit').optional(),
  transaction_date: z.string().min(1, 'Transaction date is required'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

const ASSET_TYPE_LABELS: Record<string, string> = {
  motor_vehicle: 'Motor Vehicle',
  land: 'Land',
  real_estate: 'Real Estate (Property)',
  business: 'Business',
  art_collectibles: 'Art & Collectibles',
  livestock: 'Livestock',
  personal_loan: 'Personal Loan (Given)',
  other: 'Other',
};

const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  purchase: 'Purchase',
  sale: 'Sale',
  valuation: 'Valuation Update',
  income: 'Income',
};

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    transaction_type: '',
    asset_name: '',
    asset_type: '',
    amount: '',
    quantity: '',
    price_per_unit: '',
    fees: '',
    transaction_date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addTransaction = useAddTransaction();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const dataToValidate = {
      transaction_type: formData.transaction_type || undefined,
      asset_type: formData.asset_type || undefined,
      asset_name: formData.asset_name.trim(),
      amount: formData.amount ? parseFloat(formData.amount) : undefined,
      quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
      price_per_unit: formData.price_per_unit ? parseFloat(formData.price_per_unit) : undefined,
      fees: formData.fees ? parseFloat(formData.fees) : undefined,
      transaction_date: formData.transaction_date,
      notes: formData.notes.trim() || undefined,
    };

    const result = transactionSchema.safeParse(dataToValidate);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        variant: 'destructive',
      });
      return;
    }

    addTransaction.mutate({
      transaction_type: result.data.transaction_type,
      asset_name: result.data.asset_name,
      asset_type: result.data.asset_type,
      amount: result.data.amount,
      quantity: result.data.quantity,
      price_per_unit: result.data.price_per_unit,
      fees: result.data.fees ?? 0,
      transaction_date: result.data.transaction_date,
      status: 'completed',
    });

    setFormData({
      transaction_type: '',
      asset_name: '',
      asset_type: '',
      amount: '',
      quantity: '',
      price_per_unit: '',
      fees: '',
      transaction_date: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Asset Transaction</CardTitle>
        <CardDescription>
          Log purchases, sales, or valuations for assets not tracked by connected platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transaction_type">Transaction Type</Label>
              <Select
                value={formData.transaction_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, transaction_type: value }))}
              >
                <SelectTrigger className={errors.transaction_type ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TRANSACTION_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.transaction_type && (
                <p className="text-sm text-destructive">{errors.transaction_type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset_type">Asset Type</Label>
              <Select
                value={formData.asset_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, asset_type: value }))}
              >
                <SelectTrigger className={errors.asset_type ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ASSET_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.asset_type && (
                <p className="text-sm text-destructive">{errors.asset_type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset_name">Asset Name</Label>
              <Input
                id="asset_name"
                value={formData.asset_name}
                onChange={(e) => setFormData(prev => ({ ...prev, asset_name: e.target.value }))}
                placeholder="e.g., Toyota Hilux, Kitengela Plot"
                maxLength={100}
                className={errors.asset_name ? 'border-destructive' : ''}
              />
              {errors.asset_name && (
                <p className="text-sm text-destructive">{errors.asset_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (KES)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max="1000000000"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                className={errors.amount ? 'border-destructive' : ''}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (Optional)</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="e.g., 1 for a car, 2 for plots"
                className={errors.quantity ? 'border-destructive' : ''}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fees">Fees (Optional)</Label>
              <Input
                id="fees"
                type="number"
                step="0.01"
                min="0"
                max="1000000"
                value={formData.fees}
                onChange={(e) => setFormData(prev => ({ ...prev, fees: e.target.value }))}
                placeholder="e.g., stamp duty, legal fees"
                className={errors.fees ? 'border-destructive' : ''}
              />
              {errors.fees && (
                <p className="text-sm text-destructive">{errors.fees}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="transaction_date">Transaction Date</Label>
              <Input
                id="transaction_date"
                type="date"
                value={formData.transaction_date}
                onChange={(e) => setFormData(prev => ({ ...prev, transaction_date: e.target.value }))}
                className={errors.transaction_date ? 'border-destructive' : ''}
              />
              {errors.transaction_date && (
                <p className="text-sm text-destructive">{errors.transaction_date}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="e.g., Location, registration number, description..."
                maxLength={500}
                className={errors.notes ? 'border-destructive' : ''}
                rows={3}
              />
              {errors.notes && (
                <p className="text-sm text-destructive">{errors.notes}</p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={addTransaction.isPending}
          >
            {addTransaction.isPending ? 'Recording...' : 'Record Transaction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
