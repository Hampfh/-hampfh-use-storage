import { StyleSheet, Text, View } from "react-native"
import { z } from "zod"
import { createStore } from "@hampfh/use-storage"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useEffect } from "react"
import { StorageProvider } from "@hampfh/use-storage/lib/provider"

export const { useStorage } = createStore(
	{
		hello: z.object({
			test: z.string(),
			other: z.number()
		})
	},
	AsyncStorage
)

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
				<InnerComponent />
			</View>
		</StorageProvider>
	)
}

function InnerComponent() {
	const { value, write } = useStorage("hello")

	useEffect(() => {
		write({
			test: "test",
			other: 123
		})
	}, [])

	return (
		<View>
			<Text>{JSON.stringify(value)}</Text>
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
