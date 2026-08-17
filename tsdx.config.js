// tsdx.config.js
const { terser } = require('rollup-plugin-terser');

module.exports = {
  // This function will be used to customize rollup config
  rollup(config, options) {
    // Find the existing terser plugin instance, if any
    const terserPluginIndex = config.plugins.findIndex(
      (p) => p && p.name === 'terser'
    );

    // Define the desired terser options
    const terserOptions = {
      ecma: 2020, // <--- Crucial: Tell Terser to support ES2020 syntax
      // Add other Terser options if needed:
      // compress: { ... },
      // mangle: { ... },
      // format: { comments: false }, // Example: remove comments
      // sourceMap: true, // If you want source maps from Terser
    };

    if (terserPluginIndex !== -1) {
      // If terser plugin exists, replace it with a new instance with updated options
      console.log('Replacing existing Terser plugin with custom options.');
      config.plugins.splice(terserPluginIndex, 1, terser(terserOptions));
    } else if (options.env === 'production') {
      // If it doesn't exist and we are in a production build, add it.
      // TSDX usually adds terser for production builds only.
      console.log(
        'Adding Terser plugin with custom options for production build.'
      );
      config.plugins.push(terser(terserOptions));
    }

    // IMPORTANT: return the modified config
    return config;
  },
};
