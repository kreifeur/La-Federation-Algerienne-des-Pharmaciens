// app/payment/success/page.js
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    // Extract payment data from URL parameters
    const data = {
      orderId: searchParams.get('orderId'),
      amount: searchParams.get('amount'),
      currency: searchParams.get('currency'),
      status: searchParams.get('status'),
      timestamp: new Date().toLocaleString()
    };
    
    setPaymentData(data);
    
    // Log to console for debugging
    console.log('Payment Success Data:', data);
    
    // You can also send this data to your backend
    // fetch('/api/payment/verify', {
    //   method: 'POST',
    //   body: JSON.stringify(data)
    // });
    
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Thank you for your payment.</p>
        </div>
        
        {paymentData && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md text-left">
            <h3 className="font-bold mb-2">Payment Details:</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Order ID:</strong> {paymentData.orderId}</p>
              <p><strong>Amount:</strong> {paymentData.amount} {paymentData.currency}</p>
              <p><strong>Status:</strong> <span className="text-green-600 font-bold">{paymentData.status}</span></p>
              <p><strong>Time:</strong> {paymentData.timestamp}</p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => window.location.href = '/'}
          className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}