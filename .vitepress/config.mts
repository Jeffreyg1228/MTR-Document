import { defineConfig } from "vitepress";
import AutoNav from "vite-plugin-vitepress-auto-nav";
import mdFootnote from "markdown-it-footnote";

export default defineConfig({
  title: "Jeffreyg1228 的 MTR 文档站",
  description: "一些 MTR 模组相关的文档，旨在帮助 MTR 圈更好发展。",
  head: [
    [
      'script',
      { type: 'text/javascript' },
      `(function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "n550rw0n3g");`
    ]
  ],
  lang: "zh-cmn-Hans",
  cleanUrls: true,
  lastUpdated: true,
  // 忽略解析部分md文件（默认忽略node_modules），仅打包后生效，被忽略的文件不影响被其他文件导入
  srcExclude: [
    "**/(README).md",
    "(.vitepress|public|images|.github|components|snippets)/**/*.md",
  ],
  vite: {
    plugins: [
      AutoNav({
        itemsSetting: {
          'lcd': { sort: 0, title: "LCD 使用文档" },

          'lcd/player-guide': { sort: 1, title: "玩家相关" },
          'lcd/player-guide/basic-features.md': { sort: 0 },
          'lcd/player-guide/config-file.md': { sort: 1 },
          'lcd/player-guide/performance-tuning.md': { sort: 2 },
          'lcd/creator-guide/troubleshooting.md': { sort: 3 },

          'lcd/creator-guide': { sort: 2, title: "资源包作者相关" },
          'lcd/creator-guide/adapt-to-blockbench-train.md': { sort: 0 },
          'lcd/creator-guide/adapt-to-mtr-train.md': { sort: 1 },
          'lcd/creator-guide/adapt-to-obj-train.md': { sort: 2 },
          'lcd/creator-guide/feedback.md': { sort: 3 },
          
          'tips': { sort: 1, title: "MTR 实用技巧" },
        },
        useArticleTitle: true
      }),
    ],
  },
  markdown: {
    config: (md) => {
      md.use(mdFootnote)
    },
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    }
  },
  themeConfig: {
    outline: "deep",
    outlineTitle: "目录",
    socialLinks: [
      { icon: "github", link: "https://github.com/Jeffreyg1228/MTR-Document" },
    ],
    editLink: {
      pattern: 'https://github.com/Jeffreyg1228/MTR-Document/edit/main/:path',
      text: '在 GitHub 上编辑本页'
    },
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    footer: {
      message: '如无特别说明，本站内容均按 <a href="https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans" target="_blank">CC0 1.0 Universal</a> 协议许可。',
      copyright: 'Copyright © 2023-present <a href="https://github.com/Jeffreyg1228" target="_blank">Jeffreyg1228</a>.'
    },
    notFound: {
      quote: 'Twenty years from now you will be more disappointed by the things that you didn\'t do than by the ones you did do. So throw off the bowlines. Sail away from the safe harbor. Catch the trade winds in your sails. Explore. Dream. Discover.',
    },
    darkModeSwitchTitle: "切换至暗色主题",
    lightModeSwitchTitle: "切换至亮色主题",
    darkModeSwitchLabel: "切换主题",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "回到顶部",
    langMenuLabel: '语言 / Language',
    lastUpdatedText: "更新时间",
    externalLinkIcon: true,
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
          },
          modal: {
            displayDetails: "显示详情",
            noResultsText: "未找到相关结果",
            resetButtonTitle: "清除",
            footer: {
              closeText: "关闭",
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
  },
  transformPageData(pageData) {
    if (pageData.relativePath === 'index.md' && pageData.frontmatter.features) {
      const nav = this.site.themeConfig.nav;

      pageData.frontmatter.features = pageData.frontmatter.features.map(feature => {
        const navItem = nav.find(item => item.text === feature.title);
        if (navItem && navItem.link) {
          return { ...feature, link: navItem.link };
        }
        return feature;
      });
    }
  },
});