/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["gataway.pinata.cloud"],
    formats: ["image/webp"],
  },
};

export default nextConfig;
