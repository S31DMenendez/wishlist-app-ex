import { authenticate } from "../shopify.server";
import db from "../db.server";
<<<<<<< HEAD

export const action = async ({ request }) => {
  const { payload, session, topic, shop } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);
  const current = payload.current;

  if (session) {
    await db.session.update({
      where: {
        id: session.id,
      },
      data: {
        scope: current.toString(),
      },
    });
  }

  return new Response();
=======
import { json } from "@remix-run/node";

export async function loader() {
   console.log("scope update")
   //GET

}

export const action = async ({ request }) => {
  //const { topic, shop } = await authenticate.webhook(request);
  //const url = new URL(request.url);
  //const topic = url.searchParams.get("topic");
  //const shop = url.searchParams.get("shop");
  //console.log(`Received ${topic} webhook for ${shop}`);
  try {
    const body = await request.json(); // Pub/Sub envía los mensajes en JSON
    console.log("Mensaje recibido:", body);

    // Procesa la data recibida
    const messageData = JSON.parse(
      Buffer.from(body.message.data, "base64").toString("utf-8")
    );

    console.log("Datos del mensaje:", messageData);

    // Aquí puedes manipular la data según tus necesidades

    return json({ success: true });
  } catch (error) {
    console.error("Error procesando el mensaje:", error);
    return json({ success: false }, { status: 500 });
  }


  //return new Response("OK",{status:200});
>>>>>>> b692de7 (pubsub and scopes update)
};
