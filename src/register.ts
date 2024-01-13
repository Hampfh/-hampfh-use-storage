import { StorageAdapter } from "./adapters"
import { RegisteredStorage } from "./types"

export let storageSchema = {} as RegisteredStorage
export let adapter = null as unknown as StorageAdapter

export function setStorageSchema(
	schema: RegisteredStorage,
	storageInstance: StorageAdapter
) {
	if (
		"clearFile" in storageInstance === false ||
		"writeFile" in storageInstance === false ||
		"readFile" in storageInstance === false
	) {
		throw new Error("Invalid adapter provided to use-storage")
	}

	storageSchema = schema
	adapter = storageInstance
}
