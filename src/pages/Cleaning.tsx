import { Calendar, CheckCircle, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRooms } from "@/hooks/useRooms";
import { useAuth } from "@/hooks/useAuth";

const Cleaning = () => {
  const { rooms, todaysTasks, isLoading, markCleaned } = useRooms();
  const { user } = useAuth();

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-soft p-8 pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading cleaning tasks...</p>
        </div>
      </div>
    );
  }

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
          {todaysTasks.map((room) => (
            <div key={room.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg mb-3">
              <div>
                <p className="font-medium text-foreground">{room.name}</p>
                <p className="text-sm text-muted-foreground">
                  Assigned to: {room.next_assigned_to ? (room.next_assigned_to === user?.id ? 'You' : 'Roommate') : 'Unassigned'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(room.priority)}`}>
                  {getPriorityText(room.priority)}
                </span>
                {room.next_assigned_to === user?.id && (
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
                  {room.last_cleaned_date ? (
                    <>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-foreground">{new Date(room.last_cleaned_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {room.last_cleaned_by && room.last_cleaned_by === user?.id ? 'You' : 'Roommate'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-foreground">Never cleaned</p>
                  )}
                </div>
                
                <div>
                  <p className="text-muted-foreground mb-1">Next due</p>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-foreground">Due soon</span>
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {room.next_assigned_to ? (room.next_assigned_to === user?.id ? 'You' : 'Roommate') : 'Unassigned'}
                    </span>
                  </div>
                </div>
              </div>

              {room.next_assigned_to === user?.id && (
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