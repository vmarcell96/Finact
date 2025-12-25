import { useState } from "react";
import { getDailyPerformance } from "../services/alphaVantageService";

type StockListParams = {
  userId: string | null;
};

export default function StockList({ userId }: StockListParams) {
  const [symbol, setSymbol] = useState("");
  const [error, setError] = useState("");
  const [performance, setPerformance] = useState<number | null>(null);

  async function handleAddStock(e) {
    e.preventDefault();
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
      <form onSubmit={handleAddStock}>
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
