import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //一级路由
    {
      path: '/login',
      component: () => import('@/views/login/loginpage.vue'),
    }, //登录页面
    //二级路由
    {
      path: '/',
      component: () => import('@/views/layout/layoutContainer.vue'),
      redirect: '/video/push',
      children: [
        //用户的所有操作
        {
          //删除用户
          path: '/user/delete',
          component: () => import('@/views/user/deleteuser.vue'),
        },
        {
          //上传我的视频
          path: '/create_centre/upmyvideo',
          component: () => import('@/views/user/myvideo/upmyvideo.vue'),
        },
        {
          //删除我的视频
          path: '/create_centre/deletemyvideo',
          component: () => import('@/views/user/myvideo/deletemyvideo.vue'),
        },
        {
          //管理我的收藏夹
          path: '/user/favor_file',
          component: () => import('@/views/user/favourite_file/edit.vue'),
        },
        {
          //我的关注
          path: '/focus/attention',
          component: () => import('@/views/user/relation/list.vue'),
        },
        {
          //我的粉丝
          path: '/focus/fans_list',
          component: () => import('@/views/user/relation/fans_list.vue'),
        },
        {
          //互关列表
          path: '/focus/eachother',
          component: () => import('@/views/user/relation/focus_each.vue'),
        },
        //视频的操作
        {
          //推荐的所有视频
          path: '/video/push',
          component: () => import('@/views/video/videocard.vue'),
        },
        //搜索视频
        {
          path: '/video/search',
          component: () => import('@/views/video/search_video.vue'),
        },
      ],
    },
  ],
})
/*
router.beforeEach(to => {
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') return '/login'
})
*/
export default router
