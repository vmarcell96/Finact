import { useEffect, useState } from "react";
import "../App.css";
import { createClient } from "@supabase/supabase-js";
import {
  AddStock,
  FetchWatchlist,
  RemoveStock,
} from "../services/supabaseWatchlistService";
import { getDailyPerformance } from "../services/alphaVantageService";

type StockListParams = {
  userId: string | null;
};

type Stock = {
  id: string;
  user_id: string;
  symbol: string;
  perf: number | null;
};

export default function StockList({ userId }: StockListParams) {
  const [symbol, setSymbol] = useState("");
  const [error, setError] = useState("");
  const [stocks, setStocks] = useState<Stock[]>([]);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supaAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supaAnonKey);

  async function handleFetchStocks() {
    const data = await FetchWatchlist(supabase, userId);
    setStocks(data);
  }

  async function handleAddStock(e) {
    e.preventDefault();

    setError("");

    const ticker = symbol.toUpperCase();
    await AddStock(supabase, userId, ticker);

    setSymbol("");
    handleFetchStocks();
  }

  async function handleRemoveStock(id) {
    await RemoveStock(supabase, id);
    handleFetchStocks();
  }

  async function loadPerformances() {
    if (!stocks) {
      return;
    }

    const updated = await Promise.all(
      stocks.map(async (stock: Stock) => ({
        ...stock,
        perf: await getDailyPerformance(stock.symbol),
      }))
    );

    setStocks(updated);
  }

  useEffect(() => {
    if (userId) handleFetchStocks();
  }, [userId]);

  useEffect(() => {
    if (stocks.length) loadPerformances();
  }, [stocks.length]);

  return (
    <div>
      <form className="stock-form stock-list" onSubmit={handleAddStock}>
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="AAPL"
        />
        <button>Check</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {performance && (
          <p style={{ color: performance > 0 ? "green" : "red" }}>
            {performance}%
          </p>
        )}
      </form>
    </div>
  );
}
