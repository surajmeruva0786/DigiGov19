import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Zap,
  Droplet,
  Flame,
  Mic,
  Lock,
  Download,
  CheckCircle,
  X,
  IndianRupee,
  Calendar,
  Filter,
  MessageSquareText,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { recordPayment, getUserPayments } from '../firebase';
import { toast } from 'sonner';

interface BillPaymentsProps {
  onNavigate: (page: string) => void;
  onToggleChatbot?: () => void;
}

interface BillType {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  emoji: string;
}

interface Transaction {
  id: string;
  date: string;
  billType: string;
  consumerNumber: string;
  amount: number;
  status: 'Success' | 'Failed' | 'Pending';
}

interface UPIApp {
  id: string;
  name: string;
  logo: string;
  color: string;
}

export function BillPayments({ onNavigate, onToggleChatbot }: BillPaymentsProps) {
  const [selectedBill, setSelectedBill] = useState<BillType | null>(null);
  const [consumerNumber, setConsumerNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [pin, setPin] = useState('');
  const [historyFilter, setHistoryFilter] = useState('30days');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const billTypes: BillType[] = [
    {
      id: 'electricity',
      name: 'Electricity Bill',
      description: 'Pay your electricity bill online',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      emoji: '⚡',
    },
    {
      id: 'water',
      name: 'Water Bill',
      description: 'Pay your water supply bill',
      icon: Droplet,
      color: 'from-cyan-500 to-blue-600',
      emoji: '💧',
    },
    {
      id: 'gas',
      name: 'Gas Bill',
      description: 'Pay your gas connection bill',
      icon: Flame,
      color: 'from-red-500 to-orange-600',
      emoji: '🔥',
    },
  ];

  const upiApps: UPIApp[] = [
    { id: 'gpay', name: 'Google Pay', logo: 'G', color: 'from-blue-500 to-blue-600' },
    { id: 'phonepe', name: 'PhonePe', logo: 'P', color: 'from-purple-500 to-purple-600' },
    { id: 'paytm', name: 'Paytm', logo: '₹', color: 'from-blue-400 to-cyan-500' },
    { id: 'bhim', name: 'BHIM', logo: 'B', color: 'from-orange-500 to-red-600' },
  ];

  // Fetch payment history on mount
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const result = await getUserPayments();
        if (result.success) {
          setTransactions(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleProceedToPayment = () => {
    if (consumerNumber && amount) {
      setShowPinModal(true);
    }
  };

  const handlePinComplete = (value: string) => {
    setPin(value);
    if (value.length === 4) {
      // Auto-submit when 4 digits are entered
      setTimeout(() => {
        setShowPinModal(false);
        setShowUpiModal(true);
        setPin('');
      }, 300);
    }
  };

  const handleUpiSelection = async (appId: string) => {
    if (!selectedBill) return;

    // Record payment to Firestore
    const paymentData = {
      billType: selectedBill.name.replace(' Bill', ''),
      consumerNumber,
      amount: parseFloat(amount),
      paymentMethod: 'UPI',
      upiApp: upiApps.find(app => app.id === appId)?.name || appId,
      status: 'Success' as const,
      transactionId: `TXN${Date.now()}`,
    };

    try {
      const result = await recordPayment(paymentData);
      if (result.success) {
        toast.success('Payment successful!');
        // Refresh payment history
        const updatedPayments = await getUserPayments();
        if (updatedPayments.success) {
          setTransactions(updatedPayments.data || []);
        }
      } else {
        toast.error(result.message || 'Payment recording failed');
      }
    } catch (error) {
      toast.error('An error occurred while recording payment');
      console.error('Error recording payment:', error);
    }

    setShowUpiModal(false);
    setSelectedBill(null);
    setConsumerNumber('');
    setAmount('');
  };

  const handleCancel = () => {
    setSelectedBill(null);
    setConsumerNumber('');
    setAmount('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Failed':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate('dashboard')}
              className="hover:bg-white/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            {onToggleChatbot && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-white/50"
                  onClick={onToggleChatbot}
                >
                  <MessageSquareText className="w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </div>
          <h1 className="gradient-text text-4xl">Bill Payments</h1>
          <p className="text-gray-600 mt-2">Pay your utility bills online</p>
        </motion.div>

        {/* Bill Type Selection Grid */}
        <AnimatePresence mode="wait">
          {!selectedBill && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <h2 className="text-2xl mb-6">Select Bill Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {billTypes.map((bill, index) => (
                  <motion.div
                    key={bill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className="cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all hover:shadow-xl bg-white/80 backdrop-blur-sm group h-full"
                      onClick={() => setSelectedBill(bill)}
                    >
                      <CardContent className="p-6 flex flex-col items-center text-center h-full">
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${bill.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <span className="text-4xl">{bill.emoji}</span>
                        </div>
                        <h3 className="text-xl mb-2">{bill.name}</h3>
                        <p className="text-sm text-gray-600">{bill.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Form */}
        <AnimatePresence mode="wait">
          {selectedBill && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedBill.color} flex items-center justify-center`}>
                      <span className="text-2xl">{selectedBill.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{selectedBill.name}</CardTitle>
                      <CardDescription>Enter payment details below</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCancel}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Consumer Number */}
                  <div className="space-y-2">
                    <Label htmlFor="consumer-number">Consumer Number</Label>
                    <div className="relative">
                      <Input
                        id="consumer-number"
                        placeholder="Enter your consumer number"
                        value={consumerNumber}
                        onChange={(e) => setConsumerNumber(e.target.value)}
                        className="pr-12 bg-white/50 border-gray-200/50 focus:bg-white"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        <Mic className="w-5 h-5 text-blue-600" />
                      </Button>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center text-gray-500">
                        <IndianRupee className="w-5 h-5" />
                      </div>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-12 pr-12 bg-white/50 border-gray-200/50 focus:bg-white"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        <Mic className="w-5 h-5 text-blue-600" />
                      </Button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleProceedToPayment}
                      disabled={!consumerNumber || !amount}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 shadow-lg disabled:opacity-50"
                    >
                      Proceed to Payment
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="flex-1 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: selectedBill ? 0 : 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl">Payment History</h2>
            <Select value={historyFilter} onValueChange={setHistoryFilter}>
              <SelectTrigger className="w-48 bg-white/80">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="1year">Last 1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Bill Type</TableHead>
                      <TableHead>Consumer #</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-blue-50/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>
                              {new Date(transaction.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{transaction.billType}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {transaction.consumerNumber}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <IndianRupee className="w-4 h-4" />
                            <span>{transaction.amount.toLocaleString('en-IN')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(transaction.status)} border`}>
                            {transaction.status === 'Success' && (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            )}
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {transaction.status === 'Success' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-blue-100 hover:text-blue-700"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          )}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* PIN Lock Modal */}
      <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center gap-2 text-2xl">
              <Lock className="w-6 h-6 text-blue-600" />
              Verify PIN
            </DialogTitle>
            <DialogDescription className="text-center">
              Enter your 4-digit PIN to proceed with payment
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-6">
            <InputOTP
              maxLength={4}
              value={pin}
              onChange={handlePinComplete}
              autoFocus
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="w-14 h-14 text-2xl" />
                <InputOTPSlot index={1} className="w-14 h-14 text-2xl" />
                <InputOTPSlot index={2} className="w-14 h-14 text-2xl" />
                <InputOTPSlot index={3} className="w-14 h-14 text-2xl" />
              </InputOTPGroup>
            </InputOTP>
            <Button
              variant="outline"
              onClick={() => {
                setShowPinModal(false);
                setPin('');
              }}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* UPI App Selection Modal */}
      <Dialog open={showUpiModal} onOpenChange={setShowUpiModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Select UPI App</DialogTitle>
            <DialogDescription>
              Choose your preferred payment app to complete the transaction
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-6">
            {upiApps.map((app) => (
              <motion.div
                key={app.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  className="cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all hover:shadow-lg"
                  onClick={() => handleUpiSelection(app.id)}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center mb-3 shadow-lg`}>
                      <span className="text-2xl text-white">{app.logo}</span>
                    </div>
                    <h3 className="text-sm">{app.name}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
