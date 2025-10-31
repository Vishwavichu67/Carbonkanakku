'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { useState, useEffect } from 'react';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Loader2 } from 'lucide-react';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
import { Skeleton } from '@/components/ui/skeleton';
import { siteConfig } from '@/lib/constants';

const DEFAULT_COMPANY_ID = 'default-company';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    if (!userLoading) {
      if (user) {
        router.push('/dashboard');
      } else {
        setIsCheckingUser(false);
      }
    }
  }, [user, userLoading, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setPasswordError('');

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    if (!displayName.trim()) {
        toast({ variant: 'destructive', title: 'Your Name is required.' });
        setIsLoading(false);
        return;
    }
    if (!auth || !firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firebase is not initialized.' });
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const createdUser = userCredential.user;
      await updateProfile(createdUser, { displayName });

      const userData = {
        uid: createdUser.uid,
        email: createdUser.email,
        displayName,
        companyId: DEFAULT_COMPANY_ID,
      };
      const userRef = doc(firestore, 'users', createdUser.uid);
      await setDoc(userRef, userData).catch((serverError) => {
          const permissionError = new FirestorePermissionError({
              path: userRef.path,
              operation: 'create',
              requestResourceData: userData,
          });
          errorEmitter.emit('permission-error', permissionError);
          throw new Error('Failed to create user profile.');
      });

      toast({ title: 'Registration Successful!', description: 'Redirecting to your dashboard...' });
      router.push('/dashboard');
    } catch (error: any) {
      let errorMessage = error.message || 'An unexpected error occurred.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please log in.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. It should be at least 6 characters.';
      }
      toast({ variant: 'destructive', title: 'Registration Failed', description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow flex items-center justify-center bg-secondary p-4">
        <div className="w-full max-w-md">
            {isCheckingUser ? (
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-48 mx-auto" />
                        <Skeleton className="h-4 w-72 mx-auto" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                 </Card>
            ) : (
                <Card>
                    <CardHeader className="text-center">
                    <div className="mx-auto mb-2 flex flex-col items-center">
                        <Logo />
                        <p className="text-sm text-muted-foreground mt-2">{siteConfig.description}</p>
                    </div>
                    <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
                    <CardDescription>Join to start tracking your company&apos;s ESG metrics.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                            <Label htmlFor="displayName">Your Name</Label>
                            <Input id="displayName" type="text" placeholder="John Doe" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={isLoading} />
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input id="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
                            {passwordError && <p className="text-sm font-medium text-destructive">{passwordError}</p>}
                            </div>
                            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Register
                            </Button>
                        </form>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="underline text-primary">
                            Log In
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
