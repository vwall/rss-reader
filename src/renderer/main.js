import Vue from 'vue'
import Vuetify from 'vuetify'
import jetpack from 'fs-jetpack'
import { remote } from 'electron'
import fs from 'fs'
import 'vuetify/dist/vuetify.css'

import App from './App'
import router from './router'
import store from './store'

const useDataDir = jetpack.cwd(remote.app.getAppPath()).cwd(remote.app.getPath('userData'))

const dirStream = jetpack.exists(useDataDir.path('streams'))
const dirFavicon = jetpack.exists(useDataDir.path('fvavicons'))

if (!dirStream) {
  fs.mkdir(useDataDir.path('streams'))
}

if (!dirFavicon) {
  fs.mkdir(useDataDir.path('favicons'))
}

Vue.use(Vuetify)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
