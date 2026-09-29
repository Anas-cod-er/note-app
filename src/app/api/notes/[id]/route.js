import { connectDB } from "@/app/lib/db";
import { Note } from "@/app/lib/models/note";

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = await params;
  await Note.findByIdAndDelete(id);
  return Response.json({ success: true });
}