"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { CalculatorInputs, CalculatorState, CalculatorContextType, VerticalType } from '../types';

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

const DEFAULT_INPUTS: CalculatorInputs = {
  vertical: 'home',
  hours_per_day: 8,
  ac_count: 1,
  tariff: 3.00,
  current_temp_setting: 18,
};

export const CalculatorProvider = ({ children }: { children: ReactNode }) => {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);

  // Calculation Logic
  const results = useMemo(() => {
    const { hours_per_day, ac_count, tariff, current_temp_setting } = inputs;

    // 1. Calculate Temp Penalty
    // "For every degree below 24°C, energy waste increases by 5%."
    const baseline_temp = 24;
    let penalty_factor = 0;
    
    if (current_temp_setting < baseline_temp) {
      const degrees_below = baseline_temp - current_temp_setting;
      penalty_factor = degrees_below * 0.05;
    }

    // 2. Calculate Monthly Spend (Current)
    // "1 Hour of AC usage ≈ 1.2 kWh"
    const kwh_per_hour = 1.2;
    const days_in_month = 30;
    
    const base_kwh_monthly = hours_per_day * kwh_per_hour * days_in_month * ac_count;
    const total_kwh_monthly = base_kwh_monthly * (1 + penalty_factor);
    
    const monthly_spend_current = total_kwh_monthly * tariff;

    // 3. Calculate Savings with Cuby
    // "monthly_spend_current * 0.30"
    const monthly_savings_cuby = monthly_spend_current * 0.30;

    // 4. Calculate ROI
    // "roi_months = (2500 * ac_count) / monthly_savings_cuby"
    const cuby_unit_price = 2500;
    const total_investment = cuby_unit_price * ac_count;
    
    // Avoid division by zero
    const roi_months = monthly_savings_cuby > 0 
      ? total_investment / monthly_savings_cuby 
      : 0;

    return {
      monthly_spend_current,
      monthly_savings_cuby,
      roi_months,
    };
  }, [inputs]);

  const updateInput = (key: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const setVertical = (vertical: VerticalType) => {
    setInputs(prev => {
      let newInputs = { ...prev, vertical };
      if (vertical === 'home') {
        newInputs = { ...newInputs, hours_per_day: 8, ac_count: 1, tariff: 3.00 };
      } else if (vertical === 'hotel') {
        newInputs = { ...newInputs, hours_per_day: 12, ac_count: 10, tariff: 4.00 };
      } else if (vertical === 'datacenter') {
        newInputs = { ...newInputs, hours_per_day: 24, ac_count: 2, tariff: 4.50 };
      } else if (vertical === 'school') {
        newInputs = { ...newInputs, hours_per_day: 9, ac_count: 20, tariff: 3.50 };
      }
      return newInputs;
    });
  };

  const state: CalculatorState = {
    ...inputs,
    ...results,
  };

  return (
    <CalculatorContext.Provider value={{ state, updateInput, setVertical }}>
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculatorStore = () => {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculatorStore must be used within a CalculatorProvider');
  }
  return context;
};
