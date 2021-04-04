import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken: string | undefined;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string | undefined;
  }
}
