import React from "react"
import { selectPersistedField } from "./store/persistent_selectors"
import { useDispatch, useSelector } from "react-redux"
import { setField } from "./store/persistent_slice"
import { RegisteredStorage } from "./types"
import { InferredStore } from "./provider"
import { storage, storageSchema } from "./register"
import { ZodError } from "zod"

/**
 * Asyncronously clears a substate from the persistent storage
 * @param file A key of the specified schmea type, specifying which substate to clear
 * @returns void
 */
export async function clearStorageFile(file: keyof RegisteredStorage) {
	try {
		await storage.removeItem(file as string)
		return true
	} catch (error) {
		return false
	}
}

/**
 * Asyncronously writes a substate to the persistent storage
 * @param file A key of the specified schmea type, specifying which substate to clear
 * @param data The new substate to write to the persistent storage
 * @returns Whether the write was successful
 */
export async function writeStorageFile<
	Schema extends InferredStore<RegisteredStorage>,
	Key extends keyof Schema & string
>(file: Key, data: Schema[Key]) {
	const parseResult = storageSchema[file].safeParse(data)
	if (!parseResult.success) return false
	try {
		await storage.setItem(file, JSON.stringify(data))
		return true
	} catch (error) {
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
	const rawData = await (async () => {
		try {
			return await storage.getItem(file as string)
		} catch (error) {
			return null
		}
	})()
	if (rawData == null) return null

	try {
		const parsed = JSON.parse(rawData)
		const parseResult = storageSchema[file].safeParse(parsed)
		if (parseResult.success) return parsed
		else {
			await options?.onCorrupt?.(parseResult.error, parsed)
			return null
		}
	} catch (error) {
		if (options?.clearOnCorrupt === true) storage.removeItem(file as string)
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
	const [initialized, setInitialized] = React.useState(false)
	const dispatch = useDispatch()
	const fieldValue = useSelector(state =>
		selectPersistedField(state, file as string)
	)

	React.useEffect(() => {
		readStorageFile(file)
			.then(parsed => {
				if (parsed == null) return
				dispatch(
					setField({
						key: file,
						subState: parsed
					})
				)
			})
			.finally(() => setInitialized(true))
	}, [])

	async function write(data: Schema[Key]) {
		const parseResult = storageSchema[file].safeParse(data)
		if (!parseResult.success) return false
		try {
			dispatch(
				setField({
					key: file,
					subState: data as RegisteredStorage[Key]
				})
			)
			await storage.setItem(file as string, JSON.stringify(data))

			return true
		} catch (error) {
			return false
		}
	}

	return {
		valid: (data: any): data is Schema[Key] => {
			const result = storageSchema[file].safeParse(data)
			if (result.success) return true
			return false
		},
		clear: async () => {
			dispatch(
				setField({
					key: file,
					subState: undefined
				})
			)
			clearStorageFile(file as string)
		},
		write,
		merge: async (updatedFields: Partial<Schema[keyof Schema]>) => {
			if (updatedFields == null) return
			return await write({
				...fieldValue,
				...updatedFields
			} as Schema[Key])
		},
		value: fieldValue as Schema[Key],
		initialized: initialized
	}
}
