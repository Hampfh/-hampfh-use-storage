import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { StorageProvider } from "@hampfh/use-storage"

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<StorageProvider>
			<App />
		</StorageProvider>
	</React.StrictMode>
)
