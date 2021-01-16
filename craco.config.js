const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
    devServerConfig.proxy = {
      '/api': {
        target: 'https://node-demo-harvey.herokuapp.com/',
        changeOrigin: true,
        ws: false,
        pathRewrite: {
          '^/api': '/api',
        },
        secure: false,
      },
    };
    return devServerConfig;
  },
};
