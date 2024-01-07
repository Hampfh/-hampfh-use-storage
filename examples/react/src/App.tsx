import "./App.css"
import { z } from "zod"
import { LocalStorageAdapter, Storage, useStorage } from "@hampfh/use-storage"

const schema = {
	file: z
		.object({
			count: z.number()
		})
		.default({
			count: 0
		})
}

Storage({
	schema,
	adapter: new LocalStorageAdapter({
		base64: true,
		prefix: "some_prefix_"
	})
})

declare module "@hampfh/use-storage" {
	interface Register {
		schema: typeof schema
	}
}

function App() {
	const { value, merge, clear } = useStorage("file")

	return (
		<div className="card">
			<button
				onClick={async () =>
					await merge({
						count: value.count + 1
					})
				}
			>
				count is {value.count}
			</button>
			<button onClick={() => clear()}>Clear data</button>
		</div>
	)
}

export default App
