/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
      layers: true,
    };
    config.module.rules.push({
      test: /\.mdx/,
      use: [
        // {loader: 'babel-loader', options: {}},
        {
          loader: "@mdx-js/loader",
          options: {},
        },
      ],
    });
    return config;
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

module.exports = nextConfig;
