//@ts-ignore
import JSSoup from "jssoup";

export default function getAnchors(html: string) {
    if (html == "hi") {
        return { title: "not ready", anchors: [] };
    }
    const soup = new JSSoup(JSON.parse(html));

    let res: string[] = [];

    let title = soup.find("title").text;
    title = title.slice(0, title.length - 12);

    const anchors = soup.findAll("a");

    const falsePositives = [
        "Main page",
        "Article",
        "Read",
        "",
        "Terms of Use",
        "Privacy Policy",
        title,
    ];

    for (const a of anchors) {
        if (a.attrs.href) {
            if (
                a.attrs.href.includes("/wiki/") &&
                a.attrs.href.indexOf(":") == -1 &&
                !falsePositives.includes(a.text)
            ) {
                res.push(a.text as string);
            }
        }
    }

    return { title: title, anchors: res };
}
