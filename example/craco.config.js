const {CracoAliasPlugin} = require('react-app-alias-ex');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const redirectServedPathMiddleware = require('react-dev-utils/redirectServedPathMiddleware');

module.exports = {
    plugins: [
        {
            plugin: CracoAliasPlugin,
            options: {},
        },
    ],
    eslint: {
        enable: true,
    },

    // Translate react-scripts' server options to the webpack-dev-server 5 API.
    devServer: (config, {paths}) => {
        const {
            https, onBeforeSetupMiddleware, onAfterSetupMiddleware, ...options
        } = config;
        return {
            ...options,
            server: https ? {type: 'https', options: https === true ? {} : https} : 'http',

            // react-scripts calls close() when it receives SIGINT or SIGTERM.
            onListening: (devServer) => {
                Object.defineProperty(devServer, 'close', {value: devServer.stop.bind(devServer)});
            },
            setupMiddlewares: (middlewares, devServer) => {
                onBeforeSetupMiddleware(devServer);
                middlewares.push(
                    redirectServedPathMiddleware(paths.publicUrlOrPath),
                    noopServiceWorkerMiddleware(paths.publicUrlOrPath),
                );
                return middlewares;
            },
        };
    },
};
