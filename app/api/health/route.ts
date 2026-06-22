import { connectDB } from '@/lib/db/connect';
import { Organization } from '@/models';

export async function GET() {
  await connectDB();
  const organizations = await Organization.countDocuments();
  return Response.json({ ok: true, organizations });
}
