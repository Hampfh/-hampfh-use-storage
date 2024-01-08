import "./App.css"
import { z } from "zod"
import { LocalStorageAdapter, Storage, useStorage } from "@hampfh/use-storage"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState, increment, reset } from "./store"
/* import { useSelector } from "react-redux"
import { RootState } from "./store" */

const schema = {
	file: z
		.object({
			count: z.number()
		})
		.default({
			count: 0
		}),
	another: z
		.object({
			count: z.number()
		})
		.default({ count: 0 })
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
	const dispatch = useDispatch()
	const { value, merge, clear } = useStorage("file")
	const { value: another } = useStorage("another")
	const { value: count } = useSelector((state: RootState) => state.test)

	useEffect(() => {
		console.log("UPDATED ANOTHER", another)
	}, [another])

	return (
		<div className="card">
			<h3>Redux</h3>
			<div className="inline-redux">
				<button onClick={() => dispatch(increment())}>
					count is {count}
				</button>
				<button onClick={() => dispatch(reset())}>reset</button>
			</div>
			<h3>@hampfh/use-storage</h3>
			<div className="inline-redux">
				<button
					onClick={async () =>
						await merge({
							count: value.count + 1
						})
					}
				>
					count is {value.count}
				</button>
				<button onClick={() => clear()}>reset</button>
			</div>
		</div>
	)
}

export default App
