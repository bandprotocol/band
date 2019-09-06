module.exports = {
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/assets/favicon.ico"
      }
    ]
  ],
  themeConfig: {
    sidebarDepth: 0,
    locales: {
      "/": {
        selectText: "Language",
        logo: "/assets/logo.png",
        nav: [{ text: "Home", link: "https://bandprotocol.com" }],
        displayAllHeaders: true,
        sidebar: [
          {
            title: "🏡 Introduction",
            collapsable: false,
            children: [
              "/",
              "home/comparison"
              // "home/problem",
              // "home/development-status"
            ]
          },
          // {
          //   title: "⛩ Protocol Architecture",
          //   collapsable: false,
          //   children: [
          //     // "band/overview.md",
          //     "band/tokens.md",
          //     "band/governance.md",
          //     "band/tcd.md",
          //     "band/tcr.md"
          //   ]
          // },
          {
            title: "🚀 DApp Developer Guide",
            collapsable: false,
            children: [
              "devs/overview",
              "devs/connect-with-band",
              "devs/data-query",
              "devs/reference",
              "devs/walkthrough"
            ]
          },
          // {
          //   title: "💸 Token Holder Guide",
          //   collapsable: false,
          //   children: ["holders/overview", "holders/ecosystem", "holders/get-band"]
          // },
          {
            title: "📡 Data Provider Guide",
            collapsable: false,
            children: [
              "providers/overview",
              "providers/architecture",
              "providers/getting-started",
              "providers/custom-driver"
            ]
          },
          {
            title: "📦 Available Datasets",
            collapsable: false,
            children: [
              "datasets/overview",
              "datasets/financial-kovan",
              "datasets/sport-kovan",
              "datasets/lottery-kovan",
              "datasets/web-oracle"
            ]
          }
          // {
          //   title: "🦄 Example Applications",
          //   collapsable: false,
          //   children: []
          // }
          // {
          //   title: "📖 Smart Contract Reference",
          //   collapsable: false,
          //   children: []
          // }
        ]
      },

      "/zh/": {
        selectText: "选择语言",
        logo: "/assets/logo.png",
        nav: [
          {
            text: "首页",
            link: "https://bandprotocol.com"
          }
        ],
        displayAllHeaders: false,
        sidebar: [
          {
            title: "🏡 介绍",
            collapsable: false,
            children: ["zh/", "zh/home/comparison"]
          },
          {
            title: "🚀 DApp 开发指南",
            collapsable: false,
            children: [
              "zh/devs/overview",
              "zh/devs/connect-with-band",
              "zh/devs/data-query",
              "zh/devs/reference",
              "zh/devs/walkthrough"
            ]
          },
          {
            title: "📦 可用的数据集",
            collapsable: false,
            children: [
              "zh/datasets/overview",
              "zh/datasets/financial-kovan",
              "zh/datasets/sport-kovan",
              "zh/datasets/lottery-kovan",
              "zh/datasets/web-oracle"
            ]
          }
        ]
      }
    }
  },
  locales: {
    "/": {
      lang: "English"
    },
    "/zh/": {
      lang: "简体中文"
    }
  }
};
