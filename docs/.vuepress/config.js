module.exports = {
  head: [["link", { rel: "icon", href: "/assets/favicon.ico" }]],
  themeConfig: {
    logo: "/assets/logo.svg",
    nav: [{ text: "Home", link: "https://bandprotocol.com" }],
    sidebarDepth: 0,
    displayAllHeaders: true,
    sidebar: [
      {
        title: "Introduction",
        collapsable: false,
        children: ["/", "home/problem", "home/development-status"]
      },
      {
        title: "Protocol Architecture",
        collapsable: false,
        children: [
          "band/tokens.md",
          "band/governance.md",
          "band/tcd.md",
          "band/tcr.md"
        ]
      },
      {
        title: "DApp Developer Guide",
        collapsable: false,
        children: [
          "devs/overview",
          "devs/connect-with-band",
          "devs/npm-integration",
          "devs/reference",
          "devs/walkthrough"
        ]
      },
      {
        title: "Token Holder Guide",
        collapsable: false,
        children: ["holders/ecosystem", "holders/get-band"]
      },
      {
        title: "Data Provider Guide",
        collapsable: false,
        children: []
      },
      {
        title: "Available Datasets",
        collapsable: false,
        children: [
          "datasets/web-oracle",
          "datasets/financial-kovan",
          "datasets/sport-kovan",
          "datasets/lottery-kovan"
        ]
      },
      {
        title: "Example Applications",
        collapsable: false,
        children: []
      },
      {
        title: "Smart Contract Reference",
        collapsable: false,
        children: []
      }
    ]
  }
};
