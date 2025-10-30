'use client';
import { useState, useEffect } from 'react';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { subdomains } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

export default function SettingsPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  // Get user profile
  const userDocPath = user ? `users/${user.uid}` : null;
  const { data: userDoc, loading: userDocLoading } = useDoc<any>(userDocPath);

  // Get company profile, which depends on user profile
  const companyDocPath = userDoc?.companyId ? `companies/${userDoc.companyId}` : null;
  const { data: companyDoc, loading: companyDocLoading } = useDoc<any>(companyDocPath);
  
  const [displayName, setDisplayName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [capacity, setCapacity] = useState<number | ''>('');
  const [employees, setEmployees] = useState<number | ''>('');
  const [yearlyOutput, setYearlyOutput] = useState<number | ''>('');
  const [complianceLevel, setComplianceLevel] = useState('');


  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
    }
    if (companyDoc) {
      setCompanyName(companyDoc.companyName || '');
      setLocation(companyDoc.location || '');
      setSubdomain(companyDoc.subdomain || '');
      setCapacity(companyDoc.capacity || '');
      setEmployees(companyDoc.employees || '');
      setYearlyOutput(companyDoc.yearlyOutput || '');
      setComplianceLevel(companyDoc.complianceLevel || '');
    }
  }, [user, companyDoc]);

  const handleProfileUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore || !userDocPath) return;

    const userRef = doc(firestore, userDocPath);
    const userData = { displayName };
    setDoc(userRef, userData, { merge: true }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not update profile.' });
      }).then(() => {
        toast({ title: "Profile Updated", description: "Your profile information has been saved." });
      });
  };

  const handleCompanyUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore || !companyDocPath) return;

    const companyRef = doc(firestore, companyDocPath);
    const companyData = { 
        companyName, 
        location, 
        subdomain,
        capacity: Number(capacity),
        employees: Number(employees),
        yearlyOutput: Number(yearlyOutput),
        complianceLevel,
    };
    setDoc(companyRef, companyData, { merge: true }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: companyRef.path,
          operation: 'update',
          requestResourceData: companyData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not update company details.' });
      }).then(() => {
        toast({ title: "Company Details Updated", description: "Your company information has been saved." });
      });
  };

  const isLoading = userLoading || userDocLoading || (userDoc?.companyId && companyDocLoading);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Settings</h1>

      {isLoading ? (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-72" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-64" />
                           <Skeleton className="h-4 w-48" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <div className="flex justify-end pt-2">
                      <Skeleton className="h-10 w-24" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                     <div className="flex justify-end pt-2">
                      <Skeleton className="h-10 w-24" />
                    </div>
                </CardContent>
            </Card>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Manage your personal account details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user?.photoURL || ''} alt={displayName} />
                        <AvatarFallback>{displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                        <p className="font-medium">{user?.email}</p>
                        <p className="text-muted-foreground">This is the email associated with your account.</p>
                    </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your Name" />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Save Profile</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {companyDoc && (
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
                <CardDescription>Manage your company's information on the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCompanyUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your Company Ltd." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Tiruppur, Tamil Nadu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subdomain">Industry Subdomain</Label>
                    <Select value={subdomain} onValueChange={setSubdomain}>
                      <SelectTrigger id="subdomain">
                        <SelectValue placeholder="Select your factory type" />
                      </SelectTrigger>
                      <SelectContent>
                        {subdomains.map((item) => (
                          <SelectItem key={item.name} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity (e.g., tons/year)</Label>
                    <Input id="capacity" type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} placeholder="1000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employees">Number of Employees</Label>
                    <Input id="employees" type="number" value={employees} onChange={(e) => setEmployees(Number(e.target.value))} placeholder="250" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearlyOutput">Yearly Output (e.g., units)</Label>
                    <Input id="yearlyOutput" type="number" value={yearlyOutput} onChange={(e) => setYearlyOutput(Number(e.target.value))} placeholder="500000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complianceLevel">Compliance Level</Label>
                    <Select value={complianceLevel} onValueChange={setComplianceLevel}>
                      <SelectTrigger id="complianceLevel">
                        <SelectValue placeholder="Select compliance level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="certified">Certified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end md:col-span-2">
                    <Button type="submit">Save Company Details</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
