import { shopifyApp } from '@shopify/shopify-app-remix';

const shopify = shopifyApp({
  // Configuración general de tu app
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: [ 'write_products'],
});

// Configuración de los webhooks
shopify.webhooks.addHandlers({
  WRITE_PRODUCT: {
    deliveryMethod: 'PUBSUB',
    pubSubProject: 'meta-sanctum-447415-t5', // Reemplaza con tu Project ID
    pubSubTopic: 'projects/meta-sanctum-447415-t5/topics/creditori-topic',               // Reemplaza con el nombre del topic
  }
});

shopifyApp.on("app/installed", async ({ shop }) => {
    await shopify.webhooks.register(shop);
  });
