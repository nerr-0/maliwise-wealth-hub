import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAddTransaction } from '@/hooks/usePortfolio';

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

  const addTransaction = useAddTransaction();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addTransaction.mutate({
      transaction_type: formData.transaction_type,
      asset_name: formData.asset_name,
      asset_type: formData.asset_type,
      amount: parseFloat(formData.amount),
      quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
      price_per_unit: formData.price_per_unit ? parseFloat(formData.price_per_unit) : undefined,
      fees: formData.fees ? parseFloat(formData.fees) : 0,
      transaction_date: formData.transaction_date,
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
                <SelectTrigger>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset_type">Asset Type</Label>
              <Select
                value={formData.asset_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, asset_type: value }))}
              >
                <SelectTrigger>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset_name">Asset Name</Label>
              <Input
                id="asset_name"
                value={formData.asset_name}
                onChange={(e) => setFormData(prev => ({ ...prev, asset_name: e.target.value }))}
                placeholder="e.g., Safaricom, KCB Group"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (KES)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (Optional)</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="Number of shares/units"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_per_unit">Price per Unit (Optional)</Label>
              <Input
                id="price_per_unit"
                type="number"
                step="0.01"
                value={formData.price_per_unit}
                onChange={(e) => setFormData(prev => ({ ...prev, price_per_unit: e.target.value }))}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fees">Fees (Optional)</Label>
              <Input
                id="fees"
                type="number"
                step="0.01"
                value={formData.fees}
                onChange={(e) => setFormData(prev => ({ ...prev, fees: e.target.value }))}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction_date">Transaction Date</Label>
              <Input
                id="transaction_date"
                type="date"
                value={formData.transaction_date}
                onChange={(e) => setFormData(prev => ({ ...prev, transaction_date: e.target.value }))}
                required
              />
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