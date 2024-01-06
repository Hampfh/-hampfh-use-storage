import React from "react"
import { Provider } from "react-redux"
import store from "./store"
import { z } from "zod"
import useStorage, { clearStorageFile, writeStorageFile } from "./useStorage"
import { RegisteredStorage, setStorageSchema, storageSchema } from "./types"
import AsyncStorage from "@react-native-async-storage/async-storage"

export type InferredStore<T extends RegisteredStorage> = {
	[K in keyof T]: z.infer<T[K]>
}

export function createStore<T extends RegisteredStorage>(
	schema: T,
	storage: typeof AsyncStorage
) {
	setStorageSchema(schema, storage)
	type FileKey = keyof InferredStore<T> & string

	return {
		useStorage: <Key extends FileKey>(file: Key) =>
			useStorage<InferredStore<T>, Key>(file)
	}
}

export function StorageProvider<const T extends RegisteredStorage>({
	children
}: {
	children: React.ReactNode
}) {
	return <Provider store={store}>{children}</Provider>
}
