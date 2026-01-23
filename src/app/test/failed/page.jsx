// app/payment/failed/page.js
'use client';

import { useEffect, useState } from 'react';


export default function PaymentFailed() {
  const [errorData, setErrorData] = useState(null);

  useEffect(() => {
    const data = {
      orderId: 'orderId',
      errorCode: 'errorCode',
      errorMessage: 'errorMessage',
      timestamp: new Date().toLocaleString()
    };
    
    setErrorData(data);
    console.log('Payment Failed Data:', data);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h1>
          <p className="text-gray-600">Your payment could not be processed.</p>
        </div>
        
        {errorData && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md text-left">
            <h3 className="font-bold mb-2">Error Details:</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Order ID:</strong> {errorData.orderId}</p>
              <p><strong>Error Code:</strong> {errorData.errorCode}</p>
              <p><strong>Error Message:</strong> {errorData.errorMessage}</p>
              <p><strong>Time:</strong> {errorData.timestamp}</p>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/test-payment'}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-3 bg-gray-200 text-gray-800 font-bold rounded-md hover:bg-gray-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}