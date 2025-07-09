/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist'],
  
  // API isteklerini backend'e (localhost:4000) yönlendirme ayarı
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: 'http://localhost:4000/api/:path*' // Backend sunucusuna yönlendirme
    }
  ]
};

module.exports = nextConfig;
