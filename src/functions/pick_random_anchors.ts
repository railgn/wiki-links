export default function pickRandomAnchors(anchors: string[], count: number) {
    const arr = unique(anchors);
    const result: string[] = [];

    for (let i = 0; i < count; i++) {
        const anchor = arr[Math.floor(Math.random() * arr.length)];

        result.push(anchor);

        arr.splice(arr.indexOf(anchor), 1);
    }

    return result;
}

function unique(arr: string[]) {
    const seen: { [key: string]: boolean } = {};

    return arr.filter((elem) => {
        if (seen.hasOwnProperty(elem)) {
            return false;
        } else {
            seen[elem] = true;
            return true;
        }
    });
}
