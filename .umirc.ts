import { defineConfig } from '@umijs/max';
const path = require('path');
export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '凌川默网',
  },
  routes: [
    {
      path: '/',
      redirect: '/main',
    },
    {
      name: '主页',
      path: '/main',
      component: './NavTabsPage',
    },
    {
      name: '详情',
      path: '/vod/detail/:id',
      component: './VideoPage/VodDetailPage/VodDetail',
    },
    {
      name: '更多',
      path: '/vod/more',
      component: './VideoPage/VodMorePage/VodMore',
    }
  ],
  npmClient: 'yarn',
  alias: {
    '@': path.resolve(__dirname, '../src'),
  },
  proxy: {
    '/discover': {
      'target': 'https://music.163.com',
      'changeOrigin': true,
    },
    '/weapi': {
      'target': 'https://music.163.com',
      'changeOrigin': true,
    },
    '/api': {
      'target': 'https://music.163.com',
      'changeOrigin': true,
    },
    '/eapi': {
      'target': 'https://interface3.music.163.com',
      'changeOrigin': true,
    },
  },
});
