export type ConfigApp = {
    ankiUrl: string,
    ollamaKey: string
}

export type findCardsResult = {
    "result": number[],
    "error": null
}

export type Note = {
    noteId: number,
    profile: string,
    modelName: string,
    tags: string[],
    fields: Record<string, { value: string, order: number }>,
    mod: number,
    cards: number[]
}

export type CardsToNotesResult = {
    "result": Note[],
    "error": null
}