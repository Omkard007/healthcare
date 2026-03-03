import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error('Missing WEBHOOK_SECRET')
    }

    // Read headers FIRST before body
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('No svix headers', { status: 400 })
    }

    // THEN read body
    const body = await req.text()

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Webhook verification failed:', err);
        return new Response('Invalid signature', { status: 400 })
    }

    console.log("EVENT TYPE:", evt.type);

    if (evt.type === 'user.created') {
        const { id, email_addresses, first_name, last_name } = evt.data;
        const email = email_addresses?.[0]?.email_address;

        if (!email) return new Response('No email', { status: 400 })

        const name = [first_name, last_name].filter(Boolean).join(" ") || null;

        try {
            await prisma.user.create({
                data: { clerkId: id, email, name }
            });
            console.log("USER SAVED TO DB:", email);
        } catch (error) {
            console.error("DB ERROR:", error);
            return new Response("Database error", { status: 500 });
        }
    }

    return new Response('OK', { status: 200 })
}