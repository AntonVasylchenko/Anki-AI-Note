import { invoke } from "./anki.ts";

import { callAI } from "./ollama.ts";
import type { findCardsResult, CardsToNotesResult, Note } from "./type.ts";
import { capitalize, stripHtml } from "./utils.ts";

const FRONT_SIDE = "Лицьова сторона"
const BACK_SIDE = "Назад"

async function run() {
    console.time("Starting operation")
    const cardIds = await invoke<findCardsResult>("findCards", { query: "" });
    const cardToNote = await invoke<CardsToNotesResult>("cardsToNotes", { cards: cardIds.result });
    const noteIds = [...new Set(Object.values(cardToNote.result))];
    const notes = await invoke<CardsToNotesResult>("notesInfo", { notes: noteIds });
    const notesWithoutAITag = notes.result.filter(note => !note.tags.includes("AI"));

    let updated = 0;
    let rest = notesWithoutAITag.length;
    let averageTimePerNote = 4000;
    for (const note of notesWithoutAITag) {
        const frontText = note.fields[FRONT_SIDE].value;
        const backText = note.fields[BACK_SIDE].value;

        if (!frontText || !backText) continue;

        const cleanFront = capitalize(stripHtml(frontText));
        const cleanBack = capitalize(stripHtml(backText));

        const aiData = await callAI(cleanFront);

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

        updated++;
        rest--;
        console.clear();
        const totalMs = rest * averageTimePerNote;
        const totalSeconds = Math.floor(totalMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const timeFormatted = `${hours}H:${String(minutes).padStart(2, '0')}M:${String(seconds).padStart(2, '0')}S`;

        console.log(`${rest} notes left. Estimated time remaining: ${timeFormatted}`);
    }

    console.log(`Updated ${updated} notes.`);
    console.timeEnd("Starting operation")
}

run().catch(console.error);