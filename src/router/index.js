import Vue from 'vue'
import Router from 'vue-router'
import goodlist from '@/components/goodlist'
import cart from '@/components/cart'
import address from '@/components/address'
import order from '@/components/order'
import orderInfo from '@/components/orderInfo'
import pay from '@/components/pay'
import userOrder from '@/components/userOrder'
import admin from '@/components/admin'
import goodsList from '@/components/goodsList'
import adminOrder from '@/components/adminOrder'
Vue.use(Router)

export default new Router({
  routes: [
    {
    	path: '/',
    	name: 'goodlist',
    	component: goodlist
    },
    {
		path:'/cart',
		name:'cart',
		component: cart
    },
    {
      path:'/address',
      name:'address',
      component:address
    },
    {
      path:'/order',
      name:'order',
      component:order
    },
    {
      path:'/orderInfo',
      name:'orderInfo',
      component:orderInfo
    },
    {
      path:'/pay',
      name:'pay',
      component:pay
    },
    {
      path:'/userOrder',
      name:'userOrder',
      component:userOrder
    },
    {
      path:'/admin',
      name:'admin',
      component:admin,
      children:[
      {
        path:'/',
        component:goodsList,
        name:'goodsList',
      },
      {
        path:'order',
        component:adminOrder,
        name:'adminOrder',
      }]
    }
  ]
})
