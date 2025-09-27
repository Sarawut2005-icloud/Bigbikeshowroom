import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Eye, Zap, Gauge, Weight } from 'lucide-react';

interface BikeCardProps {
  bike: any;
  onViewDetails: (bike: any) => void;
  index: number;
}

export default function BikeCard({ bike, onViewDetails, index }: BikeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.03, rotateY: 5 }}
      className="group"
    >
      <Card className="card-neon overflow-hidden h-full">
        <div className="relative overflow-hidden">
          {/* Placeholder for bike image */}
          <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl text-primary/30">🏍️</div>
            </div>
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {bike.year}
              </Badge>
            </div>
            <div className="absolute top-2 left-2">
              <Badge variant="outline" className="border-accent text-accent">
                {bike.category}
              </Badge>
            </div>
          </div>
          
          {/* Neon overlay effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-primary/20 via-transparent to-accent/20" />
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Bike Name & Brand */}
            <div>
              <h3 className="text-xl font-bold text-neon group-hover:text-neon-green transition-colors">
                {bike.name}
              </h3>
              <p className="text-muted-foreground font-medium">{bike.brand}</p>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-accent" />
                <span>{bike.horsepower} HP</span>
              </div>
              <div className="flex items-center space-x-2">
                <Gauge className="w-4 h-4 text-secondary" />
                <span>{bike.cc} CC</span>
              </div>
              <div className="flex items-center space-x-2">
                <Weight className="w-4 h-4 text-destructive" />
                <span>{bike.weight}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-primary" />
                <span>{bike.topSpeed}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-neon">
                  ₹{(bike.price / 1000).toFixed(0)}K
                </span>
                <span className="text-muted-foreground ml-1">onwards</span>
              </div>
            </div>

            {/* Action Button */}
              <Button 
                onClick={() => onViewDetails(bike)}
                variant="neon"
                className="w-full group-hover:variant-neon-green transition-all duration-300"
              >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}