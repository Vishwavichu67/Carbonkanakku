'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { subdomains } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function RegisterPage() {
    const { toast } = useToast();
    const router = useRouter();
    const auth = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!auth) {
            toast({
                variant: 'destructive',
                title: "Error",
                description: "Authentication service is not available.",
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
            await createUserWithEmailAndPassword(auth, email, password);
            toast({
                title: "Registration Successful!",
                description: "Redirecting you to the dashboard.",
            });
            router.push('/dashboard');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: "Registration Failed",
                description: error.message,
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
            <CardTitle className="font-headline text-2xl">Join EcoTextile Insights</CardTitle>
            <CardDescription>Start your sustainability journey. Create an account and tell us about your factory.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>

              <div className="md:col-span-2 border-t pt-6 mt-2 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input id="companyName" placeholder="Your Company Ltd." required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" placeholder="Tiruppur, Tamil Nadu" required />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="subdomain">Industry Subdomain</Label>
                        <Select required>
                        <SelectTrigger id="subdomain">
                            <SelectValue placeholder="Select your factory type" />
                        </SelectTrigger>
                        <SelectContent>
                            {subdomains.map((subdomain) => (
                            <SelectItem key={subdomain.name} value={subdomain.name}>
                                {subdomain.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity (e.g., tons/year)</Label>
                        <Input id="capacity" type="number" placeholder="1000" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="employees">Number of Employees</Label>
                        <Input id="employees" type="number" placeholder="250" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="yearlyOutput">Yearly Output (e.g., units)</Label>
                        <Input id="yearlyOutput" type="number" placeholder="500000" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="compliance">Compliance Level</Label>
                        <Select required>
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

              <div className="md:col-span-2">
                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Create Account
                </Button>
              </div>
            </form>
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
