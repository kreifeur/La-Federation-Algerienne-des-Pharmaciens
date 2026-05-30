// app/test-emails/page.jsx
'use client';

import { useState } from 'react';

export default function TestEmailsPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // Email form state
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [sendLoading, setSendLoading] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sendSuccess, setSendSuccess] = useState('');

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    setLoginSuccess('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        // Assuming the token is in data.token or data.access_token
        const token = data.data.token || data.access_token;
        if (token) {
          setAuthToken(token);
          setLoginSuccess('Login successful! Token received.');
          setLoginError('');
        } else {
          setLoginError('Token not found in response');
        }
      } else {
        setLoginError(data.message || data.error || 'Login failed');
      }
    } catch (err) {
      setLoginError('Network error: ' + err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Send Email
  const handleSendEmail = async (e) => {
  e.preventDefault();
  setSendLoading(true);
  setSendError('');
  setSendSuccess('');

  if (!authToken) {
    setSendError('Please login first to get an auth token');
    setSendLoading(false);
    return;
  }

  const formData = new FormData();
  formData.append('to', to);
  formData.append('subject', subject);
  formData.append('body', body);
  if (attachment) {
    formData.append('attachment', attachment);
  }

  try {
    console.log("Sending email with attachment:", attachment?.name, attachment?.type, attachment?.size);
    
    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        // Remove Content-Type header - let browser handle it
      },
      body: formData,
    });

    // Better error handling
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error(`Server returned ${response.status}: ${text.substring(0, 200)}`);
    }

    if (response.ok) {
      setSendSuccess('Email sent successfully!');
      setSendError('');
      // Clear form
      setTo('');
      setSubject('');
      setBody('');
      setAttachment(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } else {
      setSendError(data.message || data.error || 'Failed to send email');
    }
  } catch (err) {
    console.error('Error details:', err);
    setSendError('Error: ' + err.message);
  } finally {
    setSendLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Email API Testing Dashboard
        </h1>

        {/* Login Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loginLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {loginError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {loginError}
            </div>
          )}
          {loginSuccess && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {loginSuccess}
            </div>
          )}

          {authToken && (
            <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
              <strong>Token received:</strong>
              <code className="block mt-1 text-xs break-all">{authToken}</code>
            </div>
          )}
        </div>

        {/* Send Email Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Send Email</h2>
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="recipient@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email subject"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Body
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email body content..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachment (optional)
              </label>
              <input
                type="file"
                onChange={(e) => setAttachment(e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={sendLoading || !authToken}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              {sendLoading ? 'Sending...' : 'Send Email'}
            </button>
          </form>

          {sendError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {sendError}
            </div>
          )}
          {sendSuccess && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {sendSuccess}
            </div>
          )}

          {!authToken && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              ⚠️ Please login first to obtain an authorization token.
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gray-800 text-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-2">📌 API Endpoints Tested:</h3>
          <ul className="text-sm space-y-1">
            <li><code className="bg-gray-700 px-1 rounded">POST /api/auth/login</code> - Admin login</li>
            <li><code className="bg-gray-700 px-1 rounded">POST /api/email</code> - Send email with optional attachment</li>
          </ul>
          <p className="text-xs text-gray-400 mt-2">
            Note: Make sure your Next.js backend is running on localhost:3000
          </p>
        </div>
      </div>
    </div>
  );
}