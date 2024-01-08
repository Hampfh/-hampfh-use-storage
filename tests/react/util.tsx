// @vitest-environment jsdom

import { render } from "@testing-library/react"
import { StorageProvider } from "@/provider"

function AllTheProviders({ children }: { children?: React.ReactNode }) {
	return <StorageProvider>{children}</StorageProvider>
}

const customRender = (ui: React.ReactElement, options: {}) =>
	render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from "@testing-library/react"

// override render method
export { customRender as render }
