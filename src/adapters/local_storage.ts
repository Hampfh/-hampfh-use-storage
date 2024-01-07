import { StorageAdapter } from "."
import { InferredStore } from "../provider"
import { RegisteredStorage } from "../types"

export class LocalStorageAdapter implements StorageAdapter {
	base64 = false
	prefix = ""
	constructor(options?: { base64?: boolean; prefix?: string }) {
		if (options?.base64) this.base64 = true
		if (options?.prefix) this.prefix = options.prefix
	}
	async clearFile(file: string) {
		let fileKey = file
		if (this.base64) fileKey = btoa(fileKey)
		window.localStorage.removeItem(`${this.prefix}${fileKey}`)
		return true
	}
	async readFile(file: string) {
		let fileKey = file
		if (this.base64) fileKey = btoa(fileKey)
		const rawData = window.localStorage.getItem(`${this.prefix}${fileKey}`)
		if (!rawData) return null
		if (this.base64) return JSON.parse(atob(rawData))
		return JSON.parse(rawData)
	}
	async writeFile(file: string, state: InferredStore<RegisteredStorage>) {
		let fileKey = file
		let fileState = JSON.stringify(state)
		if (this.base64) {
			fileKey = btoa(fileKey)
			fileState = btoa(fileState)
		}
		window.localStorage.setItem(`${this.prefix}${fileKey}`, fileState)
		return true
	}
}
