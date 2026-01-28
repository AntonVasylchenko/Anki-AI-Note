import type { AddCardResult, DeskNames } from "./type.ts"
import path from 'node:path';
import { readFile, removeContentFromFile } from './utils.ts';
import { invoke } from './anki.ts';
import { callAIAdd } from "./ollama.ts";

const FILI_NAME = "words.txt"
const FRONT_SIDE = "Лицьова сторона"
const BACK_SIDE = "Назад"
const filePath = path.resolve(FILI_NAME);

const data = await readFile(filePath);
const newWords = data.split("\n");

const deskNames = await invoke<DeskNames>("deckNames");

for (const newWord of newWords) {
    const response = await callAIAdd(newWord, deskNames.result);
    if (response.desk && response.translate && response.word) {
        const assignedDesk = deskNames.result.includes(response.desk) ? response.desk : "Unknow";
        const payload = {
            "deckName": assignedDesk,
            "modelName": "Базова",
            "fields": {
                [FRONT_SIDE]: response.word,
                [BACK_SIDE]: response.translate
            },
            "tags": []
        }
        const addResponse = await invoke<AddCardResult>("addNote", { "note": payload });
        if (addResponse.result) {
            await removeContentFromFile(filePath, newWord)
        }
    } else {
        console.log(`Word ${newWord} was not added`)
    }
}
