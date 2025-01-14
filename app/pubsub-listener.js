import { PubSub } from "@google-cloud/pubsub";
import { action } from "./routes/webhooks.app.scopes_update"; 

let pubSubClient;

let pubSubSettings = {
    projectId: 'meta-sanctum-447415-t5', // Your Google Cloud Platform project ID
    topicNameOrId: 'creditori-topic', // Name for the new topic to create
    subscriptionName: 'creditori-topic-sub' // Name for the new subscription to create
}

console.log("Initializing PubSub");
pubSubClient = new PubSub(pubSubSettings.projectId);

const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
const APP_URL = process.env.SHOPIFY_APP_URL;

if (!SHOPIFY_API_SECRET) {
  throw new Error("SHOPIFY_API_SECRET is not set in the environment variables");
}

async function setupPubSub() {
  try {
    const [subscription] = await pubSubClient.topic(pubSubSettings.topicNameOrId).subscription(pubSubSettings.subscriptionName).get({ autoCreate: true });
    console.log(`Subscription ${subscription.name} created.`);
    return subscription;
  } catch (error) {
    console.error("Error setting up Pub/Sub:", error);
    throw error;
  }
}

export async function listenForMessages() {
  const subscription = await setupPubSub();

  subscription.on("message", async (message) => {
    console.log("Full message");

    try {

      const topic = message.attributes['X-Shopify-Topic'];
      const hmacHeader = message.attributes['X-Shopify-Hmac-SHA256'];
      const shop = message.attributes['X-Shopify-Shop-Domain'];
      const apiVersion = message.attributes['X-Shopify-API-Version']
      const webhookId = message.attributes['X-Shopify-Webhook-Id'];
      const triggeredAt = message.attributes['X-Shopify-Triggered-At'];
      const eventId = message.attributes['X-Shopify-Event-Id']
      const body = message.data.toString();

      const mockRequest = new Request(`${APP_URL}/webhooks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Topic": topic,
          "X-Shopify-Shop-Domain": shop,
          "X-Shopify-API-Version": apiVersion,
          "X-Shopify-Hmac-SHA256": hmacHeader,  // Use the HMAC header from the message
          "X-Shopify-Webhook-Id": webhookId,
          "X-Shopify-Triggered-At": triggeredAt,
          "X-Shopify-Event-Id": eventId
        },
        body: message.data,
      });

      const actionArgs = { request: mockRequest };
      const response = await action(actionArgs);

      if (!response?.ok) {
        throw new Error(`Error processing webhook: ${response?.statusText}`);
      }
      console.log("Webhook response:", response);

      console.log("Webhook processed successfully");
      message.ack();

    } catch (error) {
      console.error("Error processing message:", error);
      message.nack();
    }
  });

}