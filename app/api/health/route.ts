import { connectDB, dbConnectionHelpMessage, isDbConnectionError } from '@/lib/db/connect';
import { Organization } from '@/models';

export async function GET() {
  try {
    await connectDB();
    const organizations = await Organization.countDocuments();
    return Response.json({ ok: true, organizations });
  } catch (err) {
    const message = isDbConnectionError(err) ? dbConnectionHelpMessage() : (err as Error).message;
    return Response.json({ ok: false, error: message }, { status: 503 });
  }
}
