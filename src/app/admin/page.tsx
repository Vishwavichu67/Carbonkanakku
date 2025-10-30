import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, BarChart } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Admin Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registered Industries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground">+50 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Data Entries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34,890</div>
            <p className="text-xs text-muted-foreground">+1,200 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Reports Generated</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">+32 today</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recently Registered Industries</CardTitle>
          <CardDescription>A list of the latest companies to join the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Subdomain</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Surat Weavers Co.</TableCell>
                <TableCell><Badge variant="outline">Weaving Mills</Badge></TableCell>
                <TableCell>Surat, Gujarat</TableCell>
                <TableCell>2024-06-15</TableCell>
              </TableRow>
               <TableRow>
                <TableCell className="font-medium">EcoSpinners Pvt. Ltd.</TableCell>
                <TableCell><Badge variant="outline">Spinning Units</Badge></TableCell>
                <TableCell>Coimbatore, Tamil Nadu</TableCell>
                <TableCell>2024-06-14</TableCell>
              </TableRow>
               <TableRow>
                <TableCell className="font-medium">Rainbow Dyers</TableCell>
                <TableCell><Badge variant="outline">Dyeing &amp; Processing</Badge></TableCell>
                <TableCell>Ludhiana, Punjab</TableCell>
                <TableCell>2024-06-14</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
