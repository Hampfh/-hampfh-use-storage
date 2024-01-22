// @vitest-environment jsdom

import { LocalStorageAdapter } from "@/adapters"
import { describe, expect, it, vi } from "vitest"

describe("Local storage adapter", () => {
	const data = {
		hello: "world",
		number: 123,
		array: [1, 2, 3],
		object: { a: "b" },
		boolean: true
	}

	it("Does I/O default", async () => {
		const adapter = new LocalStorageAdapter()
		const setSpy = vi.spyOn(Storage.prototype, "setItem")

		await adapter.writeFile("file", data)
		expect(setSpy).toHaveBeenCalledWith("file", JSON.stringify(data))

		const getMock = vi.fn(() => JSON.stringify(data))
		vi.spyOn(Storage.prototype, "getItem").mockImplementation(getMock)

		const adapterRead = await adapter.readFile("file")
		expect(adapterRead).toEqual(data)
	})

	it("Does I/O with prefix", async () => {
		const adapter = new LocalStorageAdapter({
			prefix: "prefix/"
		})
		const setSpy = vi.spyOn(Storage.prototype, "setItem")

		await adapter.writeFile("file", data)
		expect(setSpy).toHaveBeenCalledWith("prefix/file", JSON.stringify(data))

		const getMock = vi.fn((file: string) => {
			expect(file).toEqual("prefix/file")
			return JSON.stringify(data)
		})
		vi.spyOn(Storage.prototype, "getItem").mockImplementation(getMock)

		const adapterRead = await adapter.readFile("file")
		expect(adapterRead).toEqual(data)
	})

	it("Does I/O with base64", async () => {
		const adapter = new LocalStorageAdapter({
			base64: true
		})
		const setSpy = vi.spyOn(Storage.prototype, "setItem")

		await adapter.writeFile("file", data)
		expect(setSpy).toHaveBeenCalledWith(
			btoa("file"),
			btoa(JSON.stringify(data))
		)

		const getMock = vi.fn((file: string) => {
			expect(file).toEqual(btoa("file"))
			return btoa(JSON.stringify(data))
		})
		vi.spyOn(Storage.prototype, "getItem").mockImplementation(getMock)

		const adapterRead = await adapter.readFile("file")
		expect(adapterRead).toEqual(data)
	})
})
