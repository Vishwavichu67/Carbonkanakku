'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { subdomains } from '@/lib/constants';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

type FormData = { [key: string]: string | number };
type LastSubmission = {
    subdomain: string;
    data: FormData;
}

export default function DataInputPage() {
  const [selectedSubdomain, setSelectedSubdomain] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [lastSubmission, setLastSubmission] = useState<LastSubmission | null>(null);
  const { toast } = useToast();

  const handleSubdomainChange = (value: string) => {
    setSelectedSubdomain(value);
    setFormData({}); // Reset form data when subdomain changes
    setLastSubmission(null); // Clear last submission
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = event.target;
    setFormData(prev => ({
        ...prev,
        [id]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    setLastSubmission({
        subdomain: selectedSubdomain!,
        data: formData
    });

    toast({
        title: "Data Submitted Successfully!",
        description: "Your dashboard will be updated shortly.",
    });

    // Clear form for next entry
    setFormData({});
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
                <Button type="submit">Submit Data</Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
      
      {lastSubmission && (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2 font-headline text-green-700'>
                    <CheckCircle />
                    Last Submission Received
                </CardTitle>
                <CardDescription>This data was successfully submitted for the <span className='font-semibold'>{lastSubmission.subdomain}</span> category.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                    {Object.entries(lastSubmission.data).map(([key, value]) => {
                        const inputLabel = inputFields.find(i => i.name.toLowerCase().replace(/ /g, '-') === key)?.name || key;
                        return (
                             <div key={key} className="bg-secondary/50 p-3 rounded-md">
                                <p className="font-semibold text-muted-foreground">{inputLabel}</p>
                                <p className="font-mono text-lg">{String(value)}</p>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
