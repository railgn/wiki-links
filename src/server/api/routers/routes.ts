import { z } from "zod";
import axios from "axios";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
    getLink: publicProcedure
        .input(z.object({ fetch: z.boolean(), category: z.string() }))
        .query(async ({ input }) => {
            const fileName: string = `${input.category}.json`;

            const category = await import(`../../../data/${fileName}`);

            await new Promise((r) => setTimeout(r, 50));

            const links: string[] = category.links;

            const link = links[Math.floor(links.length * Math.random())];

            console.log(link);
            const result = await axios.get(link, {
                headers: {
                    Accept: "application/json",
                },
            });

            return JSON.stringify(result.data);
        }),
});
