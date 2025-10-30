'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { subdomains } from '@/lib/constants';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function DataInputPage() {
  const [selectedSubdomain, setSelectedSubdomain] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubdomainChange = (value: string) => {
    setSelectedSubdomain(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
        title: "Data Submitted Successfully!",
        description: "Your dashboard will be updated shortly.",
    });
  }

  const currentSubdomain = subdomains.find(s => s.name === selectedSubdomain);

  return (
    <div>
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
              <Select onValueChange={handleSubdomainChange}>
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
                  {currentSubdomain.inputs.map(input => (
                    <div key={input.name} className="space-y-2">
                      <Label htmlFor={input.name.toLowerCase().replace(/ /g, '-')}>
                        {input.name} <span className="text-muted-foreground">({input.unit})</span>
                      </Label>
                      <Input id={input.name.toLowerCase().replace(/ /g, '-')} type={input.unit.includes('/') || input.unit.length > 3 ? 'text' : 'number'} required />
                      <p className="text-xs text-muted-foreground">Emission Type: {input.emissionType}</p>
                    </div>
                  ))}
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
    </div>
  );
}
