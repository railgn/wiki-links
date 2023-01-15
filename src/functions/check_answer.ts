//@ts-ignore
import levenshtein from "js-levenshtein";

export default function check_answer(
    input: string,
    anchors: string[]
): boolean {
    const cleanInput = input.toLowerCase();
    for (const anchor of anchors) {
        const cleanAnchor = anchor.toLowerCase();
        if (levenshtein(cleanInput, cleanAnchor) < 2 && anchor.length > 4) {
            console.log("CORRECT");
            return true;
        } else if (levenshtein(cleanInput, cleanAnchor) < 1) {
            console.log("CORRECT");
            return true;
        }
    }

    console.log("INCORRECT");
    return false;
}
