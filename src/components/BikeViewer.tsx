import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, ZoomIn, ZoomOut, Move3D } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThreeScene from './ThreeScene';

interface BikeViewerProps {
  bike: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function BikeViewer({ bike, isOpen, onClose }: BikeViewerProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleReset = useCallback(() => {
    setScrollProgress(0);
  }, []);

  if (!bike) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
        >
          {/* Header */}
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-lg border-b border-primary/20 p-4"
          >
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-neon">{bike.name}</h2>
                <p className="text-muted-foreground">{bike.brand} • {bike.category}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* 3D Scene */}
          <div className="absolute inset-0 pt-20">
            <ThreeScene 
              currentBike={bike} 
              scrollProgress={scrollProgress} 
              isDetailView={true}
            />
          </div>

          {/* Controls Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className="bg-background/90 backdrop-blur-lg rounded-xl p-4 border border-primary/20">
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Move3D className="w-4 h-4 text-primary" />
                  <span>Drag to rotate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ZoomIn className="w-4 h-4 text-accent" />
                  <span>Scroll to zoom</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4 text-secondary" />
                  <span>Click reset to center</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bike Info Panel */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute left-4 top-24 bottom-4 w-80 bg-background/90 backdrop-blur-lg rounded-xl border border-primary/20 p-6 overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Price */}
              <div className="text-center">
                <div className="text-3xl font-bold text-neon">
                  ₹{(bike.price / 1000).toFixed(0)}K
                </div>
                <div className="text-muted-foreground">onwards</div>
              </div>

              {/* Key Specs */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary">Key Specifications</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-muted/20 rounded-lg p-3">
                    <div className="text-muted-foreground">Engine</div>
                    <div className="font-semibold">{bike.cc} CC</div>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-3">
                    <div className="text-muted-foreground">Power</div>
                    <div className="font-semibold text-accent">{bike.horsepower} HP</div>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-3">
                    <div className="text-muted-foreground">Torque</div>
                    <div className="font-semibold">{bike.torque}</div>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-3">
                    <div className="text-muted-foreground">Top Speed</div>
                    <div className="font-semibold text-destructive">{bike.topSpeed}</div>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-3">
                    <div className="text-muted-foreground">Weight</div>
                    <div className="font-semibold">{bike.weight}</div>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-3">
                    <div className="text-muted-foreground">Year</div>
                    <div className="font-semibold">{bike.year}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {bike.description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary">Key Features</h3>
                <div className="flex flex-wrap gap-2">
                  {bike.features?.map((feature: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-accent/20 text-accent rounded-md border border-accent/30"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Button variant="cyber" className="w-full">
                Book Test Ride
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}