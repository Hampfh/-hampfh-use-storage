import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { PersistentStorage } from "./types"
const initialState = {} as PersistentStorage

const persistentSlice = createSlice({
	name: "account",
	initialState,
	reducers: {
		setField: (
			state,
			action: PayloadAction<{
				key: keyof PersistentStorage
				subState: PersistentStorage[keyof PersistentStorage] | undefined
			}>
		) => {
			// @ts-ignore
			state[action.payload.key] = action.payload.subState
		}
	}
})

export const { setField } = persistentSlice.actions
export default persistentSlice.reducer
