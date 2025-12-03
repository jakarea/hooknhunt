import { useEffect, useState } from 'react';
import { useSmsStore } from '@/stores/smsStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Send,
  History,
  Wallet,
  RefreshCw,
  Search,
  Plus,
  X,
  BarChart3,
} from 'lucide-react';

// Format date helper function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export default function SmsManagement() {
  const {
    logs,
    loading,
    error,
    balance,
    balanceLoading,
    statistics,
    statsLoading,
    fetchLogs,
    sendSms,
    getBalance,
    getStatistics,
    getReport,
    refreshReports,
  } = useSmsStore();

  const [activeTab, setActiveTab] = useState('send');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Send SMS form state
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState<string[]>(['']);
  const [senderId, setSenderId] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchLogs();
    getBalance();
    getStatistics();
  }, []);

  const handleAddRecipient = () => {
    setRecipients([...recipients, '']);
  };

  const handleRemoveRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const handleRecipientChange = (index: number, value: string) => {
    const newRecipients = [...recipients];
    newRecipients[index] = value;
    setRecipients(newRecipients);
  };

  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const validRecipients = recipients.filter((r) => r.trim() !== '');
      await sendSms({
        message,
        recipients: validRecipients,
        sender_id: senderId || undefined,
      });

      // Reset form
      setMessage('');
      setRecipients(['']);
      setSenderId('');
      alert('SMS sent successfully!');
    } catch (error) {
      alert('Failed to send SMS');
    } finally {
      setSending(false);
    }
  };

  const handleSearch = () => {
    fetchLogs(1, statusFilter, searchQuery);
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      sent: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      complete: 'bg-blue-100 text-blue-800',
    };

    return (
      <Badge className={statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SMS Management</h1>
          <p className="text-gray-600 mt-1">Send and manage SMS messages via Alpha SMS</p>
        </div>
        <div className="flex items-center gap-4">
          <Card className="px-4 py-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Balance</p>
                <p className="text-sm font-bold text-gray-900">
                  {balanceLoading ? 'Loading...' : balance ? `৳${balance}` : 'N/A'}
                </p>
              </div>
            </div>
          </Card>
          <Button onClick={getBalance} variant="outline" size="sm" disabled={balanceLoading}>
            <RefreshCw className={`h-4 w-4 ${balanceLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{statistics.total_sent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">{statistics.total_failed}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{statistics.this_month_sent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">৳{statistics.total_cost}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="send">
            <Send className="h-4 w-4 mr-2" />
            Send SMS
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Send SMS Tab */}
        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>Send New SMS</CardTitle>
              <CardDescription>Send SMS to one or multiple recipients</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendSms} className="space-y-4">
                {/* Message */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Message
                  </label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={5}
                    maxLength={1000}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {message.length}/1000 characters
                  </p>
                </div>

                {/* Recipients */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Recipients
                  </label>
                  <div className="space-y-2">
                    {recipients.map((recipient, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={recipient}
                          onChange={(e) => handleRecipientChange(index, e.target.value)}
                          placeholder="01XXXXXXXXX or 8801XXXXXXXXX"
                          required
                        />
                        {recipients.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveRecipient(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddRecipient}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Recipient
                  </Button>
                </div>

                {/* Sender ID (Optional) */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Sender ID (Optional)
                  </label>
                  <Input
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value)}
                    placeholder="Your approved sender ID"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be an approved sender ID from Alpha SMS
                  </p>
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={sending} className="w-full">
                  {sending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send SMS
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>SMS History</CardTitle>
                  <CardDescription>View all sent SMS messages</CardDescription>
                </div>
                <Button onClick={refreshReports} variant="outline" size="sm" disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh Reports
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Search by message or phone number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button onClick={handleSearch} variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <select
                  className="border border-gray-300 rounded-md px-3 py-2"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    fetchLogs(1, e.target.value, searchQuery);
                  }}
                >
                  <option value="">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="complete">Complete</option>
                </select>
              </div>

              {/* SMS Logs Table */}
              {loading ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                  <p className="text-gray-500 mt-2">Loading...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-300" />
                  <p className="text-gray-500 mt-2">No SMS logs found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <Card key={log.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(log.status)}
                            <span className="text-xs text-gray-500">
                              {formatDate(log.created_at)}
                            </span>
                            {log.user && (
                              <span className="text-xs text-gray-500">
                                by {log.user.name}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{log.message}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>To: {log.recipients}</span>
                            {log.charge > 0 && <span>Cost: ৳{log.charge}</span>}
                            {log.request_id && <span>ID: {log.request_id}</span>}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => getReport(log.id)}
                        >
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Report
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
