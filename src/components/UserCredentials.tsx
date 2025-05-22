import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface UserCredentialsProps {
  onChange: (credentials: { email: string; password: string }) => void;
}

const UserCredentials: React.FC<UserCredentialsProps> = ({ onChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    onChange({ email: e.target.value, password });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    onChange({ email, password: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start">
        <div className="flex-grow">
          <p className="text-sm text-gray-600 mb-2">
            Enter your email and app password. Your credentials are not stored and will only be used for sending emails.
          </p>
        </div>
        <div className="relative ml-2">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onMouseEnter={() => setShowInfoTooltip(true)}
            onMouseLeave={() => setShowInfoTooltip(false)}
          >
            <Info size={20} />
          </button>
          {showInfoTooltip && (
            <div className="absolute right-0 z-10 w-72 bg-white border border-gray-200 rounded-md shadow-lg p-3 text-sm text-gray-700">
              <p className="font-medium mb-1">App Password?</p>
              <p>For Gmail, you need to create an app password:</p>
              <ol className="list-decimal ml-5 mt-1 space-y-1">
                <li>Go to your Google Account</li>
                <li>Select Security</li>
                <li>Under "Signing in to Google," select App passwords</li>
                <li>Generate a new app password for "Mail"</li>
              </ol>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="app-password" className="block text-sm font-medium text-gray-700">
            App Password
          </label>
          <input
            type="password"
            id="app-password"
            value={password}
            onChange={handlePasswordChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Your app password"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default UserCredentials;