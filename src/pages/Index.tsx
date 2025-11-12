import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { ParticleField } from "@/components/ParticleField";
import { Button } from "@/components/ui/button";
import { Server, Zap } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  type: 'vps' | 'mc_server';
  price: number;
  features: string[];
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      const formattedProducts: Product[] = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        type: product.type,
        price: product.price,
        features: Array.isArray(product.features) 
          ? product.features.filter((f): f is string => typeof f === 'string')
          : [],
      }));

      setProducts(formattedProducts);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const vpsProducts = products.filter(p => p.type === 'vps');

  return (
    <div className="min-h-screen relative">
      <ParticleField />
      <Header />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 glow-text animate-float">
            Cheap Vps Hosting 24/7
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            High-performance hosting solutions for your applications
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-accent text-primary-foreground font-semibold"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Zap className="w-5 h-5 mr-2" />
              Browse Products
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="gradient-card p-6 rounded-lg border border-border/50 text-center hover:border-primary/50 transition-all">
              <Server className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Enterprise Grade</h3>
              <p className="text-muted-foreground">Top-tier hardware and 99.9% uptime guarantee</p>
            </div>
            <div className="gradient-card p-6 rounded-lg border border-border/50 text-center hover:border-primary/50 transition-all">
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">NVMe SSDs and premium network infrastructure</p>
            </div>
            <div className="gradient-card p-6 rounded-lg border border-border/50 text-center hover:border-primary/50 transition-all">
              <Server className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Ready to Deploy</h3>
              <p className="text-muted-foreground">Pre-configured setups with instant delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-12 glow-text">VPS Hosting Plans</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vpsProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  type={product.type}
                  price={product.price}
                  features={product.features}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8 px-4 mt-20">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 SkNode. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
