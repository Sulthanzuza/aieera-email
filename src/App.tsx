import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Mail } from 'lucide-react';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <Mail className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-semibold text-gray-900">Email Automation Dashboard</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard />
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-gray-500 text-center">
           Aieera Email Automation &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
      
      <Toaster position="top-right" />
    </div>
  );
}

export default App;