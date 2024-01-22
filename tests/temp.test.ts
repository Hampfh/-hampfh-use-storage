// @vitest-environment jsdom

import { Storage } from "@/provider"
import { writeStorageFile } from "@/useStorage"
import { beforeAll, describe, expect, it } from "vitest"
import { z } from "zod"

const schema = {
	main: z.object({
		first: z.string(),
		second: z.number(),
		third: z.boolean()
	})
}

interface Register {
	schema: typeof schema
}

describe("Basic tests", () => {
	beforeAll(() => {
		Storage({
			schema
		})
	})

	it("should pass", async () => {
		expect(
			await writeStorageFile("main", {
				first: "hello",
				second: 2,
				third: true
			})
		).toBe(true)
	})
})
