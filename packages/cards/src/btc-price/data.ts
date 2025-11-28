import type { PriceData } from "./types";

export async function getBtcPriceData(): Promise<PriceData> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"
    );

    if (!res.ok) {
      throw new Error(`API Error: ${res.statusText}`);
    }

    const json = await res.json();

    if (!json.bitcoin) {
      throw new Error("Invalid response format");
    }

    return {
      symbol: "BTC",
      price: json.bitcoin.usd,
      change24h: json.bitcoin.usd_24h_change,
    };
  } catch (error) {
    console.error("Failed to fetch BTC price", error);
    throw error;
  }
}

