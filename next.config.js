/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "https://lh3.googleusercontent.com",
      "lh3.googleusercontent.com",
      "notespacehub.s3.amazonaws.com",
    ], //make it 'your-domain.com'
  },
};

module.exports = nextConfig;
