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
	adapter: new LocalStorageAdapter()
})

declare module "@hampfh/use-storage" {
	interface Register {
		schema: typeof schema
	}
}

function App() {
	const { value, merge } = useStorage("file")
	console.log(value)

	return (
		<div className="card">
			<button
				onClick={async () =>
					await merge({
						count: (value?.count ?? 0) + 1
					})
				}
			>
				count is {value?.count}
			</button>
		</div>
	)
}

export default App
