import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAddTransaction } from '@/hooks/usePortfolio';
import { useToast } from '@/hooks/use-toast';

// Validation schema for transaction form
const transactionSchema = z.object({
  transaction_type: z.enum(['buy', 'sell', 'dividend', 'deposit', 'withdrawal'], {
    required_error: 'Please select a transaction type',
  }),
  asset_type: z.enum(['stock', 'bond', 'reit', 'mmf', 'chama', 'sacco', 'treasury_bill'], {
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
});

type TransactionFormData = z.infer<typeof transactionSchema>;

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
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addTransaction = useAddTransaction();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Parse and validate form data
    const dataToValidate = {
      transaction_type: formData.transaction_type || undefined,
      asset_type: formData.asset_type || undefined,
      asset_name: formData.asset_name.trim(),
      amount: formData.amount ? parseFloat(formData.amount) : undefined,
      quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
      price_per_unit: formData.price_per_unit ? parseFloat(formData.price_per_unit) : undefined,
      fees: formData.fees ? parseFloat(formData.fees) : undefined,
      transaction_date: formData.transaction_date,
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

    // Reset form
    setFormData({
      transaction_type: '',
      asset_name: '',
      asset_type: '',
      amount: '',
      quantity: '',
      price_per_unit: '',
      fees: '',
      transaction_date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
        <CardDescription>
          Record a new investment transaction
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
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                  <SelectItem value="dividend">Dividend</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
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
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="bond">Bond</SelectItem>
                  <SelectItem value="reit">REIT</SelectItem>
                  <SelectItem value="mmf">Money Market Fund</SelectItem>
                  <SelectItem value="chama">Chama</SelectItem>
                  <SelectItem value="sacco">SACCO</SelectItem>
                  <SelectItem value="treasury_bill">Treasury Bill</SelectItem>
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
                placeholder="e.g., Safaricom, KCB Group"
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
                placeholder="Number of shares/units"
                className={errors.quantity ? 'border-destructive' : ''}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_per_unit">Price per Unit (Optional)</Label>
              <Input
                id="price_per_unit"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price_per_unit}
                onChange={(e) => setFormData(prev => ({ ...prev, price_per_unit: e.target.value }))}
                placeholder="0.00"
                className={errors.price_per_unit ? 'border-destructive' : ''}
              />
              {errors.price_per_unit && (
                <p className="text-sm text-destructive">{errors.price_per_unit}</p>
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
                placeholder="0.00"
                className={errors.fees ? 'border-destructive' : ''}
              />
              {errors.fees && (
                <p className="text-sm text-destructive">{errors.fees}</p>
              )}
            </div>

            <div className="space-y-2">
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
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={addTransaction.isPending}
          >
            {addTransaction.isPending ? 'Adding...' : 'Add Transaction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;