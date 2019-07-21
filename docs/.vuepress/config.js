module.exports = {
  themeConfig: {
    sidebarDepth: 0,
    displayAllHeaders: true,
    sidebar: [
      {
        title: "Introduction",
        collapsable: false,
        children: ["/"]
      },
      {
        title: "Smart Contract Developers",
        collapsable: false,
        children: ["/developer-overview"]
      },
      {
        title: "Token Holders",
        collapsable: false,
        children: ["test1/x", "test1/y"]
      }
    ]
  }
};
