import { ZodType, ZodTypeDef } from "zod"
import { InferredStore } from "../provider"
import { RegisteredStorage } from "../types"

export { LocalStorageAdapter } from "./local_storage"
export { AsyncStorageAdapter } from "./async_storage"

export interface StorageAdapter {
	clearFile: (key: string) => Promise<boolean>
	writeFile: (
		key: string,
		state: InferredStore<RegisteredStorage>
	) => Promise<boolean>
	readFile: (key: string) => Promise<any>
}

let messageSent = false
export class BaseAdapter implements StorageAdapter {
	constructor() {
		if (messageSent) return
		messageSent = true
		console.warn(
			"BaseAdapter is a development adapter, it is not production ready"
		)
	}
	async clearFile(key: string) {
		return true
	}
	async writeFile(key: string, state: InferredStore<RegisteredStorage>) {
		return true
	}
	async readFile(key: string) {
		return null
	}
}
