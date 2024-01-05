import React from "react"
console.log("REACT", React)
import { Provider } from "react-redux"
import store from "./store"
import { z } from "zod"
import useStorage from "./useStorage"
import { SchemaGenericType, setStorageSchema, storageSchema } from "./types"
import AsyncStorage from "@react-native-async-storage/async-storage"

export function createStore<T extends SchemaGenericType>(
	schema: T,
	storage: typeof AsyncStorage
) {
	setStorageSchema(schema, storage)
	type SchemaKeys = keyof T
	type Clean = { [K in SchemaKeys]: z.infer<T[K]> }

	return {
		Provider: ({ children }: { children: React.ReactNode }) => (
			<StorageProvider>{children}</StorageProvider>
		),
		useStorage: <K extends SchemaKeys>(file: K) =>
			useStorage<Clean, K>(file)
	}
}

export function StorageProvider<const T extends SchemaGenericType>({
	children
}: {
	children: React.ReactNode
}) {
	return <Provider store={store}>{children}</Provider>
}
