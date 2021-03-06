/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'




Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } }
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } },
    { path: '/theme', component: _import('common/theme'), name: 'theme', meta: { title: '主题' } },
    { path: '/demo-echarts', component: _import('demo/echarts'), name: 'demo-echarts', meta: { title: 'demo-echarts', isTab: true } },
    { path: '/work-detail', component: _import('modules/detail/workorder-detail'), name: 'work-detail', meta: { title: '工单详情', isTab: true } },
    { path: '/knowledge-detail', component: _import('modules/detail/knowledge-detail'), name: 'knowledge-detail', meta: { title: '维修知识库详情', isTab: true } },
    { path: '/productbatch-detail', component: _import('modules/detail/productbatch-detail'), name: 'productbatch-detail', meta: { title: '产品批次详情', isTab: true } },
    { path: '/slip-detail', component: _import('modules/detail/slip-detail'), name: 'slip-detail', meta: { title: '回访单详情', isTab: true } },
    { path: '/demo-ueditor', component: _import('demo/ueditor'), name: 'demo-ueditor', meta: { title: 'demo-ueditor', isTab: true } }
  ],
  beforeEnter(to, from, next) {
    let token = Vue.cookie.get('token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({ name: 'login' })
    }
    next()
  }
}
// 主入口路由结束
const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
    // 手动改静态菜单
   
    // const data = {
    //   'msg': 'success',
    //   'menuList': [
    //     {
    //       'id': 1, 'parentId': 0, 'parentName': null, 'name': '售后管理', 'url': null, 'perms': null, 'type': 0, 'icon': 'system', 'orderNum': 0, 'open': null,
    //       'childList': [
    //         { 'id': 27, 'parentId': 1, 'parentName': null, 'name': '工单', 'url': 'sales/work-order', 'perms': 'sys:config:list,sys:config:info,sys:config:save,sys:config:update,sys:config:delete', 'type': 1, 'icon': 'config', 'orderNum': 0, 'open': null, 
    //           'list':null},
    //         { 'id': 1, 'parentId': 1, 'parentName': null, 'name': '回访单', 'url': 'sales/return-slip', 'perms': null, 'type': 1, 'icon': 'admin', 'orderNum': 1, 'open': null, 'list': null }, 
    //         { 'id': 2, 'parentId': 1, 'parentName': null, 'name': '客户信息', 'url': 'sales/customer', 'perms': null, 'type': 1, 'icon': 'admin', 'orderNum': 2, 'open': null, 'list': null }, 
    //         { 'id': 3, 'parentId': 1, 'parentName': null, 'name': '维修知识库', 'url': 'sales/knowledge', 'perms': null, 'type': 1, 'icon': 'admin', 'orderNum': 3, 'open': null, 'list': null }, 

    //         { 'menuId': 4, 'parentId': 1, 'parentName': null, 'name': '维修单', 'url': 'sales/maintenance-slip', 'perms': null, 'type': 1, 'icon': 'menu', 'orderNum': 3, 'open': null, 'list': null }, 
    //         // { 'menuId': 5, 'parentId': 1, 'parentName': null, 'name': 'SQL监控', 'url': 'http://localhost:8080/renren-fast/druid/sql.html', 'perms': null, 'type': 1, 'icon': 'sql', 'orderNum': 4, 'open': null, 'list': null }, 
    //         // { 'menuId': 6, 'parentId': 1, 'parentName': null, 'name': '定时任务', 'url': 'job/schedule', 'perms': null, 'type': 1, 'icon': 'job', 'orderNum': 5, 'open': null, 'list': null }, 
    //         // { 'menuId': 30, 'parentId': 1, 'parentName': null, 'name': '文件上传', 'url': 'oss/oss', 'perms': 'sys:oss:all', 'type': 1, 'icon': 'oss', 'orderNum': 6, 'open': null, 'list': null }, 
    //         // { 'menuId': 29, 'parentId': 1, 'parentName': null, 'name': '系统日志', 'url': 'sales/log', 'perms': 'sys:log:list', 'type': 1, 'icon': 'log', 'orderNum': 7, 'open': null, 'list': null }
    //       ]
    //     },
    //     { 'id': 31, 'parentId': 0, 'parentName': null, 'name': '产品管理', 'url': 'www.163.com', 'perms': 'test', 'type': 1, 'icon': 'role', 'orderNum': 0, 'open': null, 
    //     'childList': [
    //       { 'id': 6, 'parentId': 0, 'parentName': null, 'name': '产品列表', 'url': 'sales/productlist', 'perms': null, 'type': 1, 'icon': 'admin', 'orderNum': 3, 'open': null, 'list': null },
    //       { 'id': 7, 'parentId': 0, 'parentName': null, 'name': '产品批次', 'url': 'sales/productBatch', 'perms': null, 'type': 1, 'icon': 'admin', 'orderNum': 3, 'open': null, 'list': null },
    //       { 'id': 21, 'parentId': 0, 'parentName': null, 'name': '产品类型', 'url': 'sales/productType', 'perms': null, 'type': 1, 'icon': 'admin', 'orderNum': 3, 'open': null, 'list': null },
    //       { 'id': 61, 'parentId': 0, 'parentName': null, 'name': '发货记录', 'url': 'sales/delivery', 'perms': null, 'type': 1, 'icon': 'admin', 'orderNum': 3, 'open': null, 'list': null },
    //     ] }, 
    //     { 'id': 32, 'parentId': 0, 'parentName': null, 'name': '帐号管理', 'url': 'www.163.com', 'perms': 'test', 'type': 1, 'icon': 'role', 'orderNum': 0, 'open': null, 
    //     'childList': [
    //       { 'id': 333, 'parentId': 0, 'parentName': null, 'name': '帐号列表', 'url': 'sales/user', 'perms': null, 'type': 1, 'icon': 'admin', 'orderNum': 3, 'open': null, 'list': null },
    //       { 'id': 4, 'parentId': 0, 'parentName': null, 'name': '角色管理', 'url': 'sales/role', 'perms': null, 'type': 1, 'icon': 'role', 'orderNum': 2, 'open': null, 'list': null }, 
    //     ] },
    //     { 'id': 35, 'parentId': 0, 'parentName': null, 'name': '系统管理', 'url': 'www.163.com', 'perms': 'test', 'type': 1, 'icon': 'role', 'orderNum': 0, 'open': null,
    //      'childList': [
    //       { 'id': 8, 'par entId': 1, 'parentName': null, 'name': '菜单管理', 'url': 'sales/menu', 'perms': null, 'type': 1, 'icon': 'admin', 'orderNum': 1, 'open': null, 'list': null }, 
    //       { 'id': 9, 'parentId': 1, 'parentName': null, 'name': '登陆日志', 'url': 'sales/log', 'perms': null, 'type': 1, 'icon': 'admin', 'orderNum': 1, 'open': null, 'list': null }, 
    //       { 'id': 19, 'parentId': 1, 'parentName': null, 'name': '操作日志', 'url': 'sales/operation-log', 'perms': null, 'type': 1, 'icon': 'admin', 'orderNum': 1, 'open': null, 'list': null }, 
    //      ] }, 
    //   ], 
    //     'code': 0, 'resList': ['sys:schedule:info', 'sys:menu:update', 'sys:menu:delete','sys:menu:detail','sys:menu:revist', 'sys:config:info', 'sys:menu:list', 'sys:config:save',
    //      'sys:config:update', 'sys:schedule:resume', 'sys:user:delete', 'sys:config:list', 'sys:user:update', 'sys:role:list', 'sys:menu:info',
    //       'sys:menu:select', 'sys:schedule:update', 'sys:schedule:save', 'sys:role:select', 'sys:user:list', 'sys:menu:save', 'sys:role:save', 
    //       'test', 'sys:schedule:log', 'sys:role:info', 'sys:schedule:delete', 'sys:role:update', 'sys:schedule:list', 'sys:user:info',
    //        'sys:schedule:run', 'sys:config:delete', 'sys:role:delete', 'sys:user:save', 'sys:schedule:pause', 'sys:log:list',
    //         'sys:oss:all']
    // }
    // fnAddDynamicMenuRoutes(data.menuList)
    // router.options.isAddDynamicMenuRoutes = true
    // sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
    // sessionStorage.setItem('permissions', JSON.stringify(data.resList || '[]'))
    // console.log(data)  // 动态一级菜单
    // next({ ...to, replace: true })

 
    http
    .post(
       "https://sale.zeepson.com/api/postsale/user.queryUserAndResource",
      {
        sid:window.sessionStorage.getItem('sid'),
        userId:window.sessionStorage.getItem('userId')
      
      },
      {
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      }
    ).then(({data}) => {
      console.log(data);
      if (data && data.isSuccess == 'true') {
        console.log(data.data.menuList);
        fnAddDynamicMenuRoutes(data.data.menuList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('menuList', JSON.stringify(data.data.menuList || '[]'))
        sessionStorage.setItem('permissions', JSON.stringify(data.data.resList || '[]'))
        console.log(data)  // 动态一级菜单
        next({ ...to, replace: true })
      } else {
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        next()
        router.push({ name: 'login' })
      }
    }).catch((e) => {
      console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
      router.push({ name: 'login' })
      // router.push({ name: 'home' })
    })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType(route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes(menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].childList && menuList[i].childList.length >= 1) {
      temp = temp.concat(menuList[i].childList)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].id,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: '',
          operation: menuList[i].operation
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].id}`
        route['name'] = `i-${menuList[i].id}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) { }
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' } }
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    console.log('\n')
    console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    console.log(mainRoutes.children)
    console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
  }
}

export default router
