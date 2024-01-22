// @vitest-environment jsdom

import { TestAdapter } from "$/react/TestAdapter.util"
import { Storage } from "@/provider"
import { clearStorageFile, useStorage } from "@/useStorage"
import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { z } from "zod"

describe("Persistency tests", () => {
	const adapter = new TestAdapter()
	const schema = {
		meta: z
			.object({
				count: z.number()
			})
			.default({
				count: 0
			})
	}
	beforeEach(() => {
		Storage({
			schema,
			adapter
		})
	})

	afterEach(async () => {
		await clearStorageFile("meta")
		adapter.reset()
	})

	it("Successfully persists values", async () => {
		const { result } = renderHook(() => useStorage("meta"))

		await act(() =>
			result.current.merge({
				count: 1
			})
		)

		act(() => result.current.refresh())

		await clearStorageFile("meta")

		Storage({
			schema,
			adapter
		})

		await waitFor(async () => {
			expect(result.current.value.count).toBe(1)
		})
	})
})
