import { configureStore } from "@reduxjs/toolkit"
import persistentSlice from "./persistent_slice"

export const store = configureStore({
	reducer: {
		persisted: persistentSlice
	},
	devTools: {
		name: "@hampfh/use-storage"
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware()
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
