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
<<<<<<< HEAD
    await shopify.webhooks.register(shop);
  });
=======
  console.log("app/installed webhook")
  await shopify.webhooks.register(shop);
});

shopifyApp.on("app/scopes_update", async ({ shop }) => {
  console.log("app/scopes_updated webhook")
  await shopify.webhooks.register(shop);
});



listenForMessages();
//console.log("Pub/Sub listener is running...");
>>>>>>> b692de7 (pubsub and scopes update)
