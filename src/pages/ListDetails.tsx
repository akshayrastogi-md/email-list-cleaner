import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Download, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getEmailList, type EmailList } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Papa from 'papaparse';

export default function ListDetails() {
  const { id } = useParams<{ id: string }>();
  const [list, setList] = useState<EmailList | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      if (id) {
        try {
          const data = await getEmailList(parseInt(id));
          setList(data);
        } catch (error) {
          console.error('Error fetching list:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchList();
  }, [id]);

  const downloadResults = () => {
    if (!list) return;

    const csv = Papa.unparse(list.results);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${list.name}-results.csv`;
    a.click();
  };

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

  if (!list) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mail className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">List Not Found</h3>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{list.name}</h1>
            <p className="text-muted-foreground">
              Created on {format(new Date(list.created_at!), 'PPP')}
            </p>
          </div>
          <Button onClick={downloadResults}>
            <Download className="w-4 h-4 mr-2" />
            Download Results
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{list.total_emails}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Valid Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {list.valid_emails}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Invalid Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">
                {list.invalid_emails}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {list.results.map((result: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{result.email}</td>
                      <td className="py-3 px-4">{result.name || '-'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            result.isValid
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {result.isValid ? 'Valid' : 'Invalid'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {result.reason || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}