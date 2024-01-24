export default () => ({
  port: parseInt(process.env.GATEWAY_APP_PORT, 10),
  auth: {
    host: process.env.AUTH_APP_PORT,
    port: parseInt(process.env.AUTH_APP_PORT, 10),
  },
  products: {
    host: process.env.PRODUCTS_APP_PORT,
    port: parseInt(process.env.PRODUCTS_APP_PORT, 10),
  },
  uploadimage: {
    host: process.env.IMAGE_APP_PORT,
    port: parseInt(process.env.IMAGE_APP_PORT, 10),
  },
});
