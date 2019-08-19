module.exports = {
  head: [["link", { rel: "icon", href: "/assets/favicon.ico" }]],
  themeConfig: {
    logo: "/assets/logo.svg",
    nav: [{ text: "Home", link: "https://bandprotocol.com" }],
    sidebarDepth: 0,
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
        children: ["providers/overview"]
      },
      {
        title: "📦 Available Datasets",
        collapsable: false,
        children: [
          "datasets/overview",
          "datasets/web-oracle",
          "datasets/financial-kovan",
          "datasets/sport-kovan",
          "datasets/lottery-kovan"
        ]
      },
      {
        title: "🦄 Example Applications",
        collapsable: false,
        children: []
      }
      // {
      //   title: "📖 Smart Contract Reference",
      //   collapsable: false,
      //   children: []
      // }
    ]
  }
};
