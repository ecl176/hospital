import Vue from 'vue'
import VueRouter from 'vue-router'
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
    name: 'addpatient_sub1',
    component: AddPatient
  },
  {
    path: '/addpatient',
    name: 'addpatient_sub1',
    component: AddPatient
  },
  {
    path: '/searchpatient',
    name: 'searchpatient_sub1',
    component: SearchPatient
  },
  {
    path: '/addcase',
    name: 'addcase_sub2',
    component: AddCase
  },
  {
    path: '/searchcase',
    name: 'searchcase_sub2',
    component: SearchCase
  },
  {
    path: '/dictionary',
    name: 'dictionary_sub3',
    component: DictionaryManage
  },
  {
    path: '/exportbase',
    name: 'exportbase_sub4',
    component: ExportBase,
    dkey: 'sub4'
  }
]

const router = new VueRouter({
  routes
})

export default router
