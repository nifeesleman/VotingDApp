/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "gataway.pinata.cloud",
        pathname: "/**",
      },
    ],
    formats: ["image/webp"],
  },
};

export default nextConfig;
