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
      redirect: '/videos',
      children: [
        {
          path: '/videos',
          name: 'VideoFeed',
          component: () => import('@/views/video/videocard.vue'),
        },
        {
          path: '/video/player/:id',
          name: 'VideoPlayer',
          component: () => import('@/views/video/VideoPlayer.vue'),
        },
        {
          path: '/video/search',
          name: 'SearchVideo',
          component: () => import('@/views/video/search_video.vue'),
        },
        {
          //删除用户
          path: '/user/delete',
          component: () => import('@/views/user/UserDelete.vue'),
        },
        {
          //上传我的视频
          path: '/create_centre/upmyvideo',
          component: () => import('@/views/user/myvideo/MyVideoUpload.vue'),
        },
        {
          //删除我的视频
          path: '/create_centre/deletemyvideo',
          component: () => import('@/views/user/myvideo/MyVideoDelete.vue'),
        },
        {
          path: '/user/profile/:id',
          name: 'UserProfile',
          component: () => import('@/views/user/UserProfile.vue'),
        },
        {
          //管理我的收藏夹
          path: '/user/favor_file',
          component: () =>
            import('@/views/user/favourite_file/FavouriteFileEdit.vue'),
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
      ],
    },
  ],
})

router.beforeEach(to => {
  // 暂时禁用认证检查，确保页面能正常显示
  console.log('路由跳转到:', to.path)
  return true
})

export default router
