"use client";

import { useCalculatorStore } from '@/context/CalculatorContext';

export default function CalculatorPanel() {
  const { state, updateInput } = useCalculatorStore();

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800">Calculadora de Ahorro</h2>
      
      {/* Hours per Day */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Horas de uso al día: <span className="font-bold text-blue-600">{state.hours_per_day}h</span>
        </label>
        <input
          type="range"
          min="1"
          max="24"
          value={state.hours_per_day}
          onChange={(e) => updateInput('hours_per_day', Number(e.target.value))}
          className="w-full accent-blue-600"
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
          max="10"
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
