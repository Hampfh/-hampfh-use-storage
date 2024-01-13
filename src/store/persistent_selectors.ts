import { createSelector as cs } from "@reduxjs/toolkit"
import { RootState } from "./store"

export const selectPersistedField = cs(
	[(state: RootState) => state, (_, field: string) => field],
	(state, field) => state.persisted[field]
)
