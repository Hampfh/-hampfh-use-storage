# useStorage

Store fully typed reactive persistent state in react native. useStorage wraps both async storage and redux toolkit allowing the benefits of reactivness and persistency at the same time.

## 🚀 Initialization

### 📚 Install peer dependencies

```
yarn install @react-native-async-storage/async-storage zod redux @reduxjs/toolkit
```

Define your persistent files at the beginning of your app and wrap the application in the provider

```ts
import { createStore, StorageProvider } from "@hampfh/use-storage"
// index.ts (App.tsx in expo)
export const { useStorage } = createStore(
	{
		file: z.object({
			version: z.string(),
			clickCount: z.number()
		})
		file2: // other file schema ...
	},
	AsyncStorage // Pass in storage solution
)


export default function App() {
	return (
		<StorageProvider>
			// ... rest of your app
		</StorageProvider>
	)
}
```

## Usage

### Read value

```tsx
function Component() {
  const { value } = useStorage("file")

  function onClick() {
    console.log(value)
  }

  return <Button onPress={onClick} />
}
```

### Write value

```tsx
function Component() {
	const { value, merge, write } = useStorage("file")

	async function incrementClick() {
		await merge({
			clickCount: value.clickCount + 1
		})
	}

	async function set() {
		await write({
			version: "1.0.0",
			clickCount: 0
		})
	}

	return (
		<>
			<Text>{value}</Text>
			<Button title="Increment" onPress={incrementClick} />
			<Button title="Set" onPress={set}>
		</>
	)
}
```

### Outside of hooks

Accessing state outside of a react component can be done with the equivalent functions: `clearStorageFile(file)`, `readStorageFile(file)`, and `writeStorageFile(file, newState)`. This is not typesafe at this point in time
