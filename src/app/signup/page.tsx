import { SignUpForm } from '@/components/auth/signup-form';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 antialiased">
      <Card className="w-full max-w-xs rounded-2xl border-none shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <h1 className="text-3xl font-bold font-headline text-foreground">Create an Account</h1>
          <p className="text-muted-foreground">Enter your details to get started.</p>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
           <p className="text-muted-foreground">Already have an account?&nbsp;</p>
            <Link href="/" className="font-semibold text-accent underline-offset-4 hover:underline">
              Login
            </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
