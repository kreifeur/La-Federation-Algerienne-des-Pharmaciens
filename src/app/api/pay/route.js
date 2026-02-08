import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  try {
    // Get the URL object to access query parameters
    const { searchParams } = new URL(request.url);
    
    // Get dynamic amount from query string
    const amount = searchParams.get('amount');
    
    // Validate required parameters
    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }
    
    // Validate amount is a positive number
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      userName: "SAT2601031358",
      password: "satim120",
      orderNumber: "YAF-" + Date.now(), // MUST be unique
      amount: amount.toString(), // Use dynamic amount from frontend
      currency: "012",
      language: "FR", // Always French language
      returnUrl: "https://fapharmacie.dz/payment/success",
      failUrl: "https://fapharmacie.dz/payment/failed",
      jsonParams: JSON.stringify({
        force_terminal_id: "E010902702",
        udf1: "2018105301346",
        udf5: "ggsf85s42524s5uhgsf"
      })
    }).toString();

    const url = `https://test2.satim.dz/payment/rest/register.do?${params}`;

    const response = await axios.get(url);

    return NextResponse.json(response.data);
  } catch (err) {
    return NextResponse.json(
      { error: err.response?.data || err.message },
      { status: 500 }
    );
  }
}