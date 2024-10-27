'use strict'

/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  basePath: process.env.BASEPATH,
  
  // TODO: below line is added to resolve twice event dispatch in the calendar reducer
  reactStrictMode: false,

  webpack: (config) => {
    // Set up the alias for js-cookie
    config.resolve.alias['js-cookie'] = path.resolve(__dirname, 'node_modules/js-cookie/dist/js.cookie.js');
    return config;
  },
};

module.exports = nextConfig;
