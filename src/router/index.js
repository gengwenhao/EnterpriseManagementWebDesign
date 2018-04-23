import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/Index'
import UserProfileManager from '../views/UserProfileManager'
import Tree from '../views/Tree'
import AllOrgs from '../views/AllOrgs'
import AllUsers from '../views/AllUsers'

Vue.use(Router)


export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/userprofile-mamager',
      name: 'userprofile-manager',
      component: UserProfileManager
    },
    {
      path: '/tree',
      name: 'tree',
      component: Tree
    },
    {
      path: '/all-orgs',
      name: 'all-orgs',
      component: AllOrgs
    },
    {
      path: '/all-users',
      name: 'all-users',
      component: AllUsers
    }
  ]
})
