export type Data = Record<string, DataItem>;

interface DataItem {
    title: string;
    anchors: string[];
}
