export default function ChatPanel() {
  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-100 bg-white">
        <h2 className="font-semibold text-gray-800">Cuby Smart Assistant</h2>
        <p className="text-xs text-gray-500">Experto en ahorro de energía</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {/* Chat messages placeholder */}
        <div className="flex justify-start mb-4">
          <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm border border-gray-100 max-w-[80%]">
            <p className="text-sm text-gray-700">
              Hola, soy CubyBot. Configura tu uso de aire acondicionado a la izquierda y te diré cuánto podrías ahorrar.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Escribe un mensaje..." 
            className="flex-1 p-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 disabled:opacity-50" disabled>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
