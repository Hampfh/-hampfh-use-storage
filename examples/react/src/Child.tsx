import { useStorage } from "@hampfh/use-storage"

export function Child({ index }: { index: number }) {
	const { value } = useStorage("file")
	return (
		<div>
			{index}: {value.count}
		</div>
	)
}
