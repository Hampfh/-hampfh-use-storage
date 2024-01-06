# useStorage

Store fully typed reactive persistent state in react native. useStorage wraps both async storage and redux toolkit allowing the benefits of reactivness and persistency at the same time.

- [Initialization](#-initialization)
  - [Install peer dependencies](#-install-peer-dependencies)
  - [Setup](#-setup)
- [Usage](#usage)
  - [Read value](#read-value)
  - [Write value](#write-value)
  - [Action on load](#action-on-load)
- [API](#api)
  - [useStorage](#usestorage)
  - [readStorageFile](#readstoragefile)
  - [writeStorageFile](#writestoragefile)
  - [clearStorageFile](#clearstoragefile)
  - [StorageProvider](#storageprovider)

## 🚀 Initialization

### 📚 Install peer dependencies

```
yarn install @react-native-async-storage/async-storage zod redux @reduxjs/toolkit
```

Define your persistent files at the beginning of your app and wrap the application in the provider

### Setup

```tsx
import { Storage, StorageProvider } from "@hampfh/use-storage"

const schema = {
  file: z.object({
    version: z.string(),
    clickCount: z.number()
  })
  file2: // other file schema ...
}

Storage({
  schema,
  storage: AsyncStorage // Pass in storage solution
})

declare module "@hampfh/use-storage" {
  interface Register {
    schema: typeof schema
  }
}

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

### Action on load

There are scenarios where you want to perform an action when a component is loaded. Due to the nature of async storages a value cannot be provided instantly and will therefore provide undefined. In such case we can wait for the file to be instantiated

```tsx
function Component() {
  const { initialized, value, write } = useStorage("file")

  useEffect(() => {
    if (initialized) {
      // Now value is loaded, do something with it
      console.log(value)
    }
  }, [initialized])

  return null
}
```

## API

### useStorage

```tsx
const { initialized, value, write, merge, clear } = useStorage(file: string)
```

This hook like any other must be called within a component and requires [StorageProvider](#storageprovider) to be wrapped around.

#### Fields

**initialized**: value indicating if the state has been loaded or not  
**value**: The selected file's state  
**write**: Set the selected file's state, must provide entire file state  
**merge**: Merge the selected file's state, can provide partial file state  
**clear**: Clear the selected file's state, sets to default state

### readStorageFile

```ts
readStorageFile(file: string): Promise<file_state | null>
```

### writeStorageFile

```ts
writeStorageFile(file: string, newState: sub_state): Promise<boolean>
```

### clearStorageFile

```ts
clearStorageFile(file: string): Promise<void>
```

### StorageProvider

Provider component for useStorage, must be wrapped around the entire app.
