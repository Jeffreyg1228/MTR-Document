import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Jeffreyg1228 的 MTR 文档站",
  description: "一些 MTR 模组相关的文档，旨在帮助 MTR 圈更好发展。",
  cleanUrls: true,
  lastUpdated: true,

  locales: {
    root: {
      label: '中文 (简体)',
      lang: 'zh',

      themeConfig: {
        outline: {
          label: '目录'
        },
        lastUpdated: {
          text: '最近更新'
        },
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },
        darkModeSwitchLabel: '页面样式',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '返回顶部',
        langMenuLabel: '语言 / Language',
        notFound: {
          title: '',
          quote: '从前有座山，山上有座庙。庙里有个页面，现在找不到。',
          linkLabel: '返回主页',
          linkText: '返回主页'
        },
    
        nav: [
          { text: '主页', link: '/' },
          { text: 'LCD 使用文档', link: '/lcd/' }
        ],
    
        sidebar: {
          '/lcd/': [
            {
              text: '',
              collapsed: false,
              items: [
                { text: '首页', link: '/lcd/' }
              ]
            },
            {
              text: '玩家相关',
              collapsed: false,
              items: [
                { text: '基本功能', link: '/lcd/player-guide/basic-features' },
                { text: '性能调优', link: '/lcd/player-guide/performance-tuning' },
                { text: '疑难解答', link: '/lcd/player-guide/troubleshooting' }
              ]
            },
            {
              text: '资源包作者相关（即将推出）',
              collapsed: false,
              items: [
                { text: '', link: '/lcd/' }
              ]
            }
          ]
        },
    
        editLink: {
          pattern: 'https://github.com/Jeffreyg1228/MTR-Document/edit/main/docs/:path',
          text: '在 GitHub 上编辑本页'
        },
    
        footer: {
          message: '如无特别说明，本站内容均按 <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hans" target="_blank">CC Attribution-Share Alike 4.0 International</a> 协议许可。',
          copyright: 'Copyright © 2023-present <a href="https://github.com/Jeffreyg1228" target="_blank">Jeffreyg1228</a>.'
        },
      }
    }
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    outline: [2, 3],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Jeffreyg1228/MTR-Document' }
    ],

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                displayDetails: '显示内容',
                resetButtonTitle: '清除查询条件',
                backButtonTitle: '返回',
                noResultsText: '无法找到相关结果',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    }
  }
})
