
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import "./firebase"; // ensure Firebase initializes and logs in console

  createRoot(document.getElementById("root")!).render(<App />);
  