import { decode } from "html-entities";

export default function pickRandomAnchors(anchors: string[], count: number) {
    const arr = unique(anchors);
    const result: string[] = [];

    for (let i = 0; i < count; i++) {
        const anchor = arr[Math.floor(Math.random() * arr.length)];

        result.push(decode(anchor) as string);

        arr.splice(arr.indexOf(anchor as string), 1);
    }

    return result;
}

function unique(arr: string[]) {
    const seen: Record<string, boolean> = {};

    return arr.filter((elem) => {
        if (seen.hasOwnProperty(elem)) {
            return false;
        } else {
            seen[elem] = true;
            return true;
        }
    });
}
