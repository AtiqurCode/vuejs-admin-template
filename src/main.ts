import { createApp } from 'vue'
import { Quasar, Notify, Loading } from 'quasar'
import quasarLang from 'quasar/lang/en-US'
import quasarIconSet from 'quasar/icon-set/material-icons'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Import app styles
import './style.css'
import App from './App.vue'

const app = createApp(App)

app.use(Quasar, {
  plugins: {
    Notify,
    Loading
  },
  lang: quasarLang,
  iconSet: quasarIconSet,
})

app.mount('#app')