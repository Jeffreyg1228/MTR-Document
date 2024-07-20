---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: Jeffreyg1228 的 MTR 文档站
  text: 
  tagline: 一些 MTR 模组相关的文档，旨在帮助 MTR 圈更好发展。

features:
  - title: LCD 使用文档
    details: “上海地铁风格动态 LCD 追加”的使用文档。
    linkText: 查阅文档
  - title: MTR 实用技巧
    details: 一些有关 MTR 模组的实用技巧和提示。
    linkText: 阅读最新文章
  - title: ……以及更多！
    details: 学业繁忙，敬请期待。
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>