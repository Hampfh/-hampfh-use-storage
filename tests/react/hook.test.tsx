// @vitest-environment jsdom

import { LocalStorageAdapter } from "@/adapters"
import { Storage } from "@/provider"
import { clearStorageFile, useStorage } from "@/useStorage"
import { render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { z } from "zod"

function Component() {
	return (
		<>
			<p role="text">Hello there</p>
		</>
	)
}

it("loads and displays greeting", async () => {
	render(<Component />, {})

	expect((await screen.findByRole("text")).textContent).toBe("Hello there")
})
it("loads and displays greeting", async () => {
	expect(1).toBe(1)
})
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
			adapter: new LocalStorageAdapter()
		})
	})

	afterEach(async () => {
		await clearStorageFile("meta")
	})

	function HookComponent() {
		const { value, merge, clear, write } = useStorage("meta")
		return (
			<>
				<p role="text" aria-label="count">
					{value.count}
				</p>
				<p role="text" aria-label="version">
					{value.version}
				</p>
				<p role="text" aria-label="switch">
					{value.switch.toString()}
				</p>

				<button
					role="button"
					onClick={async () => {
						await merge({
							count: value.count + 1
						})
					}}
				>
					Increment
				</button>
				<button
					role="button"
					onClick={async () => {
						await merge({
							count: value.count - 1
						})
					}}
				>
					Decrement
				</button>
				<button role="button" onClick={clear}>
					Reset
				</button>
				<button
					role="button"
					onClick={async () => {
						await write({
							count: 1000,
							version: "2.0.0",
							switch: true
						})
					}}
				>
					Set 1000
				</button>
			</>
		)
	}

	it("Initializes with correct values", () => {
		render(<HookComponent />, {})

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
		const count = screen.getByRole("text", {
			name: "count"
		})

		const buttonIncrement = screen.getByRole("button", {
			name: "Increment"
		})
		const buttonDecrement = screen.getByRole("button", {
			name: "Decrement"
		})

		expect(count.textContent).toBe("0")

		buttonIncrement.click()
		await waitFor(() => expect(count.textContent).toBe("1"))
		buttonDecrement.click()
		await waitFor(() => expect(count.textContent).toBe("0"))
		for (let i = 0; i < 10; i++) {
			await waitFor(() => buttonIncrement.click())
		}

		await waitFor(() => expect(count.textContent).toBe("10"))

		const buttonReset = screen.getByRole("button", {
			name: "Reset"
		})

		buttonReset.click()
		await waitFor(() => expect(count.textContent).toBe("0"))

		const buttonSet1000 = screen.getByRole("button", {
			name: "Set 1000"
		})

		buttonSet1000.click()
		await waitFor(() => {
			const version = screen.getByRole("text", {
				name: "version"
			})
			const switchValue = screen.getByRole("text", {
				name: "switch"
			})
			expect(count.textContent).toBe("1000")
			expect(version.textContent).toBe("2.0.0")
			expect(switchValue.textContent).toBe("true")
		})
	})

	it("Value propagates between components", async () => {
		render(
			<div>
				{Array(2)
					.fill(0)
					.map((_, i) => (
						<div role="directory" key={i} aria-label={i.toString()}>
							<HookComponent />
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

	it("Handles excessive load of components", async () => {
		const componentCount = 100

		render(
			<div>
				{Array(componentCount)
					.fill(0)
					.map((_, i) => (
						<div role="directory" key={i} aria-label={i.toString()}>
							<HookComponent />
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

		waitFor(() => {
			for (let i = 0; i < componentCount; i++) {
				expect(count[i].textContent).toBe("1")
			}
		})
	})
})
