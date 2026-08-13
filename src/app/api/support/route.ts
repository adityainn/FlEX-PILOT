import { NextResponse } from "next/server";
import { Resend } from "resend";

// Using the Resend API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Since this is a Resend sandbox account, the "from" address must be onboarding@resend.dev
    // and the "to" address must be the verified email on the Resend account (the user's email).
    const data = await resend.emails.send({
      from: "Flex Pilot Support <onboarding@resend.dev>",
      to: ["adityakumar726a@gmail.com"], // Sending to the user's email
      replyTo: email, // If they hit reply, it replies to the person who filled the form
      subject: `[Support] ${subject}`,
      html: `
        <h2>New Support Request from Flex Pilot</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    });

    if (data.error) {
      console.error("Resend API Error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error sending support email:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
