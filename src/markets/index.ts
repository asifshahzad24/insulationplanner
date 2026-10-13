import type { MarketData, MarketId } from "@/engine/types";
import { de } from "./de";
import { fr } from "./fr";
import { uk } from "./uk";
import { us } from "./us";

export const MARKET_DATA: Record<MarketId, MarketData> = { us, uk, de, fr };

export const getMarket = (id: MarketId): MarketData => MARKET_DATA[id];
