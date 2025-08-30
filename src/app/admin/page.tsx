import { getSession } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminDashboardPage() {
  const session = await getSession();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.email || 'Admin'}!
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to Artechway</CardTitle>
          <CardDescription>
            This is your control center for managing the blog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            From here, you can create new posts, edit existing ones, and manage all your content. Use the sidebar navigation to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
