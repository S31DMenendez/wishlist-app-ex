
import { json } from "@remix-run/node";
import db from "../db.server";


export async function loader() {
    return json({
        ok:true,
        message:"Hello from API"
    })
}

export async function action({request}){
    /*const method=request.method;

    switch(method){
        case "POST":
            return json({message:"Success", method:"POST"});
        case "PATCH":
            return json({message:"Success", method:"POST"});
    }*/
   const method=request.method;
     let data=await request.formData();
     data=Object.fromEntries(data);
     const customerId=data.customerId;
     const productId=data.productId;
     const shop=data.shop;
     const _action=data._action
   
     if(!customerId || !productId || !shop || !_action){
       return json({
         message: "Missing data. Required data: customerId, productId, shop",
         method: _action
       });
     }
   
     let resonse;

     switch(_action){
       case "CREATE":
        const wishlist = await db.wishlist.create({
            data: {
              customerId,
              productId,
              shop,
            },
          });
    
<<<<<<< HEAD
          const response = json({ message: "Product added to wishlist", method: "POST", wishlisted: true });
=======
           response = json({ message: "Product added to wishlist", method: "POST", wishlisted: true });
>>>>>>> b692de7 (pubsub and scopes update)
          return  response;
       case "PATCH":
           return json({message:"Success", method:"POST"});
        

        case "DELETE":
          await db.wishlist.deleteMany({
            where:{
              customerId:customerId,
              shop:shop,
              productId:productId,
            }
          })
<<<<<<< HEAD
          response=json({message:"Product removed from you wishlist", method:_action, wishlisted:false});
=======
          let response2=json({message:"Product removed from you wishlist", method:_action, wishlisted:false});
>>>>>>> b692de7 (pubsub and scopes update)
          return new Response("Method not Allowed",{status:405});
       }
}
 