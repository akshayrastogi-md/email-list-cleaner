import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Shield, Zap, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Mail className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold">EmailCleaner</span>
        </div>
        <div className="space-x-4">
          <Link to="/auth" className="text-gray-600 hover:text-gray-900">Sign In</Link>
          <Link
            to="/auth"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Clean Your Email Lists with Confidence
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Validate, clean, and optimize your email lists in seconds. Improve your deliverability
            and campaign performance with our powerful email verification tool.
          </p>
          <Link
            to="/auth"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <span>Start Cleaning Now</span>
            <Zap className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Shield className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Advanced Validation</h3>
            <p className="text-gray-600">
              Multi-layer validation including syntax, domain, and mailbox verification.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <CheckCircle className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Cleaning</h3>
            <p className="text-gray-600">
              Process your lists in real-time with instant results and detailed reports.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Mail className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Bulk Processing</h3>
            <p className="text-gray-600">
              Handle large email lists efficiently with our powerful bulk processing system.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}