'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function RegisterPage() {
    const { toast } = useToast();
    const router = useRouter();
    const auth = useAuth();
    const firestore = useFirestore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!auth || !firestore) {
            toast({
                variant: 'destructive',
                title: "Error",
                description: "Authentication or database service is not available.",
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                variant: 'destructive',
                title: "Password Mismatch",
                description: "The passwords you entered do not match.",
            });
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const formData = new FormData(event.currentTarget);
            const companyData = {
                ownerUid: user.uid,
                companyName: formData.get('companyName') as string,
                location: formData.get('location') as string,
                capacity: Number(formData.get('capacity')),
                employees: Number(formData.get('employees')),
                yearlyOutput: Number(formData.get('yearlyOutput')),
                complianceLevel: formData.get('compliance') as string,
                createdAt: serverTimestamp(),
            };

            const companiesCollectionRef = collection(firestore, 'companies');
            const companyRef = await addDoc(companiesCollectionRef, companyData).catch((serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: companiesCollectionRef.path,
                    operation: 'create',
                    requestResourceData: companyData,
                });
                errorEmitter.emit('permission-error', permissionError);
                throw serverError; 
            });

            const userRef = doc(firestore, `users/${user.uid}`);
            const userData = {
                uid: user.uid,
                email: user.email,
                companyId: companyRef.id,
            };
            
            await setDoc(userRef, userData, { merge: true }).catch(async (serverError) => {
              const permissionError = new FirestorePermissionError({
                path: userRef.path,
                operation: 'create',
                requestResourceData: userData,
              });
              errorEmitter.emit('permission-error', permissionError);
              throw serverError;
            });


            toast({
                title: "Registration Successful!",
                description: "Redirecting you to the dashboard.",
            });
            router.push('/dashboard');
        } catch (error: any) {
            console.error("Registration Failed:", error);
            toast({
                variant: 'destructive',
                title: "Registration Failed",
                description: error.message || "An unexpected error occurred.",
            });
        }
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-2xl">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Logo />
            </div>
            <CardTitle className="font-headline text-2xl">Join CarbonKanakku</CardTitle>
            <CardDescription>Start your sustainability journey. Create an account and tell us about your factory.</CardDescription>
          </CardHeader>
          <CardContent>
            {isClient && (
              <form onSubmit={handleSubmit} className="space-y-6" key={isClient ? 'client' : 'server'}>
                <div className="space-y-4">
                    <h3 className="text-lg font-medium font-headline">Account Credentials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            {/* Spacer */}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                    </div>
                </div>

              <div className="space-y-4">
                 <h3 className="text-lg font-medium font-headline">Company Information</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input id="companyName" name="companyName" placeholder="Your Company Ltd." required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" placeholder="Tiruppur, Tamil Nadu" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity (e.g., tons/year)</Label>
                        <Input id="capacity" name="capacity" type="number" placeholder="1000" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="employees">Number of Employees</Label>
                        <Input id="employees" name="employees" type="number" placeholder="250" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="yearlyOutput">Yearly Output (e.g., units)</Label>
                        <Input id="yearlyOutput" name="yearlyOutput" type="number" placeholder="500000" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="compliance">Compliance Level</Label>
                        <Select required name="compliance">
                        <SelectTrigger id="compliance">
                            <SelectValue placeholder="Select compliance level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="certified">Certified</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                 </div>
              </div>

              <div>
                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Create Account
                </Button>
              </div>
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
    </div>
  );
}
