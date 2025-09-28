import { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import BikeCard from '@/components/BikeCard';
import ThreeScene from '@/components/ThreeScene';
import bikesData from '@/data/bikes.json';

// Lazy load the BikeViewer for better performance
const BikeViewer = lazy(() => import('@/components/BikeViewer'));

export default function Index() {
  const [bikes, setBikes] = useState(bikesData);
  const [filteredBikes, setFilteredBikes] = useState(bikesData);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBikeIndex, setCurrentBikeIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedBike, setSelectedBike] = useState<any>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Handle brand filter
  const handleBrandFilter = (brand: string) => {
    setSelectedBrand(brand);
    let filtered = bikes;
    
    if (brand !== 'All') {
      filtered = bikes.filter(bike => bike.brand === brand);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(bike => 
        bike.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredBikes(filtered);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    let filtered = bikes;
    
    if (selectedBrand !== 'All') {
      filtered = bikes.filter(bike => bike.brand === selectedBrand);
    }
    
    if (query) {
      filtered = filtered.filter(bike => 
        bike.name.toLowerCase().includes(query.toLowerCase()) ||
        bike.brand.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFilteredBikes(filtered);
  };

  // Handle bike details navigation - Open 3D viewer instead of navigation
  const handleViewDetails = (bike: any) => {
    setSelectedBike(bike);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedBike(null);
  };

  // Handle scroll for 3D interaction
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrolled / maxScroll, 1);
      setScrollProgress(progress);
      
      // Calculate which bike should be displayed based on scroll
      const sectionHeight = maxScroll / filteredBikes.length;
      const index = Math.min(
        Math.floor(scrolled / sectionHeight), 
        filteredBikes.length - 1
      );
      setCurrentBikeIndex(index);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredBikes.length]);

  const currentBike = filteredBikes[currentBikeIndex];

  return (
    <div className="min-h-screen bg-cyber">
      {/* Navigation */}
      <Navbar 
        onBrandFilter={handleBrandFilter}
        onSearch={handleSearch}
        selectedBrand={selectedBrand}
        searchQuery={searchQuery}
      />

      {/* Hero Section with 3D Bike */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <ThreeScene 
            currentBike={currentBike} 
            scrollProgress={scrollProgress}
          />
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 grid-cyber opacity-20" />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-primary/60"
            >
              
            </motion.div>
          </motion.div>
        </div>

        {/* Current Bike Info Overlay */}
        {currentBike && (
          <motion.div
            key={currentBike.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute left-8 bottom-8 z-10 bg-background/80 backdrop-blur-lg rounded-xl p-6 border border-primary/20"
          >
            <h3 className="text-xl font-bold text-neon">{currentBike.name}</h3>
            <p className="text-muted-foreground">{currentBike.brand}</p>
            <div className="mt-2 flex items-center space-x-4 text-sm">
              <span className="text-accent">{currentBike.horsepower} HP</span>
              <span className="text-secondary">{currentBike.cc} CC</span>
              <span className="text-destructive">₹{(currentBike.price / 1000).toFixed(0)}K</span>
            </div>
          </motion.div>
        )}
      </section>

      {/* Bikes Grid Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-neon mb-4">
              คอลเลกชันของเรา
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ค้นพบมอเตอร์ไซค์ระดับพรีเมียมที่เราคัดสรรมาเป็นพิเศษ ซึ่งแต่ละคันได้รับการออกแบบเพื่อประสิทธิภาพและสไตล์
            </p>
          </motion.div>

          {filteredBikes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl text-primary/30 mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-muted-foreground mb-2">ไม่พบจักรยายน</h3>
              <p className="text-muted-foreground">พยายามหาด้วยคีย์เวิร์ด เช่น Yamaha,Honda,Kawasaki</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBikes.map((bike, index) => (
                <BikeCard
                  key={bike.id}
                  bike={bike}
                  onViewDetails={handleViewDetails}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3D Bike Viewer Modal */}
      <Suspense fallback={<div />}>
        <BikeViewer 
          bike={selectedBike}
          isOpen={isViewerOpen}
          onClose={handleCloseViewer}
        />
      </Suspense>

      {/* Footer */}
      <footer className="relative py-12 border-t border-primary/20">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-neon mb-2">BigBike Showroom</h3>
            <p className="text-muted-foreground">The future of motorcycles, today</p>
          </div>
          <div className="text-sm text-muted-foreground">
            Built with React Three Fiber • Cyberpunk Design System
          </div>
        </div>
      </footer>
    </div>
  );
}