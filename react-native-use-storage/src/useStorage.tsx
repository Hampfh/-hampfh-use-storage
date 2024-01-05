import React from "react"
console.log("REACT inner", React)
import { selectPersistedField } from "./persistent_selectors"
import { useDispatch, useSelector } from "react-redux"
import { setField } from "./persistent_slice"
import { SchemaGenericType, storage, storageSchema } from "./types"

export async function clearStorageFile<const T extends {}>(file: keyof T) {
	return await storage.removeItem(file as string)
}

export async function writeStorageFile<
	const T extends SchemaGenericType,
	K extends keyof T & string
>(file: K, data: T[K]) {
	const parseResult = storageSchema[file].safeParse(data)
	if (!parseResult.success) return false
	try {
		await storage.setItem(file, JSON.stringify(data))
		return true
	} catch (error) {
		return false
	}
}

export async function readStorageFile<
	const T extends SchemaGenericType,
	K extends keyof T
>(file: K): Promise<T[K] | null> {
	const result = await storage.getItem(file as string)
	if (result == null) return null
	try {
		const parsed = JSON.parse(result)
		const parseResult = storageSchema[file].safeParse(parsed)
		if (parseResult.success) {
			return parsed
		} else return null
	} catch (error) {
		storage.removeItem(file as string)
	}
	return null
}

export default function useStorage<T extends {}, const K extends keyof T>(
	file: K
) {
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

	async function write(data: T[K]) {
		const parseResult = storageSchema[file].safeParse(data)
		if (!parseResult.success) return false
		try {
			dispatch(
				setField({
					key: file,
					subState: data as SchemaGenericType<T>[K]
				})
			)
			await storage.setItem(file as string, JSON.stringify(data))

			return true
		} catch (error) {
			return false
		}
	}

	return {
		valid: (data: any): data is T[K] => {
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
		merge: async (updatedFields: Partial<T[K]>) => {
			if (updatedFields == null) return
			return await write({
				...fieldValue,
				...updatedFields
			} as T[K])
		},
		value: fieldValue as T[K],
		initialized: initialized
	}
}
