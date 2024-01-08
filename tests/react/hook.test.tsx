// @vitest-environment jsdom

import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { render } from "./util"

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
