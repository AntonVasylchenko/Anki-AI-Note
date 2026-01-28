export const changePrompt = `
You will be given a single English word.
"{{WORD}}" is this word.
Produce ONLY a single valid JSON object (no extra text, no markdown, no explanations) with exactly these three fields:

{
  "transcription": string,
  "tags": array[string],
  "example": string
}

REQUIREMENTS FOR EACH FIELD:
1) transcription:
   - Provide the phonetic transcription of the English word using UKRANIAN CYRILLIC to represent pronunciation (use common Ukrainian orthography to show how the word sounds to a Ukrainian speaker).
   - Do NOT use IPA, do NOT include slashes // or brackets [], and do NOT include stress marks.
   - If multiple pronunciations exist, choose the most common one.

2) tags:
   - MUST be an array of strings.
   - The FIRST element MUST be exactly "AI".
   - The SECOND element MUST be exactly one CEFR level tag chosen from: A0, A1, A2, B1, B2, C1, C2 (no prefixes/suffixes).
   - After these two required tags you may include 0–4 additional short relevant tags (part of speech like "noun" or "verb", topic like "technology" or "food", register like "formal", synonyms, etc.).
   - Use lowercase for additional tags (except the required "AI" and the CEFR tag which must match case exactly).

3) example:
   - A single example sentence (one string) in ENGLISH that uses the word in context. It may be a question, statement, or negation.
   - Do NOT add translations, explanations, or multiple sentences — exactly one sentence.

ADDITIONAL RULES:
- Output must be valid JSON parseable by JSON.parse with double quotes and no trailing commas.
- Do NOT output any extra fields, metadata, or commentary.
- Choose the most appropriate CEFR level when assigning the level tag.
- Replace {{WORD}} below with the input word when calling the model.

`;


export const repairChangePrompt = `
The previous response caused a JSON parsing error and is INVALID.

Error information: "{{ERROR_INFO}}"

Your task is to FIX the output and return a CORRECT response.

You will be given a single English word (replace {{WORD}} with that word).
Produce ONLY a single valid JSON object (no extra text, no markdown, no explanations) with exactly these three fields:

{
  "transcription": string,
  "tags": array[string],
  "excaples": string
}

REQUIREMENTS FOR EACH FIELD:
1) transcription:
   - Provide the phonetic transcription of the English word using UKRAINIAN CYRILLIC to represent pronunciation.
   - Do NOT use IPA symbols.
   - Do NOT use slashes, brackets, or stress marks.
   - Choose the most common pronunciation only.

2) tags:
   - MUST be an array of strings.
   - FIRST element MUST be exactly "AI".
   - SECOND element MUST be exactly one CEFR level: A0, A1, A2, B1, B2, C1, or C2.
   - NO prefixes or suffixes allowed for the CEFR tag.
   - Additional tags (0–4) are optional and must be lowercase.
   - Do NOT repeat tags.

3) excaples:
   - EXACTLY ONE English sentence using the word.
   - May be a statement, question, or negation.
   - No translations, no explanations, no multiple sentences.

CRITICAL RULES:
- Output MUST be valid JSON parsable by JSON.parse.
- Use double quotes ONLY.
- No trailing commas.
- No comments.
- No additional text before or after the JSON.
- Do NOT apologize.
- Do NOT explain anything.

Input word: "{{WORD}}"
`;


export const addPrompt = `
You will be given a single English word and an array of allowed types.
Your task is to determine **exactly one type** from the provided array that the word belongs to.
If it is impossible to determine the type, use "Unknow".
Do NOT invent any new types; use only the types provided.

Additional rules:
1) If the word is a noun, prepend the correct article ("a", "an", or "the") before the word.
2) If the word is a verb, prepend "to" before the word.
3) If the word is an irregular verb, do NOT use "to", but provide all three forms separated by slashes: form1/form2/form3.
4) Translate the word into Ukrainian.

Input placeholders:
- Word: "{{WORD}}"
- Allowed types array: {{TYPES_ARRAY}}

Output requirements:
- Must be valid JSON parseable by JSON.parse
- Use exactly these fields:

{
  "word": string,       // The word with article or "to" or irregular forms as described
  "desk": string,       // The type/category from the allowed types or "Unknow"
  "translate": string   // Ukrainian translation of the word
}

Do NOT output any extra text, explanation, or markdown. Only output the JSON.
`;


export const repairAddPrompt = `
The previous response caused a JSON parsing error and is INVALID.

Error information: "{{ERROR_INFO}}"

Your task is to FIX the output and return a CORRECT response.

You will be given a single English word and an array of allowed types.
Do NOT invent any new types; use only the types provided.

Additional rules (same as original prompt):
1) If the word is a noun, prepend the correct article ("a", "an", or "the") before the word.
2) If the word is a verb, prepend "to" before the word.
3) If the word is an irregular verb, do NOT use "to", but provide all three forms separated by slashes: form1/form2/form3.
4) Translate the word into Ukrainian.

Input placeholders:
- Word: "{{WORD}}"
- Allowed types array: {{TYPES_ARRAY}}

Output requirements:
- Must be valid JSON parseable by JSON.parse
- Use exactly these fields:

{
  "word": string,       // The word with article or "to" or irregular forms as described
  "desk": string,       // The type/category from the allowed types or "Unknow"
  "translate": string   // Ukrainian translation of the word
}

Do NOT output any extra text, explanation, or markdown. Only output the JSON.
`;
