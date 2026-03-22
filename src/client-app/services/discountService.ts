import { supabase } from '../lib/supabase'

export interface Discount {
  id: number;
  clientId: string;
  discountPct: number;
  remarks: string | null;
  createdAt: string;
}

/**
 * Fetches the default discount from public.default_discount (single row, discount_pct).
 * Used when the client has no row in discounts.
 */
export async function fetchDefaultDiscount(): Promise<{ discountPct: number } | null> {
  try {
    const { data, error } = await supabase
      .from("default_discount")
      .select("discount_pct")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching default_discount:", error);
      return null;
    }
    if (!data) return null;
    const pct = Number(data.discount_pct ?? 0);
    return { discountPct: Number.isNaN(pct) ? 0 : Math.min(100, Math.max(0, pct)) };
  } catch (e) {
    console.error("Unexpected error fetching default_discount:", e);
    return null;
  }
}

/**
 * Fetches the effective discount for a client: from public.discounts (by client_id), or
 * from public.default_discount if no client-specific row exists.
 */
export async function fetchDiscountForClient(
  clientId: string
): Promise<Discount | null> {
  try {
    const { data, error } = await supabase
      .from("discounts")
      .select("id, client_id, discount_pct, remarks, created_at")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching discount:", error);
      return null;
    }

    if (data) {
      return {
        id: data.id,
        clientId: data.client_id,
        discountPct: Number(data.discount_pct ?? 0),
        remarks: data.remarks ?? null,
        createdAt: data.created_at,
      };
    }

    const defaultRow = await fetchDefaultDiscount();
    if (defaultRow) {
      return {
        id: 0,
        clientId,
        discountPct: defaultRow.discountPct,
        remarks: null,
        createdAt: "",
      };
    }

    return null;
  } catch (e) {
    console.error("Unexpected error fetching discount:", e);
    return null;
  }
}
