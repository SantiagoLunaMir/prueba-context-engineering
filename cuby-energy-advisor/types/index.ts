export interface CalculatorInputs {
  hours_per_day: number;
  ac_count: number;
  tariff: number;
  current_temp_setting: number;
}

export interface CalculatorResults {
  monthly_spend_current: number;
  monthly_savings_cuby: number;
  roi_months: number;
}

export interface CalculatorState extends CalculatorInputs, CalculatorResults {}

export interface CalculatorContextType {
  state: CalculatorState;
  updateInput: (key: keyof CalculatorInputs, value: number) => void;
}
