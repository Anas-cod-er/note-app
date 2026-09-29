import { connectDB } from "@/app/lib/db";
import { Note } from "@/app/lib/models/note";

export async function GET() {
  await connectDB();
  const notes = await Note.find().sort({ createdAt: -1 });
  return Response.json(notes);
}

export async function POST(req) {
  await connectDB();
  const { title, content } = await req.json();
  const note = await Note.create({ title, content });
  return Response.json(note, { status: 201 });
}