"use client";

import { CalculatorProvider } from '@/context/CalculatorContext';
import CalculatorPanel from '@/components/calculator/CalculatorPanel';
import ChatPanel from '@/components/chat/ChatPanel';

export default function Home() {
  return (
    <CalculatorProvider>
      <main className="h-screen w-full bg-[#F8FAFC] flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel: Calculator (60% on Desktop) */}
        <section className="w-full md:w-[60%] h-[60vh] md:h-full overflow-hidden border-b md:border-b-0 md:border-r border-gray-200 bg-white">
          <CalculatorPanel />
        </section>

        {/* Right Panel: Chat (40% on Desktop) */}
        <section className="w-full md:w-[40%] h-[40vh] md:h-full bg-gray-50">
          <ChatPanel />
        </section>
      </main>
    </CalculatorProvider>
  );
}