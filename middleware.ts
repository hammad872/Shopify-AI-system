import { withAuth } from 'next-auth/middleware';

// Protects every route under the matcher. Admin role check happens in the
// admin layout (middleware can't read the DB; it only sees the JWT claims).
export default withAuth({
  pages: { signIn: '/login' },
});

export const config = {
  matcher: ['/dashboard/:path*', '/chat/:path*', '/stores/:path*', '/billing/:path*', '/audit/:path*', '/admin/:path*'],
};
