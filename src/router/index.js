import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AddPatient from '../views/patient/AddPatient.vue'
import SearchPatient from '../views/patient/SearchPatient.vue'
import AddCase from '../views/case/CaseAdd.vue'
import SearchCase from '../views/case/SearchCase.vue'

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
  }
]

const router = new VueRouter({
  routes
})

export default router
