import { config } from "./config.ts";
import { Ollama } from 'ollama'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { changePrompt, repairChangePrompt, addPrompt, repairAddPrompt } from "./prompts.ts";

const changeAiSchema = z.object({
    transcription: z.string(),
    tags: z.array(z.string()),
    example: z.string()
})

const addAiSchema = z.object({
    word: z.string(),
    desk: z.string(),
    translate: z.string()
})

const ollama = new Ollama({
    host: 'https://ollama.com',
    headers: { Authorization: 'Bearer ' + config.ollamaKey },
})

interface CallAIOptions<T extends z.ZodType> {
    word: string,
    prompt: string,
    repairPromt: string,
    schema: T,
    additinalProperties?: Record<string, string>
}

const callAI = async<T extends z.ZodType>(options: CallAIOptions<T>): Promise<z.infer<T>> => {
    const { word, prompt, repairPromt, schema, additinalProperties } = options;

    const buildPrompt = (template: string, errorInfo?: string): string => {
        let result = template.replace("{{WORD}}", word);

        if (additinalProperties) {
            Object.entries(additinalProperties).forEach(([key, value]) => {
                result = result.replace(`{{${key}}}`, value);
            });
        }

        if (errorInfo) {
            result = result.replace("{{ERROR_INFO}}", errorInfo)
        }

        return result
    }

    const makeRequest = async (promtContent: string): Promise<z.infer<T>> => {
        const response = await ollama.chat({
            model: 'gpt-oss:120b',
            messages: [{ role: 'user', content: promtContent }],
            stream: false,
            think: true,
            format: zodToJsonSchema(schema)
        })
        return schema.parse(JSON.parse(response.message.content))
    }
    try {
        return makeRequest(buildPrompt(prompt))
    } catch (error) {
        if (error instanceof SyntaxError) {
            return await makeRequest(buildPrompt(repairPromt, error.message));
        }
        throw error;
    }
}

export const callAIChange = async (word: string): Promise<z.infer<typeof changeAiSchema>> => {
    return callAI({
        word,
        prompt: changePrompt,
        repairPromt: repairChangePrompt,
        schema: changeAiSchema
    });
};

export const callAIAdd = async (word: string, deskNames: string[]): Promise<z.infer<typeof addAiSchema>> => {
    return callAI({
        word,
        prompt: addPrompt,
        repairPromt: repairAddPrompt,
        schema: addAiSchema,
        additinalProperties: {
            TYPES_ARRAY: JSON.stringify(deskNames)
        }
    });
};