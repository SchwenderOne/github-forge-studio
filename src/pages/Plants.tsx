import { Droplets, Calendar, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Plant {
  id: string;
  name: string;
  species: string;
  location: string;
  lastWatered: string;
  nextWatering: string;
  wateredBy: 'user1' | 'user2';
  wateringFrequency: number; // days
  status: 'healthy' | 'needs-water' | 'overdue';
  notes?: string;
}

const Plants = () => {
  const plants: Plant[] = [
    {
      id: '1',
      name: 'Monstera',
      species: 'Monstera Deliciosa',
      location: 'Living Room',
      lastWatered: '2024-01-13',
      nextWatering: '2024-01-17',
      wateredBy: 'user1',
      wateringFrequency: 7,
      status: 'overdue',
      notes: 'Loves bright indirect light'
    },
    {
      id: '2',
      name: 'Snake Plant',
      species: 'Sansevieria',
      location: 'Bedroom',
      lastWatered: '2024-01-10',
      nextWatering: '2024-01-24',
      wateredBy: 'user2',
      wateringFrequency: 14,
      status: 'healthy'
    },
    {
      id: '3',
      name: 'Pothos',
      species: 'Epipremnum Aureum',
      location: 'Kitchen',
      lastWatered: '2024-01-15',
      nextWatering: '2024-01-18',
      wateredBy: 'user1',
      wateringFrequency: 5,
      status: 'needs-water'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-destructive text-destructive-foreground';
      case 'needs-water': return 'bg-accent-peach text-accent-peach-foreground';
      case 'healthy': return 'bg-primary-soft text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'needs-water': return <Droplets className="h-4 w-4" />;
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'overdue': return 'Overdue!';
      case 'needs-water': return 'Water soon';
      case 'healthy': return 'Healthy';
      default: return 'Unknown';
    }
  };

  const markWatered = (plantId: string) => {
    console.log(`Marked plant ${plantId} as watered`);
  };

  const plantsNeedingWater = plants.filter(plant => 
    plant.status === 'overdue' || plant.status === 'needs-water'
  );

  return (
    <div className="min-h-screen bg-gradient-soft p-4 pb-24 space-y-6">
      {/* Header */}
      <div className="text-center pt-8 pb-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">Plants 🌱</h1>
        <p className="text-muted-foreground">Keep your green friends happy</p>
      </div>

      {/* Today's Watering */}
      {plantsNeedingWater.length > 0 && (
        <Card className="max-w-md mx-auto bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg text-foreground flex items-center">
              <Droplets className="mr-2 h-5 w-5" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {plantsNeedingWater.map((plant) => (
              <div key={plant.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{plant.name}</p>
                  <p className="text-sm text-muted-foreground">{plant.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(plant.status)}`}>
                    {getStatusIcon(plant.status)}
                    <span>{getStatusText(plant.status)}</span>
                  </span>
                  <Button size="sm" onClick={() => markWatered(plant.id)} className="bg-gradient-primary text-primary-foreground">
                    <Droplets className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* All Plants */}
      <Card className="max-w-md mx-auto bg-gradient-card shadow-card border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg text-foreground">All Plants</CardTitle>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Plant
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {plants.map((plant) => (
            <div key={plant.id} className="p-4 bg-background/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{plant.name}</h3>
                  <p className="text-sm text-muted-foreground">{plant.species}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(plant.status)}`}>
                  {getStatusIcon(plant.status)}
                  <span>{getStatusText(plant.status)}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <p className="text-muted-foreground mb-1">Location</p>
                  <p className="text-foreground">{plant.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Watering frequency</p>
                  <p className="text-foreground">Every {plant.wateringFrequency} days</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <p className="text-muted-foreground mb-1">Last watered</p>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-foreground">{new Date(plant.lastWatered).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    by {plant.wateredBy === 'user1' ? 'You' : 'Roommate'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Next watering</p>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-foreground">{new Date(plant.nextWatering).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {plant.notes && (
                <div className="mb-3">
                  <p className="text-muted-foreground text-xs mb-1">Notes</p>
                  <p className="text-sm text-foreground italic">{plant.notes}</p>
                </div>
              )}

              <Button 
                onClick={() => markWatered(plant.id)} 
                className="w-full bg-gradient-primary text-primary-foreground"
                size="sm"
              >
                <Droplets className="mr-2 h-4 w-4" />
                Mark as Watered
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Plants;