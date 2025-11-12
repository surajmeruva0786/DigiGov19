import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquareText, X, Send, Paperclip, Mic } from 'lucide-react';
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
    <>
      {/* Chatbot Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          size="icon"
          className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          onClick={onToggle}
        >
          <MessageSquareText className="w-7 h-7" />
        </Button>
      </motion.div>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 h-[400px] flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="flex flex-col flex-grow border-0 shadow-2xl bg-white/90 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
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
                <div className="flex items-center space-x-2">
                  <Button size="icon" variant="ghost" className="text-gray-600">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Textarea
                    placeholder="Type your message..."
                    className="flex-grow resize-none min-h-[40px] max-h-[100px] bg-gray-50 border-gray-200"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button size="icon" variant="ghost" className="text-gray-600">
                    <Mic className="w-5 h-5" />
                  </Button>
                  <Button size="icon" onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
