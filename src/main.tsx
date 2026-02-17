
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";
import { testConnection } from "./testSupabase"


  createRoot(document.getElementById("root")!).render(<App />);

  testConnection()
