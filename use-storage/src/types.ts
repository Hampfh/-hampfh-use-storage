import { z } from "zod"

/**
 * Register is a type defined to be overwritten by the user.
 * This allow type injection into the library methods with proper inference.
 */
export interface Register {
	// schema: PersistentStorage
}

type AnySchema = Record<string | number | symbol, z.Schema>

export type RegisteredStorage = Register extends {
	schema: infer TSchema extends AnySchema
}
	? TSchema
	: AnySchema
