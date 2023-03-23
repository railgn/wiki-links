//@ts-ignore
import { encode } from "url-encode-decode";

export default function encodeURL(title: string): string {
    const article = encode(title.replaceAll(" ", "_")) as string;

    const url = "https://en.wikipedia.org/wiki/" + article;

    return url;
}
