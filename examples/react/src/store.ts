import { configureStore, createSlice } from "@reduxjs/toolkit"

export const testSlice = createSlice({
	name: "test",
	initialState: {
		value: 0
	},
	reducers: {
		increment: state => {
			state.value += 1
		},
		decrement: state => {
			state.value -= 1
		},
		reset: () => ({
			value: 0
		})
	}
})
export const { increment, decrement, reset } = testSlice.actions

export const store = configureStore({
	reducer: {
		test: testSlice.reducer
	}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
