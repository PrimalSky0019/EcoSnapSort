import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BookOpen,
  Recycle,
  Users,
  Award,
  BarChart,
  Megaphone,
} from 'lucide-react';
import Link from 'next/link';
import { WasteChart } from './waste-chart';

const solutions = [
  {
    title: 'Mandatory Waste Training',
    description:
      'Every citizen receives training on waste segregation, composting, and plastic reuse.',
    icon: BookOpen,
  },
  {
    title: 'Green Champion Committees',
    description:
      'Decentralized monitoring by area committees ensures waste management at every step.',
    icon: Users,
  },
  {
    title: 'Incentive-Based Approach',
    description:
      'Bulk waste generators are incentivized for proper source segregation.',
    icon: Award,
  },
  {
    title: 'Community Reporting',
    description:
      '"If you see waste, send a photo." Community participation to keep urban local bodies clean.',
    icon: Megaphone,
  },
  {
    title: 'Digital-First System',
    description:
      'A complete app-based system for training, tracking, shopping, and reporting.',
    icon: Recycle,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome, Green Champion!"
        description="Your hub for making our community cleaner and greener."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Our Core Solutions</CardTitle>
              <CardDescription>
                A multi-pronged approach to build a robust waste management
                ecosystem.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              {solutions.slice(0, 4).map((solution) => (
                <div key={solution.title} className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                    <solution.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{solution.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {solution.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Waste Management Stats</CardTitle>
              <CardDescription>
                India generates 1.7 lakh tonnes of municipal solid waste daily. Here's the breakdown of what happens to it.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <WasteChart />
            </CardContent>
           </Card>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <Card className="text-center">
            <CardContent className="p-6">
              <Avatar className="mx-auto mb-4 h-24 w-24">
                <AvatarImage
                  src="https://picsum.photos/seed/avatar/200/200"
                  alt="User Avatar"
                />
                <AvatarFallback>GC</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">Green Champion</h3>
              <p className="text-muted-foreground">citizen@example.com</p>
              <Button asChild className="mt-4">
                <Link href="/profile">View Profile</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Issues Reported</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Events Joined</span>
                <span className="font-bold">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Training Status</span>
                <Badge variant="default">Certified</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
