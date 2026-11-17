import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/inter-tight'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import './styles/global.css'
import './styles/sections.css'
import App from './App.jsx'

// Desliga o menu do botão direito (e o menu de "segurar" no celular) em todo o site,
// exceto em campos de texto, onde ele serve para colar.
document.addEventListener('contextmenu', (e) => {
  if (e.target.closest?.('input, textarea, [contenteditable="true"]')) return
  e.preventDefault()
})
// Arrastar imagens para fora da página também fica desligado.
document.addEventListener('dragstart', (e) => {
  if (e.target instanceof HTMLImageElement) e.preventDefault()
})

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
