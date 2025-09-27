import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Zap, Gauge, Weight, TrendingUp, Fuel, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import ThreeScene from '@/components/ThreeScene';
import bikesData from '@/data/bikes.json';

export default function BikeDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [bike, setBike] = useState<any>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const foundBike = bikesData.find(b => b.slug === slug);
    if (foundBike) {
      setBike(foundBike);
    } else {
      navigate('/');
    }
  }, [slug, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrolled / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!bike) {
    return (
      <div className="min-h-screen bg-cyber flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-primary mb-4">🏍️</div>
          <h2 className="text-2xl font-bold">Loading...</h2>
        </div>
      </div>
    );
  }

  const specs = [
    { icon: Gauge, label: 'Engine', value: `${bike.cc} CC`, color: 'text-primary' },
    { icon: Zap, label: 'Power', value: `${bike.horsepower} HP`, color: 'text-accent' },
    { icon: Fuel, label: 'Torque', value: bike.torque, color: 'text-secondary' },
    { icon: TrendingUp, label: 'Top Speed', value: bike.topSpeed, color: 'text-destructive' },
    { icon: Weight, label: 'Weight', value: bike.weight, color: 'text-muted-foreground' },
    { icon: Calendar, label: 'Year', value: bike.year.toString(), color: 'text-primary' },
  ];

  return (
    <div className="min-h-screen bg-cyber">
      {/* Fixed 3D Scene Background */}
      <div className="fixed inset-0 z-0">
        <ThreeScene 
          currentBike={bike} 
          scrollProgress={scrollProgress} 
          isDetailView={true}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background/80 backdrop-blur-lg border-b border-primary/20"
        >
          <div className="container mx-auto px-6 py-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4 text-primary hover:text-accent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Showroom
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <motion.h1 
                  className="text-4xl md:text-6xl font-bold text-neon mb-2"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {bike.name}
                </motion.h1>
                <motion.p 
                  className="text-xl text-muted-foreground"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {bike.brand} • {bike.category}
                </motion.p>
              </div>
              
              <motion.div 
                className="mt-4 md:mt-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-right">
                  <div className="text-3xl font-bold text-neon">
                    ₹{(bike.price / 1000).toFixed(0)}K
                  </div>
                  <div className="text-muted-foreground">onwards</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Specifications */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="card-neon">
                <CardHeader>
                  <CardTitle className="text-neon">Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specs.map((spec, index) => (
                      <motion.div
                        key={spec.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20 border border-primary/10"
                      >
                        <spec.icon className={`w-5 h-5 ${spec.color}`} />
                        <div>
                          <div className="text-sm text-muted-foreground">{spec.label}</div>
                          <div className="font-semibold">{spec.value}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Description & Features */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-6"
            >
              <Card className="card-neon">
                <CardHeader>
                  <CardTitle className="text-neon">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {bike.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="card-neon">
                <CardHeader>
                  <CardTitle className="text-neon">Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {bike.features.map((feature: string, index: number) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <Badge 
                          variant="outline" 
                          className="border-accent text-accent hover:bg-accent/10"
                        >
                          {feature}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <Button className="w-full" variant="cyber" size="lg">
                  Book Test Ride
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="bg-background/80 backdrop-blur-lg rounded-full px-4 py-2 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              Scroll to rotate • Use mouse to orbit
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}