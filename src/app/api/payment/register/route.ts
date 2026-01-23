// app/api/payment/register/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { amount, planName, userId, orderNumber } = await request.json();

    const params = new URLSearchParams({
      userName: process.env.SATIM_USERNAME || "SAT2601031358",
      password: process.env.SATIM_PASSWORD || "satim120",
      orderNumber: orderNumber || "FAP-" + Date.now(),
      amount: (amount * 100).toString(), // Convert to centimes
      currency: "012",
      language: "FR",
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      failUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed`,
      jsonParams: JSON.stringify({
        force_terminal_id: "E010902702",
        udf1: userId || "guest",
        udf2: planName || "membership",
        udf5: `membership_${Date.now()}`
      })
    }).toString();

    const url = `https://test2.satim.dz/payment/rest/register.do?${params}`;
    const response = await axios.get(url);

    if (response.data.errorCode) {
      return NextResponse.json(
        { error: response.data.errorMessage || "Payment initialization failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Payment error:", err);
    return NextResponse.json(
      { error: err.response?.data || err.message },
      { status: 500 }
    );
  }
}