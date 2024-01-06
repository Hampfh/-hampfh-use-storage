import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RegisteredStorage } from "../types"
const initialState = {} as RegisteredStorage

const persistentSlice = createSlice({
	name: "account",
	initialState,
	reducers: {
		setField: (
			state,
			action: PayloadAction<{
				key: keyof RegisteredStorage
				subState: RegisteredStorage[keyof RegisteredStorage] | undefined
			}>
		) => {
			// @ts-ignore
			state[action.payload.key] = action.payload.subState
		}
	}
})

export const { setField } = persistentSlice.actions
export default persistentSlice.reducer
