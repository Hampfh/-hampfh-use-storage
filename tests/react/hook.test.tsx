// @vitest-environment jsdom

import { TestAdapter } from "$/react/TestAdapter.util"
import { TestModifier } from "$/react/TestModifier.util"
import { Storage } from "@/provider"
import { clearStorageFile, useStorage } from "@/useStorage"
import {
	act,
	cleanup,
	render,
	renderHook,
	screen,
	waitFor
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { z } from "zod"

describe.sequential("Happy path tests", () => {
	beforeEach(() => {
		const schema = {
			meta: z
				.object({
					count: z.number(),
					version: z.string(),
					switch: z.boolean()
				})
				.default({
					count: 0,
					version: "1.0.0",
					switch: false
				})
		}

		Storage({
			schema,
			adapter: new TestAdapter()
		})
	})

	afterEach(async () => {
		await clearStorageFile("meta")
		cleanup()
	})

	it("Initializes with correct values", () => {
		render(<TestModifier />, {})

		const count = screen.getByRole("text", {
			name: "count"
		})
		const version = screen.getByRole("text", {
			name: "version"
		})
		const switchValue = screen.getByRole("text", {
			name: "switch"
		})

		expect(count).toBeDefined()
		expect(version).toBeDefined()
		expect(switchValue).toBeDefined()

		expect(count.textContent).toBe("0")
		expect(version.textContent).toBe("1.0.0")
		expect(switchValue.textContent).toBe("false")
	})

	it("Successfully merges, sets and clears data value", async () => {
		const { result } = renderHook(() => useStorage("meta"))

		expect(result.current.value.count).toBe(0)

		await act(() =>
			result.current.merge({
				count: result.current.value.count + 1
			})
		)

		for (let i = 0; i < 10; i++) {
			await act(() =>
				result.current.merge({
					count: result.current.value.count + 1
				})
			)
		}

		expect(result.current.value.count).toBe(11)

		await act(() => result.current.clear())
		expect(result.current.value.count).toBe(0)

		await act(() =>
			result.current.write({
				count: 1000,
				version: "2.0.0",
				switch: true
			})
		)

		expect(result.current.value.count).toBe(1000)
		expect(result.current.value.version).toBe("2.0.0")
		expect(result.current.value.switch).toBe(true)
	})

	it("Value propagates between components", async () => {
		render(
			<div>
				{Array(2)
					.fill(0)
					.map((_, i) => (
						<div role="directory" key={i} aria-label={i.toString()}>
							<TestModifier />
						</div>
					))}
			</div>
		)

		const count = screen.getAllByRole("text", {
			name: "count"
		})
		expect(count[0].textContent).toBe("0")
		const buttonIncrement = screen.getAllByRole("button", {
			name: "Increment"
		})

		buttonIncrement[0].click()

		await waitFor(() => {
			expect(count[0].textContent).toBe("1")
			expect(count[1].textContent).toBe("1")
		})
	})

	it("Handles load of multiple components", async () => {
		const componentCount = 10

		render(
			<div>
				{Array(componentCount)
					.fill(0)
					.map((_, i) => (
						<div role="directory" key={i} aria-label={i.toString()}>
							<TestModifier />
						</div>
					))}
			</div>
		)

		const count = screen.getAllByRole("text", {
			name: "count"
		})
		const buttonIncrement = screen.getAllByRole("button", {
			name: "Increment"
		})

		for (let i = 0; i < componentCount; i++) {
			expect(count[i].textContent).toBe("0")
		}

		buttonIncrement[0].click()

		await waitFor(() => {
			for (let i = 0; i < componentCount; i++) {
				expect(count[i].textContent).toBe("1")
			}
		})
	})

	it("Successfully handles function merge update", async () => {
		const { result } = renderHook(() => useStorage("meta"))

		expect(result.current.value.count).toBe(0)

		// Write 1000 times without waiting for the state to update
		for (let i = 0; i < 1000; i++) {
			await act(() =>
				result.current.merge(({ count }) => ({
					count: count + 1
				}))
			)
		}

		await waitFor(() => expect(result.current.value.count).toBe(1000))

		// Check that the state provided to the write function is the same as the current state
		await act(() =>
			result.current.merge((state: any) => {
				expect(state).toStrictEqual({
					...result.current.value
				})
				return state
			})
		)
	})
	it("Successfully handles function write update", async () => {
		const { result } = renderHook(() => useStorage("meta"))

		expect(result.current.value.count).toBe(0)

		// Write 1000 times without waiting for the state to update
		for (let i = 0; i < 10; i++) {
			await act(() =>
				result.current.write((state: any) => ({
					...state,
					count: state.count + 1
				}))
			)
		}

		await waitFor(() => expect(result.current.value.count).toBe(10))

		await act(() =>
			result.current.write(() => ({
				count: -1000,
				version: "2.0.0",
				switch: true
			}))
		)

		await waitFor(() => {
			expect(result.current.value.count).toBe(-1000)
			expect(result.current.value.version).toBe("2.0.0")
			expect(result.current.value.switch).toBe(true)
		})

		// Check that the state provided to the write function is the same as the current state
		await act(() =>
			result.current.write((state: any) => {
				expect(state).toStrictEqual({
					...result.current.value
				})
				return state
			})
		)
	})
})
