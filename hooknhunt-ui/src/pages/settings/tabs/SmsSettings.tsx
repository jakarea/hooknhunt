import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSmsStore } from '@/stores/smsStore';
import { RoleGuard } from '@/components/guards/RoleGuard';
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

export function SmsSettings() {
  const { t } = useTranslation('settings');

  return (
      <SmsSettingsContent />
  );
}

function SmsSettingsContent() {
  const { t } = useTranslation('settings');
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
      alert(t('sms_tab.alert.sent_success'));
    } catch (error) {
      alert(t('sms_tab.alert.sent_fail'));
    } finally {
      setSending(false);
    }
  };

  const handleSearch = () => {
    fetchLogs(1, statusFilter, searchQuery);
  };

  const getStatusBadge = (status: string) => {
    const statusKey = status.toLowerCase();
    const statusColors: Record<string, string> = {
      sent: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      complete: 'bg-blue-100 text-blue-800',
    };

    const translationKey = `sms_tab.history_tab.status_${statusKey}`;
    const translatedStatus = t(translationKey, { defaultValue: status });

    return (
      <Badge className={statusColors[statusKey] || 'bg-gray-100 text-gray-800'}>
        {translatedStatus}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="flex items-center justify-end gap-4">
        <Card className="px-4 py-2">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">{t('sms_tab.balance')}</p>
              <p className="text-sm font-bold text-gray-900">
                {balanceLoading ? t('sms_tab.loading') : balance ? `৳${balance}` : 'N/A'}
              </p>
            </div>
          </div>
        </Card>
        <Button onClick={getBalance} variant="outline" size="sm" disabled={balanceLoading}>
          <RefreshCw className={`h-4 w-4 ${balanceLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{t('sms_tab.stats.total_sent')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{statistics.total_sent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{t('sms_tab.stats.total_failed')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">{statistics.total_failed}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{t('sms_tab.stats.this_month')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{statistics.this_month_sent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{t('sms_tab.stats.remaining_sms')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {balance ? Math.floor(balance / 0.40) : '0'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="send">
            <Send className="h-4 w-4 mr-2" />
            {t('sms_tab.tabs.send')}
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            {t('sms_tab.tabs.history')}
          </TabsTrigger>
        </TabsList>

        {/* Send SMS Tab */}
        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>{t('sms_tab.send_form.title')}</CardTitle>
              <CardDescription>{t('sms_tab.send_form.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendSms} className="space-y-4">
                {/* Message */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {t('sms_tab.send_form.message_label')}
                  </label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('sms_tab.send_form.message_placeholder')}
                    rows={5}
                    maxLength={1000}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {message.length}/1000 {t('sms_tab.send_form.chars')}
                  </p>
                </div>

                {/* Recipients */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {t('sms_tab.send_form.recipients_label')}
                  </label>
                  <div className="space-y-2">
                    {recipients.map((recipient, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={recipient}
                          onChange={(e) => handleRecipientChange(index, e.target.value)}
                          placeholder={t('sms_tab.send_form.recipient_placeholder')}
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
                    {t('sms_tab.send_form.add_recipient')}
                  </Button>
                </div>

                {/* Sender ID (Optional) */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {t('sms_tab.send_form.sender_id_label')}
                  </label>
                  <Input
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value)}
                    placeholder={t('sms_tab.send_form.sender_id_placeholder')}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('sms_tab.send_form.sender_id_description')}
                  </p>
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={sending} className="w-full">
                  {sending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {t('sms_tab.send_form.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {t('sms_tab.send_form.send_button')}
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
                  <CardTitle>{t('sms_tab.history_tab.title')}</CardTitle>
                  <CardDescription>{t('sms_tab.history_tab.description')}</CardDescription>
                </div>
                <Button onClick={refreshReports} variant="outline" size="sm" disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  {t('sms_tab.history_tab.refresh_button')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder={t('sms_tab.history_tab.search_placeholder')}
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
                  <option value="">{t('sms_tab.history_tab.all_status')}</option>
                  <option value="sent">{t('sms_tab.history_tab.status_sent')}</option>
                  <option value="pending">{t('sms_tab.history_tab.status_pending')}</option>
                  <option value="failed">{t('sms_tab.history_tab.status_failed')}</option>
                  <option value="complete">{t('sms_tab.history_tab.status_complete')}</option>
                </select>
              </div>

              {/* SMS Logs Table */}
              {loading ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                  <p className="text-gray-500 mt-2">{t('sms_tab.loading')}</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-300" />
                  <p className="text-gray-500 mt-2">{t('sms_tab.history_tab.no_logs')}</p>
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
                                {t('sms_tab.history_tab.sent_by')} {log.user.name}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{log.message}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{t('sms_tab.history_tab.to')} {log.recipients}</span>
                            {log.charge > 0 && <span>{t('sms_tab.history_tab.cost')} ৳{log.charge}</span>}
                            {log.request_id && <span>{t('sms_tab.history_tab.id')} {log.request_id}</span>}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => getReport(log.id)}
                        >
                          <BarChart3 className="h-4 w-4 mr-1" />
                          {t('sms_tab.history_tab.report_button')}
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
