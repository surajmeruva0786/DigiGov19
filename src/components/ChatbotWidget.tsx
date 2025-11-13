import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Paperclip, Mic } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ChatbotWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatbotWidget({ isOpen, onToggle }: ChatbotWidgetProps) {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onToggle}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-[90vw] sm:w-[450px] h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the widget
          >
            <Card className="flex flex-col flex-grow border-0 shadow-2xl bg-white/90 backdrop-blur-md overflow-hidden rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-white/80">
                <CardTitle className="text-lg font-semibold text-gray-800">Chatbot</CardTitle>
                <Button variant="ghost" size="icon" onClick={onToggle}>
                  <X className="w-5 h-5 text-gray-500" />
                </Button>
              </CardHeader>
              <CardContent className="flex-grow p-4 overflow-y-auto">
                {/* Chat display area - currently empty */}
                <div className="text-sm text-gray-500 text-center py-4">
                  Start a conversation!
                </div>
              </CardContent>
              <div className="p-4 border-t bg-white/80">
                <div className="relative flex items-center">
                  <Textarea
                    placeholder="Type your message..."
                    className="flex-grow resize-none min-h-[40px] max-h-[100px] bg-gray-50 border-gray-200 rounded-full pl-4 pr-24"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="absolute right-2 flex items-center">
                    <Button size="icon" variant="ghost" className="text-gray-600">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-gray-600">
                      <Mic className="w-5 h-5" />
                    </Button>
                    <Button size="icon" onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
