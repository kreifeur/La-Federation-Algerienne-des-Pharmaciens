import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  try {
    // Get mdOrder from query parameters
    const { searchParams } = new URL(request.url);
    const mdOrder = searchParams.get("mdOrder");

    // Validate required parameters
    if (!mdOrder) {
      return NextResponse.json(
        { error: "mdOrder is required" },
        { status: 400 }
      );
    }

    // Validate mdOrder format
    if (typeof mdOrder !== "string" || mdOrder.trim() === "") {
      return NextResponse.json(
        { error: "mdOrder must be a non-empty string" },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      userName: "SAT2601031358",
      password: "satim120",
      mdOrder: mdOrder.trim(),
      language: "FR",
    }).toString();

    const url = `https://test2.satim.dz/payment/rest/public/acknowledgeTransaction.do?${params}`;

    const response = await axios.get(url);

    return NextResponse.json(response.data);
  } catch (err) {
    return NextResponse.json(
      { error: err.response?.data || err.message },
      { status: 500 }
    );
  }
}