import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  try {
    // If you want mdOrder dynamic, you can also read it from query params
    // const { searchParams } = new URL(request.url);
    // const mdOrder = searchParams.get("mdOrder");

    const params = new URLSearchParams({
      userName: "SAT2601031358",
      password: "satim120",
      mdOrder: "8Z6VB6CQPffVAMAABK3Y",
      language: "FR",
    }).toString();

    const url = `https://test2.satim.dz/payment/rest/public/acknowledgeTransaction.do?${params}`;

    const response = await axios.get(url);

    return NextResponse.json(response.data);
  } catch (err) {
    return NextResponse.json(
      { error: err.response?.data || err.message },
      { status: 500 },
    );
  }
}
