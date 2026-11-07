const isGithubActions = process.env.GITHUB_ACTIONS || false;
const repo = isGithubActions ? '/VERTEX' : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: repo,
  assetPrefix: repo ? `${repo}/` : undefined,
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
