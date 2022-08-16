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
  ],
  npmClient: 'yarn',
  alias: {
    '@': path.resolve(__dirname, '../src'),
  }
});
