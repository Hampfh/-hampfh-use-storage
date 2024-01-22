import { useStorage } from "@/useStorage"

export function TestModifier() {
	const { value, merge, clear, write, refresh } = useStorage("meta")
	return (
		<>
			<p role="text" aria-label="count">
				{value.count}
			</p>
			<p role="text" aria-label="version">
				{value.version}
			</p>
			<p role="text" aria-label="switch">
				{value.switch?.toString()}
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
			<button role="button" onClick={refresh}>
				Refresh
			</button>
		</>
	)
}
