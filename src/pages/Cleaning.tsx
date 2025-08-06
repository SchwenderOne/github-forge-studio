import { Calendar, CheckCircle, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Room {
  id: string;
  name: string;
  lastCleaned: string;
  lastCleanedBy: 'user1' | 'user2';
  nextDue: string;
  nextAssignedTo: 'user1' | 'user2';
  priority: 'low' | 'medium' | 'high' | 'overdue';
}

const Cleaning = () => {
  const rooms: Room[] = [
    {
      id: '1',
      name: 'Bathroom',
      lastCleaned: '2024-01-10',
      lastCleanedBy: 'user2',
      nextDue: '2024-01-17',
      nextAssignedTo: 'user1',
      priority: 'overdue'
    },
    {
      id: '2',
      name: 'Kitchen',
      lastCleaned: '2024-01-14',
      lastCleanedBy: 'user1',
      nextDue: '2024-01-18',
      nextAssignedTo: 'user2',
      priority: 'high'
    },
    {
      id: '3',
      name: 'Living Room',
      lastCleaned: '2024-01-12',
      lastCleanedBy: 'user1',
      nextDue: '2024-01-19',
      nextAssignedTo: 'user1',
      priority: 'medium'
    },
    {
      id: '4',
      name: 'Hallway',
      lastCleaned: '2024-01-13',
      lastCleanedBy: 'user2',
      nextDue: '2024-01-20',
      nextAssignedTo: 'user2',
      priority: 'low'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'overdue': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-accent-rose text-accent-rose-foreground';
      case 'medium': return 'bg-accent-peach text-accent-peach-foreground';
      case 'low': return 'bg-accent-sky text-accent-sky-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'overdue': return 'Overdue!';
      case 'high': return 'Due soon';
      case 'medium': return 'Due this week';
      case 'low': return 'Due later';
      default: return '';
    }
  };

  const markCleaned = (roomId: string) => {
    console.log(`Marked room ${roomId} as cleaned`);
  };

  return (
    <div className="min-h-screen bg-gradient-soft p-4 pb-24 space-y-6">
      {/* Header */}
      <div className="text-center pt-8 pb-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">Cleaning ✨</h1>
        <p className="text-muted-foreground">Keep your space spotless together</p>
      </div>

      {/* Today's Tasks */}
      <Card className="max-w-md mx-auto bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Today's Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rooms.filter(room => room.priority === 'overdue' || room.priority === 'high').map((room) => (
            <div key={room.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg mb-3">
              <div>
                <p className="font-medium text-foreground">{room.name}</p>
                <p className="text-sm text-muted-foreground">
                  Assigned to: {room.nextAssignedTo === 'user1' ? 'You' : 'Roommate'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(room.priority)}`}>
                  {getPriorityText(room.priority)}
                </span>
                {room.nextAssignedTo === 'user1' && (
                  <Button size="sm" onClick={() => markCleaned(room.id)} className="bg-gradient-primary text-primary-foreground">
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* All Rooms */}
      <Card className="max-w-md mx-auto bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">All Rooms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rooms.map((room) => (
            <div key={room.id} className="p-4 bg-background/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">{room.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(room.priority)}`}>
                  {getPriorityText(room.priority)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Last cleaned</p>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-foreground">{new Date(room.lastCleaned).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {room.lastCleanedBy === 'user1' ? 'You' : 'Roommate'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-muted-foreground mb-1">Next due</p>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-foreground">{new Date(room.nextDue).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {room.nextAssignedTo === 'user1' ? 'You' : 'Roommate'}
                    </span>
                  </div>
                </div>
              </div>

              {room.nextAssignedTo === 'user1' && (
                <Button 
                  onClick={() => markCleaned(room.id)} 
                  className="w-full mt-3 bg-gradient-primary text-primary-foreground"
                  size="sm"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Cleaned
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Cleaning;