"use client";

import { useChat } from '@ai-sdk/react';
import { useCalculatorStore } from '@/context/CalculatorContext';
import { Send, Sparkles, Bot, Phone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import ContactModal from './ContactModal';

export default function ChatPanel() {
  const { state } = useCalculatorStore();
  const [localInput, setLocalInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Product URL mapping for automatic link detection
  const productLinks: Record<string, string> = {
    'Cuby G4': 'https://cuby.mx/products/cuby-g4',
    'Cuby': 'https://cuby.mx',
  };

  // Suggested questions for empty chat state
  const suggestedQuestions = [
    '¿Cuánto dinero estoy perdiendo al año?',
    '¿Por qué me conviene el Cuby G4?',
    '¿Qué pasa si mi aire es viejo?',
    'Dame tips para ahorrar luz.'
  ];

  // Use the correct useChat hook with proper configuration for AI SDK v5
  const { messages, status, sendMessage } = useChat({
    onError: (error: any) => {
      console.error("FRONTEND CHAT ERROR:", error);
      alert("Error en el chat. Revisa la consola para más detalles.");
    },
    onFinish: (message: any) => {
      console.log("DEBUG: Message finished:", message);
    }
  });

  // Derive isLoading from status
  const isLoading = status === 'streaming' || status === 'submitted';

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper to extract text from AI SDK v5 message format
  const getMessageText = (message: any): string => {
    // AI SDK v5 uses parts array
    if (message.parts) {
      return message.parts
        .map((part: any) => (part.type === 'text' ? part.text : ''))
        .join('');
    }
    // Fallback to content for compatibility
    return message.content || '';
  };

  // Helper to convert product mentions to clickable links
  const addProductLinks = (text: string): string => {
    let processedText = text;

    // Sort by length descending to match longer product names first (e.g., "Cuby G4" before "Cuby")
    const sortedProducts = Object.entries(productLinks).sort((a, b) => b[0].length - a[0].length);

    // PHASE 1: Replace product names with safe numeric placeholders
    // This prevents nested replacements when "Cuby" matches inside "Cuby G4" URLs or placeholders
    const placeholderMap: Record<string, string> = {};
    let placeholderIndex = 0;

    sortedProducts.forEach(([productName, url]) => {
      const escapedName = productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(\\*{0,2})(${escapedName})(\\*{0,2})`, 'gi');
      const placeholder = `__PLH${placeholderIndex}__`; // Use numeric placeholder to avoid matching product names
      placeholderIndex++;

      // Store the actual HTML for this product
      placeholderMap[placeholder] = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-semibold transition-colors inline-flex items-center gap-1">${productName}<svg class="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>`;

      // Replace with placeholder, preserving markdown asterisks
      processedText = processedText.replace(regex, `$1${placeholder}$3`);
    });

    // PHASE 2: Replace all placeholders with actual HTML links
    Object.entries(placeholderMap).forEach(([placeholder, html]) => {
      processedText = processedText.replace(new RegExp(placeholder, 'g'), html);
    });

    return processedText;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput.trim() || isLoading) return;

    console.log("DEBUG: Sending message with state:", state);

    // Save message and clear input immediately for better UX
    const messageText = localInput;
    setLocalInput(''); // Clear input BEFORE sending for instant feedback

    // Use sendMessage (AI SDK v5 API) with body parameter for calculator state
    try {
      await sendMessage(
        { text: messageText },
        {
          body: {
            calculatorState: state
          }
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handler for suggested question chips
  const handleSuggestedQuestion = async (question: string) => {
    if (isLoading) return;

    console.log("DEBUG: Sending suggested question:", question);

    // Use sendMessage to programmatically send the suggested question
    try {
      await sendMessage(
        { text: question },
        {
          body: {
            calculatorState: state
          }
        }
      );
    } catch (error) {
      console.error("Error sending suggested question:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200 shadow-sm relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center sticky top-0 z-10">
        <div>
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            Cuby Smart Assistant
          </h2>
          <p className="text-xs text-gray-500">Experto en ahorro de energía</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          title="Hablar con un Humano"
        >
          <Phone className="w-4 h-4" />
          <span className="hidden sm:inline">Hablar con Ventas</span>
        </button>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
        {messages.length === 0 && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[85%]">
              <p className="text-sm text-gray-700">
                ¡Hola! Soy CubyBot. 👋 <br/>
                Veo que tienes configurado tu uso a la izquierda. <br/>
                <b>¿Te gustaría saber cómo reducir tu recibo de luz?</b>
              </p>
            </div>
          </div>
        )}

        {messages.map((m: any) => (
          <div
            key={m.id}
            className={clsx(
              "flex w-full",
              m.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={clsx(
                "p-3 rounded-2xl max-w-[85%] text-sm shadow-sm",
                m.role === 'user'
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
              )}
            >
              {m.role === 'assistant' ? (
                 <div dangerouslySetInnerHTML={{
                   __html:
                     // CRITICAL: Process in correct order!
                     // STEP 1: Add product links FIRST (to plain text before markdown)
                     addProductLinks(getMessageText(m))
                     // STEP 2: Then convert markdown to HTML
                     .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                     // STEP 3: Finally convert line breaks
                     .replace(/\n/g, '<br/>')
                 }} />
              ) : (
                getMessageText(m)
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-gray-500 italic">Pensando...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        {/* Suggested Questions - Only show when chat is empty */}
        {messages.length === 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Preguntas sugeridas:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestedQuestion(question)}
                  disabled={isLoading}
                  className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input 
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            placeholder="Pregunta sobre tu ahorro..." 
            className="flex-1 p-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button 
            type="submit"
            disabled={isLoading || !localInput.trim()}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        vertical={state.vertical}
        acCount={state.ac_count}
      />
    </div>
  );
}
