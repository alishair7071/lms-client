import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Allow images served from Cloudinary (used for avatars)
    domains: ["res.cloudinary.com", "randomuser.me"],
    // Alternatively you could use `remotePatterns` for more control:
    // remotePatterns: [
    //   { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' }
    // ]
  },
};

export default nextConfig;
