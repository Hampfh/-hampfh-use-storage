import { useStorage } from "@hampfh/use-storage"
import { Button, StyleSheet, Text, View } from "react-native"
import { Child } from "./Child"
import "./utils/use_storage"

function Component() {
	const { initialized, value, merge, clear } = useStorage("file")
	const { value: auth, write } = useStorage("auth")

	if (!initialized) return <Text>Loading...</Text>

	return (
		<View>
			{value != null && <Text>{JSON.stringify(value)}</Text>}
			{auth != null && <Text>{JSON.stringify(auth)}</Text>}
			<Button
				title="Set auth"
				onPress={async () => {
					await write({
						name: "John Doe",
						token: "1234",
						userId: "1234"
					})
				}}
			/>
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
			<View
				style={{
					padding: 10,
					flexDirection: "row",
					flexWrap: "wrap"
				}}
			>
				{Array(100)
					.fill(0)
					.map((_, i) => (
						<Child key={i} index={i} />
					))}
			</View>
		</View>
	)
}

export default function App() {
	return (
		<View style={styles.container}>
			<Component />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	}
})
