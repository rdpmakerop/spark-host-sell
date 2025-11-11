import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Server, Box } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  type: 'vps' | 'mc_server';
  price: number;
  features: string[];
}

export const ProductCard = ({ id, name, description, type, price, features }: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleOrder = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/auth");
      return;
    }

    setIsLoading(true);
    
    const { error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        product_id: id,
        total_price: price,
        status: 'pending'
      });

    setIsLoading(false);

    if (error) {
      toast.error("Failed to place order");
      return;
    }

    toast.success("Order placed successfully!");
    navigate("/orders");
  };

  const Icon = type === 'vps' ? Server : Box;

  return (
    <Card className="gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <Icon className="w-10 h-10 text-primary mb-4 group-hover:text-accent transition-colors" />
          <Badge variant="secondary" className="text-xs">
            {type === 'vps' ? 'VPS' : 'MC Server'}
          </Badge>
        </div>
        <CardTitle className="text-2xl font-bold">{name}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-foreground/90">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div className="w-full flex items-baseline justify-between">
          <span className="text-3xl font-bold text-primary">${price}</span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
        <Button 
          onClick={handleOrder}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold"
        >
          {isLoading ? 'Processing...' : 'Order Now'}
        </Button>
      </CardFooter>
    </Card>
  );
};
