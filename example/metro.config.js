const path = require('path');
const escape = require('escape-string-regexp');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const _ = require('underscore');
const pak = require('../package.json');

const root = path.resolve(__dirname, '..');

const modules = _.keys({
    ...pak.peerDependencies,
});

module.exports = {
    projectRoot: __dirname,
    watchFolders: [root],

    // We need to make sure that only one version is loaded for peerDependencies
    // So we block them at the root, and alias them to the versions in example's node_modules
    resolver: {
        blacklistRE: exclusionList(
            _.map(modules, m => new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)),
        ),

        extraNodeModules: _.reduce(modules, (acc, name) => {
            acc[name] = path.join(__dirname, 'node_modules', name);
            return acc;
        }, {}),
    },

    transformer: {
        getTransformOptions: () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
};
