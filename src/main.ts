import { createApp } from 'vue'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource-variable/work-sans'
import App from './App.vue'
import router from './router'
import { registerIcons } from './icons'
import './assets/main.css'

registerIcons()

createApp(App).use(router).mount('#app')
