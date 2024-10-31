import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Upload, Mail, AlertCircle, CheckCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface EmailValidationResult {
  email: string;
  name?: string;
  isValid: boolean;
  reason?: string;
}

interface ColumnMapping {
  email: string;
  name?: string;
}

export default function Dashboard() {
  const [results, setResults] = useState<EmailValidationResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [headers, setHeaders] = useState<string[]>([]);
  const [showMapping, setShowMapping] = useState(false);
  const [mapping, setMapping] = useState<ColumnMapping>({ email: '', name: '' });
  const [csvData, setCsvData] = useState<any[]>([]);

  const validateEmail = async (email: string): Promise<EmailValidationResult> => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { email, isValid: false, reason: 'Invalid format' };
    }

    const [, domain] = email.split('@');
    try {
      const response = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
      const data = await response.json();
      if (!data.Answer) {
        return { email, isValid: false, reason: 'Invalid domain' };
      }
    } catch {
      return { email, isValid: false, reason: 'Domain verification failed' };
    }

    return { email, isValid: true };
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const headers = Object.keys(results.data[0]);
        setHeaders(headers);
        setCsvData(results.data);
        setShowMapping(true);
        setResults([]);
      },
      error: () => {
        toast.error('Error reading CSV file');
      },
    });
  };

  const processData = async () => {
    if (!mapping.email) {
      toast.error('Please select the email column');
      return;
    }

    setProcessing(true);
    setProgress(0);
    const validationResults: EmailValidationResult[] = [];
    const totalEmails = csvData.length;

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      const email = row[mapping.email];
      const name = mapping.name ? row[mapping.name] : undefined;

      if (email) {
        const result = await validateEmail(email);
        validationResults.push({
          ...result,
          name,
        });
      }
      setProgress(((i + 1) / totalEmails) * 100);
    }

    setResults(validationResults);
    setProcessing(false);
    setShowMapping(false);
    toast.success('Email validation complete!');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const downloadResults = () => {
    const csv = Papa.unparse(results.map(r => ({
      Email: r.email,
      Name: r.name || '',
      Valid: r.isValid ? 'Yes' : 'No',
      Reason: r.reason || ''
    })));
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'validated_emails.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Email List Cleaner</h1>

          {!showMapping && (
            <div
              {...getRootProps()}
              className={clsx(
                'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors',
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
              )}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                {isDragActive
                  ? 'Drop the CSV file here'
                  : 'Drag and drop a CSV file here, or click to select'}
              </p>
            </div>
          )}

          {showMapping && (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Column Mapping</h2>
                <button
                  onClick={() => setShowMapping(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Column *
                  </label>
                  <select
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={mapping.email}
                    onChange={(e) => setMapping({ ...mapping, email: e.target.value })}
                  >
                    <option value="">Select column</option>
                    {headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name Column (Optional)
                  </label>
                  <select
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={mapping.name}
                    onChange={(e) => setMapping({ ...mapping, name: e.target.value })}
                  >
                    <option value="">Select column</option>
                    {headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={processData}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Validation
                </button>
              </div>
            </div>
          )}

          {processing && (
            <div className="mt-6">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                      Processing
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div
                    style={{ width: `${progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Results</h2>
                <button
                  onClick={downloadResults}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Download Results
                </button>
              </div>

              <div className="bg-white rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        {mapping.name && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.slice(0, 100).map((result, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {result.email}
                          </td>
                          {mapping.name && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.name}
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {result.isValid ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Valid
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                Invalid
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.reason || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}