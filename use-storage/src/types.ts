import AsyncStorage from "@react-native-async-storage/async-storage"
import { z } from "zod"

export interface PersistentStorage
	extends Record<string | number | symbol, z.Schema> {}

export let storageSchema = {} as PersistentStorage
export let storage = null as unknown as typeof AsyncStorage
export function setStorageSchema(
	schema: PersistentStorage,
	storageInstance: typeof AsyncStorage
) {
	storageSchema = schema
	storage = storageInstance
}
