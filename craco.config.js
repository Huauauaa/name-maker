const CracoLessPlugin = require('craco-less');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin();
const interpolateHtml = require('craco-interpolate-html-plugin');

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
    {
      plugin: gitRevisionPlugin,
    },
    {
      plugin: interpolateHtml,
      options: {
        title: 'Name Validation',
        version: gitRevisionPlugin.version(),
        branch: gitRevisionPlugin.branch(),
        commitHash: gitRevisionPlugin.commithash(),
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
