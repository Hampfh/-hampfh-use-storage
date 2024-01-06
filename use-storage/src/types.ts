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
