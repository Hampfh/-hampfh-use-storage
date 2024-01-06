import AsyncStorage from "@react-native-async-storage/async-storage"
import { StorageAdapter } from "."
import { InferredStore } from "../provider"
import { RegisteredStorage } from "../types"

export class AsyncStorageAdapter implements StorageAdapter {
	storage: typeof AsyncStorage

	constructor(storage: typeof AsyncStorage) {
		this.storage = storage
	}
	async clearFile(file: string) {
		await AsyncStorage.removeItem(file)
		return true
	}
	async readFile(file: string) {
		const rawData = await AsyncStorage.getItem(file)
		return JSON.stringify(rawData)
	}
	async writeFile(file: string, state: InferredStore<RegisteredStorage>) {
		await AsyncStorage.setItem(file, JSON.stringify(state))
		return true
	}
}
