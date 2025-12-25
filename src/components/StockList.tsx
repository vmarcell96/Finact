import { useState } from "react";
import { getDailyPerformance } from "../services/alphaVantageService";
import "../App.css";
import { createClient } from "@supabase/supabase-js";

type StockListParams = {
  userId: string | null;
};

export default function StockList({ userId }: StockListParams) {
  const [symbol, setSymbol] = useState("");
  const [error, setError] = useState("");
  const [performance, setPerformance] = useState<number | null>(null);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supaAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supaAnonKey);

  async function handleAddStock(e) {
    e.preventDefault();
    await supabase.from("watchlist").insert({ symbol, user_id: userId });

    setError("");
    setPerformance(null);

    try {
      const perf = await getDailyPerformance(symbol.toUpperCase());
      if (!perf) {
        setError("No stock data loaded");
        return null;
      }

      setPerformance(perf);
    } catch (error) {
      setError(`An error occurred: ${error}`);
    }
  }
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
