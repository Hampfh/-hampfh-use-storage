import AsyncStorage from "@react-native-async-storage/async-storage"
import { z } from "zod"

export type SchemaGenericType<T = {}> = Record<
	string | number | symbol,
	z.Schema
>

export let storageSchema = {} as SchemaGenericType
export let storage = null as unknown as typeof AsyncStorage
export function setStorageSchema(
	schema: SchemaGenericType,
	storageInstance: typeof AsyncStorage
) {
	storageSchema = schema
	storage = storageInstance
}
