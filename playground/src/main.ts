import '@layout-kit/core'
import './styles.css'

import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { createApp } from 'vue'

import ReactApp from './App'
import VueApp from './App.vue'

createRoot(document.querySelector('#react-root')!).render(
  createElement(ReactApp),
)
createApp(VueApp).mount('#vue-root')
