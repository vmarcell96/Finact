export async function AddStock(supabase, userId, symbol) {
  return supabase.from("watchlist").insert({ symbol, user_id: userId });
}

export async function RemoveStock(supabase, id) {
  return supabase.from("watchlist").delete().eq("id", id);
}

type DbStock = {
  id: string;
  user_id: string;
  symbol: string;
};

export async function FetchWatchlist(
  supabase,
  userId
): Promise<DbStock[] | []> {
  const { data } = supabase.from("watchlist").select("*").eq("user_id", userId);
  return data || [];
}
