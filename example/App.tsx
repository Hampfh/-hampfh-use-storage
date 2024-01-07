import "./utils/use_storage"
import { StorageProvider, useStorage } from "@hampfh/use-storage"
import { Button, StyleSheet, Text, View } from "react-native"

function Component() {
	const { initialized, value, merge, clear } = useStorage("file")

	if (!initialized) return <Text>Loading...</Text>

	return (
		<View>
			{value != null && <Text>{JSON.stringify(value)}</Text>}
			<View
				style={{
					flexDirection: "row"
				}}
			>
				<Button
					title="Increment"
					onPress={async () =>
						await merge({
							size: (value?.size ?? 0) + 1
						})
					}
				/>
				<Button
					title="Decrement"
					onPress={async () =>
						await merge({
							size: (value?.size ?? 0) - 1
						})
					}
				/>
				<Button title="Reset" onPress={async () => await clear()} />
			</View>
			<View
				style={{
					marginTop: 20,
					flexDirection: "row"
				}}
			>
				<Button
					title="Admin"
					onPress={async () =>
						await merge({
							type: "Admin"
						})
					}
				/>
				<Button
					title="User"
					onPress={async () =>
						await merge({
							type: "User"
						})
					}
				/>
			</View>
		</View>
	)
}

export default function App() {
	return (
		<StorageProvider>
			<View style={styles.container}>
				<Component />
			</View>
		</StorageProvider>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	}
})
