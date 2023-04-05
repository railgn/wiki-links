// @ts-expect-error
import JSSoup from "jssoup";

export default function getAnchors(html: string) {
    if (html === "hi") {
        return { title: "not ready", anchors: [] };
    }
    const soup = new JSSoup(JSON.parse(html));

    const res: string[] = [];

    let title = soup.find("title").text;
    title = title.slice(0, title.length - 12);

    const anchors = soup.findAll("a");

    const falsePositives = [
        "main page",
        "article",
        "read",
        "",
        "terms of use",
        "privacy policy",
        "",
        "song",
        "single",
        "game",
        "isbn",
        "issn",
        "title",
        "video game",
        "terms of use",

        title,
    ];

    for (const a of anchors) {
        if (a.attrs.href != null) {
            if (
                a.attrs.href.includes("/wiki/") &&
                a.attrs.href.indexOf(":") === -1 &&
                !falsePositives.includes(a.text) &&
                !a.text.includes("(s)")
            ) {
                res.push(a.text as string);
            }
        }
    }

    return { title: title as string, anchors: res };
}
