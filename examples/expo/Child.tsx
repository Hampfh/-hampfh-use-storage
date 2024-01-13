import { useStorage } from "@hampfh/use-storage"
import { Text, View } from "react-native"

export function Child({ index }: { index: number }) {
	const { value } = useStorage("file")

	return (
		<View
			style={{
				paddingRight: 20
			}}
		>
			<Text>
				{index}: {value.size}
			</Text>
		</View>
	)
}
