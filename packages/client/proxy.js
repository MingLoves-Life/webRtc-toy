const proxy = {
  "/api": {
    target: "https://web-rtc-toy-server.vercel.app",
    changeOrigin: true,
     configure: (proxy, options) => {
      proxy.on('proxyReq', function (proxyReq) {
        proxyReq.setHeader('isProxy', 'true');
      });
      proxy.on('proxyRes', function (proxyRes) {
        proxyRes.headers.isProxy = 'true';
      });

    },    
  },
};

export { proxy };
