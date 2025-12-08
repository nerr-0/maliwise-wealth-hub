import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usePortfolioHoldings, useTransactions } from '@/hooks/usePortfolio';
import { useToast } from '@/hooks/use-toast';

const AIInsights = () => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: holdings } = usePortfolioHoldings();
  const { data: transactions } = useTransactions();
  const { toast } = useToast();

  const generateInsights = async () => {
    if (!holdings || !transactions) {
      toast({
        title: "No Data",
        description: "Add some transactions first to get AI insights",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-investment-insights', {
        body: {
          portfolioData: holdings,
          transactions: transactions
        }
      });

      if (error) throw error;

      setInsights(data.insights);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate insights",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Investment Insights
        </CardTitle>
        <CardDescription>
          Get personalized investment recommendations based on your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={generateInsights} 
            disabled={loading || !holdings?.length}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Insights...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate AI Insights
              </>
            )}
          </Button>

          {insights && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Investment Recommendations:</h4>
              <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                {insights}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;