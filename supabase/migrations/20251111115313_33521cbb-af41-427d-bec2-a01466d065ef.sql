-- Create enum for product types
CREATE TYPE product_type AS ENUM ('vps', 'mc_server');

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type product_type NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  features JSONB DEFAULT '[]',
  specifications JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products policies (public read)
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Orders policies (users can only see their own orders)
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products
INSERT INTO products (name, description, type, price, features, specifications) VALUES
  ('Starter VPS', 'Perfect for small projects and testing', 'vps', 9.99, 
   '["2 CPU Cores", "4GB RAM", "50GB SSD", "1TB Bandwidth"]',
   '{"cpu": "2 Cores", "ram": "4GB", "storage": "50GB SSD", "bandwidth": "1TB"}'),
  
  ('Pro VPS', 'Ideal for production applications', 'vps', 29.99,
   '["4 CPU Cores", "8GB RAM", "150GB SSD", "3TB Bandwidth", "DDoS Protection"]',
   '{"cpu": "4 Cores", "ram": "8GB", "storage": "150GB SSD", "bandwidth": "3TB"}'),
  
  ('Ultimate VPS', 'Maximum performance for enterprise', 'vps', 79.99,
   '["8 CPU Cores", "16GB RAM", "500GB SSD", "10TB Bandwidth", "DDoS Protection", "Priority Support"]',
   '{"cpu": "8 Cores", "ram": "16GB", "storage": "500GB SSD", "bandwidth": "10TB"}'),
  
  ('Basic MC Server', 'Vanilla Minecraft server source code', 'mc_server', 19.99,
   '["Plugin Support", "Custom Configs", "Anti-Cheat", "Basic Economy"]',
   '{"version": "Latest", "plugins": "5+", "configs": "Customizable"}'),
  
  ('Advanced MC Server', 'Feature-rich Minecraft server pack', 'mc_server', 49.99,
   '["50+ Plugins", "Custom Mini-games", "Advanced Economy", "Admin Panel", "Auto Backups"]',
   '{"version": "Latest", "plugins": "50+", "minigames": "10+", "economy": "Advanced"}'),
  
  ('Ultimate MC Server', 'Complete network-ready server', 'mc_server', 99.99,
   '["100+ Plugins", "Full Network Suite", "Custom Ranks", "Advanced Anti-Cheat", "24/7 Support", "Auto Updates"]',
   '{"version": "Latest", "plugins": "100+", "network": "Multi-server", "support": "24/7"}'
  );