import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  onBrandFilter: (brand: string) => void;
  onSearch: (query: string) => void;
  selectedBrand: string;
  searchQuery: string;
}

const brands = ['All', 'Yamaha', 'Honda', 'Kawasaki', 'Ducati', 'BMW'];

export default function Navbar({ onBrandFilter, onSearch, selectedBrand, searchQuery }: NavbarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-primary/20"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-background">BB</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-neon">BigBike</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Showroom</p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search bikes..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 bg-card/50 border-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Brand Filters */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden"
            >
              <Filter className="w-4 h-4" />
            </Button>
            
            <div className="hidden lg:flex space-x-2">
              {brands.map((brand) => (
                <motion.div key={brand} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Badge
                    variant={selectedBrand === brand ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedBrand === brand 
                        ? 'bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.5)]' 
                        : 'border-primary/30 hover:border-primary/60 hover:bg-primary/10'
                    }`}
                    onClick={() => onBrandFilter(brand)}
                  >
                    {brand}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Filter Menu */}
        {isFilterOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 flex flex-wrap gap-2"
          >
            {brands.map((brand) => (
              <Badge
                key={brand}
                variant={selectedBrand === brand ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedBrand === brand 
                    ? 'bg-primary text-primary-foreground' 
                    : 'border-primary/30 hover:border-primary/60'
                }`}
                onClick={() => {
                  onBrandFilter(brand);
                  setIsFilterOpen(false);
                }}
              >
                {brand}
              </Badge>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}