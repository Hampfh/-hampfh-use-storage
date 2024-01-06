import React from "react"
import { Provider } from "react-redux"
import store from "./store/store"
import { z } from "zod"
import { RegisteredStorage } from "./types"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { setStorageSchema } from "./register"

export type InferredStore<T extends RegisteredStorage> = {
	[K in keyof T]: z.infer<T[K]>
}

/**
 * Initializes types and storage for the library
 * @param options Settings object used to specify storage solution and configuring the schema
 */
export function Storage<T extends RegisteredStorage>(options: {
	schema: T
	storage: typeof AsyncStorage
}) {
	setStorageSchema(options.schema, options.storage)
}

/**
 * StorageProvider is a wrapper component for redux,
 * used to provide interactive state management for the library
 */
export function StorageProvider({ children }: { children: React.ReactNode }) {
	return <Provider store={store}>{children}</Provider>
}
