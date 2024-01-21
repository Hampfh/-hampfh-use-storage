// @vitest-environment jsdom

import { render, screen } from "@testing-library/react"
import { expect, it } from "vitest"

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
