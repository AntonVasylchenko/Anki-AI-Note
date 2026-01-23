import type { ConfigApp } from "./type.js";
import dotenv from 'dotenv';
dotenv.config();

export const config: ConfigApp = {
    ankiUrl: process.env.ANKI_CONNECT_URL || "",
    ollamaKey: process.env.OLLAMA_API || "",
}