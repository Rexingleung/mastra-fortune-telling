import { MastraClient } from "@mastra/client-js";
 
export const mastraClient = new MastraClient({
  baseUrl: import.meta.env.VITE_MASTRA_API_URL,
  // baseUrl: "http://localhost:4111",
  // baseUrl: import.meta.env.VITE_MASTRA_API_URL || "http://localhost:4111",
});