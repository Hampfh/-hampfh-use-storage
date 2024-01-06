import AsyncStorage from "@react-native-async-storage/async-storage"
import { RegisteredStorage } from "./types"

export let storageSchema = {} as RegisteredStorage
export let storage = null as unknown as typeof AsyncStorage
export function setStorageSchema(
	schema: RegisteredStorage,
	storageInstance: typeof AsyncStorage
) {
	storageSchema = schema
	storage = storageInstance
}
