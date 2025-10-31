'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { subdomains } from '@/lib/constants';
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

type FormData = { [key: string]: string | number };

export default function DataInputPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const userDocPath = user ? `users/${user.uid}` : null;
  const { data: userDoc } = useDoc<any>(userDocPath);

  const [selectedSubdomain, setSelectedSubdomain] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const handleSubdomainChange = (value: string) => {
    setSelectedSubdomain(value);
    setFormData({});
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = event.target;
    setFormData(prev => ({
        ...prev,
        [id]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore || !userDoc?.companyId || !selectedSubdomain) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Cannot submit data without company and subdomain selection.'
      });
      return;
    }
    
    setIsSubmitting(true);

    const dataToSubmit = {
      companyId: userDoc.companyId,
      subdomain: selectedSubdomain,
      createdAt: serverTimestamp(),
      data: formData,
    };
    
    const collectionRef = collection(firestore, `companies/${userDoc.companyId}/data`);
    
    addDoc(collectionRef, dataToSubmit).then(() => {
        toast({
            title: "Data Submitted Successfully!",
            description: "Your dashboard will be updated shortly.",
        });
        setFormData({});
    }).catch(serverError => {
        const permissionError = new FirestorePermissionError({
          path: collectionRef.path,
          operation: 'create',
          requestResourceData: dataToSubmit,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
            variant: 'destructive',
            title: "Submission Failed",
            description: "You don't have permission to add data.",
        });
    }).finally(() => {
        setIsSubmitting(false);
    });
  }

  const currentSubdomain = subdomains.find(s => s.name === selectedSubdomain);
  const inputFields = currentSubdomain?.inputs || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline mb-6">Data Input Module</h1>
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Monthly Data</CardTitle>
          <CardDescription>Select your subdomain to see the required input fields. Regular submissions improve the accuracy of your ESG insights.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="max-w-md space-y-2">
              <Label htmlFor="subdomain-selector">Factory Type</Label>
              <Select onValueChange={handleSubdomainChange} value={selectedSubdomain || ''} disabled={isSubmitting}>
                <SelectTrigger id="subdomain-selector">
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

            {currentSubdomain && (
              <div className="p-6 border rounded-lg bg-background">
                <h3 className="text-xl font-headline font-semibold mb-4">{currentSubdomain.name} - Key Inputs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inputFields.map(input => {
                    const inputId = input.name.toLowerCase().replace(/ /g, '-');
                    return (
                        <div key={input.name} className="space-y-2">
                        <Label htmlFor={inputId}>
                            {input.name} <span className="text-muted-foreground">({input.unit})</span>
                        </Label>
                        <Input 
                            id={inputId} 
                            type={input.unit.includes('/') || input.unit.length > 3 ? 'text' : 'number'}
                            value={formData[inputId] || ''}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            required 
                        />
                        <p className="text-xs text-muted-foreground">Emission Type: {input.emissionType}</p>
                        </div>
                    )
                  })}
                </div>
              </div>
            )}

            {currentSubdomain && (
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting || Object.keys(formData).length === 0}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Data
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
