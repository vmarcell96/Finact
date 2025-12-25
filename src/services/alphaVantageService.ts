const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
const BASE_URL = "https://www.alphavantage.co/query?";

//function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo

async function fetchJson(queryParams) {
  const url = `${BASE_URL}${new URLSearchParams({
    ...queryParams,
    apikey: API_KEY,
  })}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Alpha Vantage API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getDailyPerformance(ticker) {
  const json = await fetchJson({
    function: "TIME_SERIES_DAILY",
    symbol: ticker,
  });

  return json;
}
