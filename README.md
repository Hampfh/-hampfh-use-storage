# useStorage

Store fully typed reactive persistent state, supports both react & react native. useStorage wraps both async storage and redux toolkit allowing the benefits of reactivness and persistency at the same time.

- [⚙️ Setup](#setup)
  - [Install peer dependencies](#install-peer-dependencies)
  - [Initialize storage](#initialize-storage)
- [🚀 Usage](#usage)
  - [Read value](#read-value)
  - [Write value](#write-value)
  - [Action on load](#action-on-load)
- [📚 API](#api)
  - [Storage](#storage)
  - [useStorage](#usestorage-hook)
  - [readStorageFile](#readstoragefile)
  - [writeStorageFile](#writestoragefile)
  - [clearStorageFile](#clearstoragefile)
  - [StorageProvider](#storageprovider)
- [🔌 Adapters](#adapters)
  - [AsyncStorage (react native)](#asyncstorage-react-native)
  - [LocalStorageAdapter (web)](#localstorageadapter-web)

## Setup

### Install peer dependencies

```
yarn add zod @reduxjs/toolkit
```

Define your persistent files at the beginning of your app and wrap the application in the provider

### Initialize storage

Make sure that wherever you declare this, it is imported in your entrypoint.

```tsx
import { Storage, StorageProvider } from "@hampfh/use-storage"

const schema = {
  file: z.object({
    version: z.string(),
    clickCount: z.number()
  }).default({
    version: "1.0.0",
    clickCount: 0
  })
  file2: // other file schema ...
}

Storage({
  schema
})

declare module "@hampfh/use-storage" {
  interface Register {
    schema: typeof schema
  }
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

### Storage

The storage function is used to initialize the library and all typings. Call this function at the beginning of your app.

```ts
Storage({
  schema: Record<string, z.ZodObject>,
  adapter: StorageAdapter
})
```

### useStorage hook

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

## Adapters

Adapters are provide the logic for reading and writing to storeage. Any new adapter can easily be added by implementing the interface. As of now there are three adapters, one for react native, react and the a BaseAdapter. The BaseAdapter is used unless anything else is provided. The BaseAdapter is **NOT** suited for production and won't persist state.

### AsyncStorage (react native)

#### Peer dependency

To use this adapter install the async storage library for react native

```
yarn add @react-native-async-storage/async-storage
```

```ts
import { AsyncStorageAdapter } from "@hampfh/use-storage"

Storage({
  schema,
  adapter: new AsyncStorageAdapter()
})
```

### LocalStorageAdapter (web)

```ts
import { LocalStorageAdapter } from "@hampfh/use-storage"

Storage({
  schema,
  adapter: new LocalStorageAdapter({
    prefix?: string // Prefix each key with the provided string
    base64?: boolean // Encode values when writing to local storage
  })
})
```
