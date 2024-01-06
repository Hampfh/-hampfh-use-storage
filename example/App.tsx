import { Button, StyleSheet, Text, View } from "react-native"
import { z } from "zod"
import {
	createStore,
	StorageProvider,
	clearStorageFile,
	PersistentStorage,
	readStorageFile
} from "@hampfh/use-storage"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React from "react"

const schema = {
	file: z.object({
		version: z.string(),
		clickCount: z.number()
	}),
	file2: z.object({
		hello: z.string(),
		world: z.number()
	})
}
export const { useStorage } = createStore(schema, AsyncStorage)

/* declare module "@hampfh/use-storage" {
	type Temp = typeof schema
	interface PersistentStorage extends Temp {}
}

const test: PersistentStorage */

async function test2() {
	const value = await readStorageFile<typeof schema>("file")

	await clearStorageFile("file")
	const test = await readStorageFile("file")

	return null
}

function Component() {
	const { value, write } = useStorage("file")

	async function test() {
		await write({
			clickCount: 1,
			version: "1"
		})
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
