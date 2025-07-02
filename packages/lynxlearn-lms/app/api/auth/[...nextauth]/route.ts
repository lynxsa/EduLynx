import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Use a simple database client instead of Prisma to avoid schema conflicts
const { Client } = require('pg');

const createDBClient = () => {
  return new Client({
    connectionString: process.env.DATABASE_URL,
  });
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          throw new Error('Please enter both email and password');
        }

        const client = createDBClient();

        try {
          console.log('Connecting to database...');
          await client.connect();

          console.log('Attempting to authenticate:', credentials.email);

          const result = await client.query('SELECT * FROM users WHERE email = $1', [
            credentials.email,
          ]);

          if (result.rows.length === 0) {
            console.log('User not found:', credentials.email);
            throw new Error('No user found with this email address');
          }

          const user = result.rows[0];
          console.log('User found:', user.email, 'Role:', user.role);

          if (!user.hashedPassword) {
            console.log('No password found for user:', credentials.email);
            throw new Error('User account is not properly configured');
          }

          console.log('Checking password...');
          const isValid = await bcrypt.compare(credentials.password, user.hashedPassword);

          if (!isValid) {
            console.log('Invalid password for user:', credentials.email);
            throw new Error('Invalid password');
          }

          console.log('Authentication successful for:', credentials.email);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        } finally {
          await client.end();
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('JWT callback - User signed in:', user.email);
        token.role = (user as any).role;
        token.name = (user as any).name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        console.log('Session callback - Creating session for:', token.email);
        session.user = {
          ...session.user,
          id: token.sub as string,
          role: token.role as string,
          name: token.name as string,
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback - URL:', url, 'Base URL:', baseUrl);
      // If it's a relative URL, use it
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // If it's the same domain, use it
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Always redirect to dashboard after successful login
      return `${baseUrl}/dashboard`;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
