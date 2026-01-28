// https://github.com/kitschpatrol/yanki-connect 
// https://git.sr.ht/~foosoft/anki-connect/tree/25.11.9.0/item/README.md#supported-actions

import { config } from "./config.ts";

export async function invoke<T>(action: string, params = {}): Promise<T> {
    const response = await fetch(config.ankiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action,
            version: 6,
            params
        })
    });

    const json = await response.json();
    return json;
}