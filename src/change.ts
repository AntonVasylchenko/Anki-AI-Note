import { invoke } from "./anki.ts";

import { callAIChange } from "./ollama.ts";
import type { FindCardsResult, CardsToNotesResult, Note } from "./type.ts";
import { capitalize, stripHtml } from "./utils.ts";

const FRONT_SIDE = "Лицьова сторона"
const BACK_SIDE = "Назад"

async function run() {
    const cardIds = await invoke<FindCardsResult>("findCards", { query: "" });
    const cardToNote = await invoke<CardsToNotesResult>("cardsToNotes", { cards: cardIds.result });
    const noteIds = [...new Set(Object.values(cardToNote.result))];
    const notes = await invoke<CardsToNotesResult>("notesInfo", { notes: noteIds });
    const notesWithoutAITag = notes.result.filter(note => !note.tags.includes("AI"));

    for (const note of notesWithoutAITag) {
        const frontText = note.fields[FRONT_SIDE].value;
        const backText = note.fields[BACK_SIDE].value;

        if (!frontText || !backText) continue;

        const cleanFront = capitalize(stripHtml(frontText));
        const cleanBack = capitalize(stripHtml(backText));

        const aiData = await callAIChange(cleanFront);

        const newFrontSide = `${cleanFront} [${aiData.transcription}]<br>${aiData.example}`;
        const updatedNote = {
            id: note.noteId,
            fields: {
                [FRONT_SIDE]: newFrontSide,
                [BACK_SIDE]: cleanBack,
            },
            tags: [...note.tags, ...aiData.tags],
        };

        ["updateNoteFields", "updateNote"].forEach(async (action) => {
            await invoke(action, { note: updatedNote });
        });

    }
}

run().catch(() => {
    console.error("An error occurred during the operation.");
    run();
});