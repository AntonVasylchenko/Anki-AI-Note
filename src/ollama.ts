import { config } from "./config.ts";
import { Ollama } from 'ollama'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { prompt, repairPrompt } from "./prompts.ts";

const aiResponseSchema = z.object({
    transcription: z.string(),
    tags: z.array(z.string()),
    example: z.string()
})

const ollama = new Ollama({
    host: 'https://ollama.com',
    headers: { Authorization: 'Bearer ' + config.ollamaKey },
})

export const callAI = async (word: string): Promise<z.infer<typeof aiResponseSchema>> => {
    try {
        const response = await ollama.chat({
            model: 'gpt-oss:120b',
            messages: [{ role: 'user', content: prompt.replace('{{WORD}}', word) }],
            stream: false,
            think: true,
            format: zodToJsonSchema(aiResponseSchema)
        })

        return aiResponseSchema.parse(JSON.parse(response.message.content))
    } catch (error) {
        if (error instanceof SyntaxError) {
            const repairResponse = await ollama.chat({
                model: 'gpt-oss:120b',
                messages: [{ role: 'user', content: repairPrompt.replace('{{WORD}}', word).replace('{{ERROR_INFO}}', error.message) }],
                stream: false,
                think: true,
                format: zodToJsonSchema(aiResponseSchema)
            })

            return aiResponseSchema.parse(JSON.parse(repairResponse.message.content))
        }
    }
}
