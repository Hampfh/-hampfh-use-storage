import { Storage, readStorageFile, writeStorageFile } from "@hampfh/use-storage"
import { z } from "zod"

const schema = {
	file: z.object({
		version: z.string(),
		clickCount: z.number()
	}),
	file2: z.object({
		hello: z.string(),
		world: z.number()
	})
}

Storage({ schema })

declare module "@hampfh/use-storage" {
	interface Register {
		schema: typeof schema
	}
}
