// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function(app) {
//   app.use(
//     '/MapApi',
//     createProxyMiddleware({
//       target: 'http://139.144.63.238',
//       changeOrigin: true,
//     })
//   );
// };

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api1', // The path you want to proxy
    createProxyMiddleware({
      target: 'http://51.159.141.113:8001', // The target server
      changeOrigin: true,
    })
  );
};
