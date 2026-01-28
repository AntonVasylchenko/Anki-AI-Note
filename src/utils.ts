import fs from 'node:fs/promises';

export function stripHtml(html: string): string {
    return html
        .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

export function capitalize(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}


export async function readFile(filePath: string): Promise<string> {
    try {
        return await fs.readFile(filePath, { encoding: 'utf8' });
    } catch (error) {
        console.error('Error reading file:', error.message);
        return ""
    }
}

export async function removeContentFromFile(filePath: string, contentToRemove: string) {
    try {
        const data = await fs.readFile(filePath, { encoding: 'utf8' });
        const regex = new RegExp(contentToRemove, "g");

        const updataContent = data.replace(regex, "");
        await fs.writeFile(filePath, updataContent, 'utf8');
        console.log(`${contentToRemove} was removed correctly`)
    } catch (error) {
        console.log(`${contentToRemove} was not removed correctly`)
    }
}