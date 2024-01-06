import AsyncStorage from "@react-native-async-storage/async-storage"
import { z } from "zod"
export interface Register {
	// schema: PersistentStorage
}

type AnySchema = Record<string | number | symbol, z.Schema>

export type RegisteredStorage = Register extends {
	schema: infer TSchema extends AnySchema
}
	? TSchema
	: AnySchema

export let storageSchema = {} as RegisteredStorage
export let storage = null as unknown as typeof AsyncStorage
export function setStorageSchema(
	schema: RegisteredStorage,
	storageInstance: typeof AsyncStorage
) {
	storageSchema = schema
	storage = storageInstance
}
