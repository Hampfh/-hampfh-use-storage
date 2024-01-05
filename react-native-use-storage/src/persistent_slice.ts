import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { SchemaGenericType } from "./types"
const initialState = {} as SchemaGenericType

const persistentSlice = createSlice({
	name: "account",
	initialState,
	reducers: {
		setField: (
			state,
			action: PayloadAction<{
				key: keyof SchemaGenericType
				subState: SchemaGenericType[keyof SchemaGenericType] | undefined
			}>
		) => {
			// @ts-ignore
			state[action.payload.key] = action.payload.subState
		},
	},
})

export const { setField } = persistentSlice.actions
export default persistentSlice.reducer
