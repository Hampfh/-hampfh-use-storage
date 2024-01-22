import { StorageAdapter } from "@/adapters"

/**
 * The purpose of this testadapter is to save the state in memory and perform tests on it.
 */
export class TestAdapter implements StorageAdapter {
	storage: Record<string, any> = {}

	async clearFile(file: string) {
		// This adapter overwrites this function as we want to be able to reset redux
		// without affecting the storage for testing purposes.
		return true
	}
	async readFile(file: string) {
		if (!this.storage[file]) {
			return null
		}
		return JSON.parse(this.storage[file])
	}
	async writeFile(file: string, state: unknown) {
		this.storage[file] = JSON.stringify(state)
		return true
	}

	reset() {
		this.storage = {}
	}
}
