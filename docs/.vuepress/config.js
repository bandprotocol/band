module.exports = {
  themeConfig: {
    sidebarDepth: 0,
    displayAllHeaders: true,
    sidebar: [
      {
        title: "Introduction",
        collapsable: false,
        children: ["/", "home/architecture"]
      },
      {
        title: "Smart Contract Developers",
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
        title: "Token Holders",
        collapsable: false,
        children: ["holders/ecosystem", "holders/get-band"]
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
      }
    ]
  }
};
