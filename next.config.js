const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  ...withVanillaExtract(nextConfig),
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  pageExtensions: ['page.tsx', 'page.ts'],
};
