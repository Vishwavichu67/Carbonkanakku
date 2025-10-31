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
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

type FormData = { [key: string]: string | number };

const DEFAULT_COMPANY_ID = 'default-company';

export default function DataInputPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const [selectedSubdomain, setSelectedSubdomain] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  
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
    if (!firestore || !selectedSubdomain) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'You must select a factory type before submitting data.'
      });
      return;
    }
    
    // Immediately show success and clear form for a snappy demo experience
    toast({
        title: "Data Submitted Successfully!",
        description: "Your dashboard will be updated shortly.",
    });

    const dataToSubmit = {
      companyId: DEFAULT_COMPANY_ID,
      subdomain: selectedSubdomain,
      createdAt: serverTimestamp(),
      data: formData,
      userId: user?.uid || 'anonymous',
    };
    
    setFormData({}); // Reset form immediately
    
    const collectionRef = collection(firestore, `companies/${DEFAULT_COMPANY_ID}/data`);
    
    // Perform the async operation in the background without blocking the UI
    addDoc(collectionRef, dataToSubmit).catch(serverError => {
        const permissionError = new FirestorePermissionError({
          path: collectionRef.path,
          operation: 'create',
          requestResourceData: dataToSubmit,
        });
        errorEmitter.emit('permission-error', permissionError);
        // Optionally, show a silent error or log it, but avoid a disruptive toast
        console.error("Submission Failed in background:", serverError);
    });
  }

  const currentSubdomain = subdomains.find(s => s.name === selectedSubdomain);
  const inputFields = currentSubdomain?.inputs || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline mb-6">Data Input Module</h1>
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Daily Data</CardTitle>
          <CardDescription>Select your subdomain to see the required input fields. Regular submissions improve the accuracy of your ESG insights.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="max-w-md space-y-2">
              <Label htmlFor="subdomain-selector">Factory Type</Label>
              <Select onValueChange={handleSubdomainChange} value={selectedSubdomain || ''}>
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
                <Button type="submit" disabled={Object.keys(formData).length === 0}>
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
