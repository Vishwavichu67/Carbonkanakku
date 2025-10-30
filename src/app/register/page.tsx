'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { useState, useEffect } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Reset errors
    setEmailError('');
    setPasswordError('');

    // --- Form Validation ---
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
    if (!companyName.trim()) {
        toast({ variant: 'destructive', title: 'Company name is required.' });
        setIsLoading(false);
        return;
    }
    if (!displayName.trim()) {
        toast({ variant: 'destructive', title: 'Your name is required.' });
        setIsLoading(false);
        return;
    }

    if (!auth || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firebase is not initialized correctly.',
      });
      setIsLoading(false);
      return;
    }

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update user's display name in Auth profile
      await updateProfile(user, { displayName: displayName });

      // 3. Create a new company document in Firestore
      const companyRef = await addDoc(collection(firestore, 'companies'), {
        ownerUid: user.uid,
        companyName: companyName,
        createdAt: new Date(),
        location: '',
        subdomain: '',
        capacity: 0,
        employees: 0,
        yearlyOutput: 0,
        complianceLevel: 'basic',
      });

      // 4. Create a user profile document in Firestore
      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        companyId: companyRef.id,
      });

      toast({
        title: 'Registration Successful!',
        description: 'Your account has been created. Redirecting to your dashboard...',
      });

      // 5. Redirect to dashboard page
      router.push('/dashboard');

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setEmailError('This email is already registered. Please log in.');
      } else if (error.code === 'auth/weak-password') {
        setPasswordError('Password is too weak. It should be at least 6 characters.');
      } else {
        console.error('Registration failed:', error);
        toast({
          variant: 'destructive',
          title: 'Registration Failed',
          description: error.message || 'An unexpected error occurred.',
        });
      }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow flex items-center justify-center bg-secondary p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Logo />
              </div>
              <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
              <CardDescription>Join to start tracking your company&apos;s ESG metrics.</CardDescription>
            </CardHeader>
            <CardContent>
              {isClient && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" type="text" placeholder="Your Company Ltd." required value={companyName} onChange={(e) => setCompanyName(e.target.value)} disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Your Name</Label>
                    <Input id="displayName" type="text" placeholder="John Doe" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                    {emailError && <p className="text-sm font-medium text-destructive">{emailError}</p>}
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
              )}
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline text-primary">
                  Log In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
