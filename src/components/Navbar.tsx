import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center space-x-2">
          <Mail className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold">EmailCleaner</span>
        </Link>

        {user ? (
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/my-lists">My Lists</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}