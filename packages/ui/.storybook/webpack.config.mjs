/**
 * Custom webpack configuration for Storybook to handle React 19 compatibility
 */
import path from 'path';
import webpack from 'webpack';

// Export as ES module
export default ({ config }) => {
  // Add React 19 compatibility
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve?.alias,
      // Force Storybook to use the same React instance
      'react': path.resolve('node_modules/react'),
      'react-dom': path.resolve('node_modules/react-dom'),
    },
  };

  // Add fallbacks for node polyfills
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'stream': false,
    'crypto': false,
    'buffer': false,
    'util': false,
    'process': false,
  };

  // Remove plugins for polyfills as they're causing issues
  // with React 19 compatibility

  return config;
};