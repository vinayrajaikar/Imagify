import { clerkClient, WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';

import { createUser, deleteUser, updateUser } from '@/lib/actions/user.action';

export async function POST(req: Request) {
  console.log("Hello")
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  console.log("Hello");
  if (!WEBHOOK_SECRET) {
    throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local");
  }

  // Get the headers
  const headerPayload = await headers();
  console.log("...hello3")
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');
  console.log("...hello3")

  // Error handling for missing headers
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.log("...hello3")
    return new Response("Error: Missing Svix headers", { status: 400 });
  }
  console.log("...hello3")
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  console.log("...hello3")
  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }

  console.log("Received webhook event:", evt);

  const { id } = evt.data;
  const eventType = evt.type;

  // CREATE
  if (eventType === 'user.created') {
    const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username!,
      firstName: first_name || "",
      lastName: last_name || "",
      photo: image_url,
    };

    const newUser = await createUser(user);

    const client=await clerkClient();

    if (newUser) {
      await client.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }

    return NextResponse.json({ message: "OK", user: newUser });
  }

  // UPDATE
  if (eventType === 'user.updated') {
    console.log("Hello");
    const { id, image_url, first_name, last_name, username } = evt.data;

    const user = {
      firstName: first_name || "",
      lastName: last_name || "",
      username: username!,
      photo: image_url,
    };

    const updatedUser = await updateUser(id, user);

    return NextResponse.json({ message: "OK", user: updatedUser });
  }

  // DELETE
  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    const deletedUser = await deleteUser(id!);

    return NextResponse.json({ message: "OK", user: deletedUser });
  }

  console.log(`Webhook with ID: ${id} and type: ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("Error processing event", { status: 500 });

}

// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   return NextResponse.json({ name: "Vinay" });
// }

