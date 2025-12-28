import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DollarSign,
  Users,
  CreditCard,
  Activity,
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
} from 'lucide-react';

const Dashboard3 = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Activity className="mr-2 h-4 w-4" />
          View Reports
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳45,231.89</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 inline-flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +20.1%
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Accounts
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 inline-flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +180.1%
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sales
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 inline-flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +19%
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Now
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 inline-flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +201
              </span>{' '}
              since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart Area */}
        <Card className="col-span-4 bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription className="text-muted-foreground">
              You have 265 orders this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Order #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">customer{i}@example.com</p>
                  </div>
                  <div className="ml-4 font-medium">৳{(Math.random() * 10000).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="col-span-3 bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription className="text-muted-foreground">
              You made 265 sales this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '৳1,999.00' },
                { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '৳39.00' },
                { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '৳299.00' },
                { name: 'William Kim', email: 'will@email.com', amount: '৳99.00' },
                { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '৳39.00' },
              ].map((sale, i) => (
                <div key={i} className="flex items-center">
                  <Avatar className="h-9 w-9 bg-red-600">
                    <AvatarFallback className="bg-red-600 text-white">
                      {sale.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{sale.name}</p>
                    <p className="text-sm text-muted-foreground">{sale.email}</p>
                  </div>
                  <div className="ml-auto font-medium">{sale.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="bg-card text-card-foreground border-border">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription className="text-muted-foreground">
            Recent orders from your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { order: 'ORD-001', customer: 'Pablo Hunter', email: 'pablo.hunter@email.com', status: 'Completed', amount: '৳5,231.89' },
                { order: 'ORD-002', customer: 'Olivia Martin', email: 'olivia.martin@email.com', status: 'Processing', amount: '৳2,456.00' },
                { order: 'ORD-003', customer: 'Jackson Lee', email: 'jackson.lee@email.com', status: 'Shipped', amount: '৳1,234.56' },
                { order: 'ORD-004', customer: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', status: 'Pending', amount: '৳987.65' },
                { order: 'ORD-005', customer: 'William Kim', email: 'will@email.com', status: 'Completed', amount: '৳3,456.78' },
              ].map((transaction, i) => (
                <TableRow key={i} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{transaction.order}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 bg-red-600">
                        <AvatarFallback className="bg-red-600 text-white text-xs">
                          {transaction.customer.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{transaction.customer}</p>
                        <p className="text-sm text-muted-foreground">{transaction.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.status === 'Completed' ? 'default' : 'secondary'}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{transaction.amount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard3;
