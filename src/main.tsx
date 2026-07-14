import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";

// biome-ignore lint/style/noNonNullAssertion: We control the index.html and know that root is there. The fact that getElementById could return undefined, is just because it doesn't know the HTML. This is not a problem worth adding "checking" code
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
