import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AddPatient from '../views/patient/AddPatient.vue'
import SearchPatient from '../views/patient/SearchPatient.vue'
import AddCase from '../views/case/CaseAdd.vue'
import SearchCase from '../views/case/SearchCase.vue'
import DictionaryManage from '../views/dictionary/DictionaryManage.vue'
// import EditPassword from '../views/dictionary/DictionaryManage.vue'
import ExportBase from '../views/database/exportBase.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/addpatient',
    name: 'addpatient',
    component: AddPatient
  },
  {
    path: '/searchpatient',
    name: 'searchpatient',
    component: SearchPatient
  },
  {
    path: '/addcase',
    name: 'addcase',
    component: AddCase
  },
  {
    path: '/searchcase',
    name: 'searchcase',
    component: SearchCase
  },
  {
    path: '/dictionary',
    name: 'dictionary',
    component: DictionaryManage
  },
  {
    path: '/exportbase',
    name: 'exportbase',
    component: ExportBase
  }
]

const router = new VueRouter({
  routes
})

export default router
