import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const params = new URLSearchParams({
      userName: "SAT2601031358",
      password: "satim120",
      orderNumber: "YAF-" + Date.now(), // MUST be unique
      amount: "1000",
      currency: "012",
      language: "FR",
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
