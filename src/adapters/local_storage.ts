import { StorageAdapter } from "."
import { InferredStore } from "../provider"
import { RegisteredStorage } from "../types"

export class LocalStorageAdapter implements StorageAdapter {
	async clearFile(file: string) {
		window.localStorage.removeItem(file)
		return true
	}
	async readFile(file: string) {
		const rawData = window.localStorage.getItem(file)
		if (!rawData) return null
		return JSON.parse(rawData)
	}
	async writeFile(key: string, state: InferredStore<RegisteredStorage>) {
		window.localStorage.setItem(key, JSON.stringify(state))
		return true
	}
}
