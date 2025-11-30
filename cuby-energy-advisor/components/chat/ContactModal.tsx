import { useState, useEffect } from 'react';
import { VerticalType } from '@/types';
import { X, Send } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  vertical: VerticalType;
  acCount: number;
}

export default function ContactModal({ isOpen, onClose, vertical, acCount }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');

  // Reset form when modal opens or vertical changes
  useEffect(() => {
    if (isOpen) {
      // Dynamic Content Logic
      switch (vertical) {
        case 'home':
          setTitle('Contactar Ventas');
          setSubject('Quiero ahorrar en mis facturas del hogar');
          break;
        case 'school':
          setTitle('Soluciones Educativas');
          setSubject(`Consulta para ${acCount} aulas`);
          break;
        case 'datacenter':
          setTitle('Soporte Empresarial');
          setSubject('Cotización de Alta Disponibilidad');
          break;
        case 'hotel':
          setTitle('Soluciones Hoteleras');
          setSubject(`Cotización para ${acCount} habitaciones`);
          break;
        default:
          setTitle('Contactar Ventas');
          setSubject('Consulta sobre ahorro de energía Cuby');
      }
    }
  }, [isOpen, vertical, acCount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate sending data
    // In a real app, this would send data to an API
    console.log('Form submitted:', { name, email, phone, vertical, subject });

    // Show success message (using alert for simplicity as requested, 
    // but a toast would be better if a library was available. 
    // Since I don't see a toast library installed, I'll use window.alert)
    const verticalName = vertical.charAt(0).toUpperCase() + vertical.slice(1);
    alert(`¡Solicitud enviada al equipo de ${verticalName} de Cuby!`);
    
    onClose();
    
    // Reset fields
    setName('');
    setEmail('');
    setPhone('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
          <h3 id="modal-title" className="font-bold text-lg">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-blue-700 rounded-full transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
            <input
              type="text"
              id="subject"
              value={subject}
              readOnly
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="juan@ejemplo.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              type="tel"
              id="phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="+52 (555) 000-0000"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
