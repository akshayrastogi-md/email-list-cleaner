import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Mail, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { getEmailLists, type EmailList } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

export default function MyLists() {
  const { user } = useAuth();
  const [lists, setLists] = useState<EmailList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      if (user) {
        try {
          const data = await getEmailLists(user.id);
          setLists(data);
        } catch (error) {
          console.error('Error fetching lists:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLists();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Email Lists</h1>
          <Button asChild>
            <Link to="/dashboard">New List</Link>
          </Button>
        </div>

        {lists.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mail className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Lists Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first email list validation
              </p>
              <Button asChild>
                <Link to="/dashboard">Create List</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
              <Card key={list.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{list.name}</CardTitle>
                  <CardDescription>
                    {format(new Date(list.created_at!), 'PPP')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Emails:</span>
                      <span className="font-medium">{list.total_emails}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valid:</span>
                      <span className="font-medium text-green-600">
                        {list.valid_emails}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Invalid:</span>
                      <span className="font-medium text-red-600">
                        {list.invalid_emails}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full mt-4"
                      asChild
                    >
                      <Link to={`/lists/${list.id}`}>
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}