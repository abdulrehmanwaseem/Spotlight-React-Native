import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-user-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET env");
    }

    // check headers
    const svix_id = req.headers.get("svix-id");
    const svix_signature = req.headers.get("svix-signature");
    const svix_timestamp = req.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("Error occured, no svix headers found", {
        status: 400,
      });
    }

    const payload = req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let event: any;

    // verify webhook
    try {
      event = wh.verify(body, {
        "svix-id": svix_id,
        "svix-signature": svix_signature,
        "svix-timestamp": svix_timestamp,
      }) as any;
    } catch (error) {
      console.log("Error verifying webhook:", error);
      return new Response("Error occured", {
        status: 400,
      });
    }

    const eventType = event.type;

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        event.data;

      const email = email_addresses[0].email_address;
      const fullName = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.users.createUser, {
          email,
          fullName,
          image: image_url,
          clerkId: id,
          username: email.split("@")[0],
        });
      } catch (error) {
        console.log("Error creating user:", error);
        return new Response("Error creating user", {
          status: 500,
        });
      }

      return new Response("Webhook processed successfully", { status: 200 });
    }

    // Default response for unhandled event types
    return new Response("Event type not handled", { status: 200 });
  }),
});
