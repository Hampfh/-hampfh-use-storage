import { Button, StyleSheet, Text, View } from "react-native"
import {
	StorageProvider,
	clearStorageFile,
	readStorageFile,
	useStorage,
	writeStorageFile
} from "@hampfh/use-storage"
import React from "react"

function Component() {
	const { value, write } = useStorage("file")

	async function test() {
		await write({
			clickCount: 1,
			version: "1"
		})
	}

	async function test2() {
		await clearStorageFile("file")
		const file1 = await readStorageFile("file")
		console.log(file1?.clickCount)
		const file2 = await readStorageFile("file2")
		await writeStorageFile("file", {
			clickCount: 2,
			version: ""
		})
		console.log(file2?.world)
	}

	return (
		<View>
			<Text>{value.clickCount}</Text>
			<Button title="Increment" onPress={test} />
		</View>
	)
}

export default function App() {
	return (
		<StorageProvider>
			<View style={styles.container}>
				<Text
					style={{
						color: "black"
					}}
				>
					Test application
				</Text>
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
