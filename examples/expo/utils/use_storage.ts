import { AsyncStorageAdapter, Storage } from "@hampfh/use-storage"
import { z } from "zod"

const schema = {
	file: z
		.object({
			name: z.string(),
			type: z.enum(["Admin", "User"]),
			size: z.number(),
			meta: z.string()
		})
		.default({ name: "", type: "User", size: 0, meta: "" }),
	auth: z
		.object({
			userId: z.string(),
			name: z.string(),
			token: z.string()
		})
		.optional()
}

Storage({
	schema,
	adapter: new AsyncStorageAdapter()
})

declare module "@hampfh/use-storage" {
	interface Register {
		schema: typeof schema
	}
}
