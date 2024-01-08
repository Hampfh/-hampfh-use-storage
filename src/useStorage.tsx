import { useEffect, useState } from "react"
import { selectPersistedField } from "./store/persistent_selectors"
import { setField } from "./store/persistent_slice"
import { RegisteredStorage } from "./types"
import { InferredStore } from "./provider"
import { adapter, storageSchema } from "./register"
import { ZodError } from "zod"
import store from "./store/store"

/**
 * Asyncronously clears a substate from the persistent storage
 * @param file A key of the specified schmea type, specifying which substate to clear
 * @returns void
 */
export async function clearStorageFile(file: keyof RegisteredStorage) {
	// Create a "transaction" to revert the state if the write fails
	const previousState = store.getState().persisted[file]

	store.dispatch(
		setField({
			key: file,
			subState: undefined
		})
	)
	try {
		await adapter.clearFile(file as string)
		return true
	} catch (error) {
		// Rollback the state change
		store.dispatch(setField({ key: file, subState: previousState }))
		return false
	}
}

/**
 * Asyncronously writes a substate to the persistent storage
 * @param file A key of the specified schmea type, specifying which substate to clear
 * @param data The new substate to write to the persistent storage
 * @returns Whether the write was successful
 * @throws If input data does not match the specified schema
 */
export async function writeStorageFile<
	Schema extends InferredStore<RegisteredStorage>,
	Key extends keyof Schema & string
>(file: Key, data: Schema[Key]) {
	const parseResult = storageSchema[file].safeParse(data)
	if (!parseResult.success)
		throw new Error("Could not write to substate due to unsynced schema")

	// Create a "transaction" to revert the state if the write fails
	const previousState = store.getState().persisted[file]
	store.dispatch(setField({ key: file, subState: data }))
	try {
		await adapter.writeFile(file as string, data)
		return true
	} catch (error) {
		store.dispatch(setField({ key: file, subState: previousState }))
		return false
	}
}

/**
 * Asynchronously reads a substate from the persistent storage
 * @param file A key of the specified schmea type, specifying which substate to clear
 * @param options Provide options to modify the behavior of the function
 * @param options.clearOnCorrupt Whether to clear the substate from the persistent storage if it does not match the specified schema. Default false
 * @param options.onCorrupt Invoked when fetched substate no longer matches specified schema
 * @returns The substate read from the persistent storage, or null if it does not exist
 */
export async function readStorageFile<
	Schema extends InferredStore<RegisteredStorage>,
	K extends keyof Schema & string
>(
	file: K,
	options?: {
		clearOnCorrupt?: boolean
		onCorrupt?: (error: ZodError<any>, parsed: any) => Promise<void>
	}
): Promise<Schema[K] | null> {
	const data = await adapter.readFile(file as string)

	try {
		const parseResult = storageSchema[file].safeParse(data ?? undefined)
		if (parseResult.success) return parseResult.data
		else {
			if (data == null) {
				console.warn(
					`Substate "${file}" returned but is neither optional or has a default value, try to add .default() or .optional()`
				)
			}
			await options?.onCorrupt?.(parseResult.error, data)
			return null
		}
	} catch (error) {
		if (options?.clearOnCorrupt === true) adapter.clearFile(file as string)
	}
	return null
}

/**
 * A hook for interacting with the persistent storage within the context of react
 * @param file A key of the specified schmea type, specifying which substate to clear
 * @returns A set of functions for interacting with the persistent storage, and the current value of the substate
 */
export function useStorage<
	Schema extends InferredStore<RegisteredStorage>,
	Key extends keyof Schema & string
>(file: Key) {
	const [initialized, setInitialized] = useState(false)
	const [refreshCounter, setRefreshCounter] = useState(0)
	const [state, setState] = useState<Schema[Key]>()

	useEffect(() => {
		readStorageFile(file)
			.then(parsed => {
				if (parsed == null) return
				store.dispatch(
					setField({
						key: file,
						subState: parsed
					})
				)
			})
			.finally(() => setInitialized(true))
	}, [refreshCounter])

	useEffect(() => {
		const unsubscribe = store.subscribe(() => {
			const state = store.getState()
			const value = selectPersistedField(state, file as string)
			if (value !== state) setState(state.persisted[file])
		})

		return () => unsubscribe()
	}, [])

	// If value is null, use the default value if it exists
	let value = state
	if (state == null) {
		const defaultValue = storageSchema[file].safeParse(undefined)
		if (defaultValue.success) value = defaultValue.data
	}

	return {
		/**
		 * Value is the reactive representation of the persistent state, it is continuously
		 * synced with the persistent storage
		 */
		value: value as Schema[Key],
		/**
		 * A boolean value indicating whether the persistent storage has been loaded,
		 * while initialization is in progress, the value will either be the default
		 * value if that is provided or null
		 */
		initialized: initialized,
		/**
		 * Validate input data against the specified schema, if data is successfully
		 * passed through this function it is safe to write to file
		 * @param data Any json serializable data
		 * @returns Boolean indicating whether the input data matches the specified schema
		 */
		valid: (data: any): data is Schema[Key] =>
			storageSchema[file].safeParse(data).success,
		/**
		 * Read state from storage again and overwrite reactive state, this is useful
		 * if the persistent storage is modified by another process and the reactive
		 * state has to be notified about the change
		 */
		refresh: () => setRefreshCounter(refreshCounter + 1),
		/**
		 * Clear the substate from the persistent storage, value will either
		 * be the default value if provided, else null
		 */
		clear: async () => await clearStorageFile(file as string),
		/**
		 * Write to an entire substate, this will overwrite the entire state
		 * @param data The new substate to write to the persistent storage, must match the specified schema
		 */
		write: async (state: Schema[Key]) =>
			await writeStorageFile(file, state),
		/**
		 * Merge new fields into the substate, this will only update the specified fields, everything else will be left as is
		 * @param updatedFields A partial object of the substate to update, this will merge the new fields with the existing substate
		 * @returns
		 */
		merge: async (updatedFields: Partial<Schema[keyof Schema]>) => {
			if (updatedFields == null) return
			return await writeStorageFile(file, {
				...state,
				...updatedFields
			} as Schema[Key])
		}
	}
}
