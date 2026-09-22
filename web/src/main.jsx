import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";

const savedTheme = localStorage.getItem("theme");
document.documentElement.dataset.theme =
  savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    
  </StrictMode>,
)
