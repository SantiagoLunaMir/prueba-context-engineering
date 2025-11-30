"use client";

import { useCalculatorStore } from '@/context/CalculatorContext';
import { Home, Building, Server, Lock, GraduationCap } from 'lucide-react';
import { VerticalType } from '@/types';

export default function CalculatorPanel() {
  const { state, updateInput, setVertical } = useCalculatorStore();

  const verticals: { id: VerticalType; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Hogar', icon: Home },
    { id: 'hotel', label: 'Hotel', icon: Building },
    { id: 'datacenter', label: 'Data Center', icon: Server },
    { id: 'school', label: 'Escuela', icon: GraduationCap },
  ];

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800">Calculadora de Ahorro</h2>

      {/* Vertical Selector */}
      <div className="flex p-1 bg-gray-100 rounded-lg overflow-x-auto">
        {verticals.map((v) => (
          <button
            key={v.id}
            onClick={() => setVertical(v.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-md transition-colors min-w-[100px] ${
              state.vertical === v.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <v.icon className="w-4 h-4" />
            {v.label}
          </button>
        ))}
      </div>

      {/* Visual Feedback Badges */}
      {state.vertical === 'datacenter' && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
          <Server className="w-4 h-4" />
          Modo crítico: Prioridad de tiempo de actividad y seguridad
        </div>
      )}
      {state.vertical === 'school' && (
        <div className="bg-yellow-100 border border-yellow-200 text-yellow-800 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
           <GraduationCap className="w-4 h-4" />
           Sincronización de calendario: Control de programación activo
        </div>
      )}
      
      {/* Hours per Day */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 flex justify-between">
          <span>Horas de uso al día:</span>
          <span className="font-bold text-blue-600 flex items-center gap-1">
             {state.hours_per_day}h
             {state.vertical === 'datacenter' && <Lock className="w-3 h-3" />}
          </span>
        </label>
        <input
          type="range"
          min="1"
          max="24"
          value={state.hours_per_day}
          onChange={(e) => updateInput('hours_per_day', Number(e.target.value))}
          disabled={state.vertical === 'datacenter'}
          className={`w-full accent-blue-600 ${state.vertical === 'datacenter' ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      </div>

      {/* AC Count */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Número de Aires Acondicionados:
        </label>
        <input
          type="number"
          min="1"
          max="50"
          value={state.ac_count}
          onChange={(e) => updateInput('ac_count', Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tariff */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Tarifa ($/kWh):
        </label>
        <input
          type="number"
          step="0.1"
          value={state.tariff}
          onChange={(e) => updateInput('tariff', Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Temperature */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Temperatura habitual: <span className="font-bold text-blue-600">{state.current_temp_setting}°C</span>
        </label>
        <input
          type="range"
          min="16"
          max="30"
          value={state.current_temp_setting}
          onChange={(e) => updateInput('current_temp_setting', Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <p className="text-xs text-gray-500">
          Cada grado abajo de 24°C aumenta el consumo un 5%.
        </p>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-semibold text-blue-900 mb-2">Resultados Estimados</h3>
        <div className="space-y-1 text-sm text-blue-800">
          <p>Gasto Mensual Actual: <span className="font-bold">${state.monthly_spend_current.toFixed(2)}</span></p>
          <p>Ahorro Estimado con Cuby: <span className="font-bold text-green-600">${state.monthly_savings_cuby.toFixed(2)}</span></p>
          <p>Retorno de Inversión (ROI): <span className="font-bold">{state.roi_months.toFixed(1)} meses</span></p>
        </div>
      </div>
    </div>
  );
}
