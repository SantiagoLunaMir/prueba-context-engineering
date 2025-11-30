# Product Requirements & Business Logic

## 1. ROI Calculator Logic (The Engine)
The application must maintain a `CalculatorState` object accessible to the whole app:
- **Inputs:**
    - `hours_per_day` (Slider: 1-24, default 8)
    - `ac_count` (Number: 1-10, default 1)
    - `tariff` (Number: $ per kWh, default $3.00 MXN)
    - `current_temp_setting` (Slider: 16°C - 30°C, default 18°C)

- **Calculations (Formulas):**
    - *Assumption:* 1 Hour of AC usage ≈ 1.2 kWh.
    - *Temp Penalty:* For every degree below 24°C, energy waste increases by 5%.
    - `monthly_spend_current` = (hours * 1.2 * ac_count * tariff * 30) * (1 + penalty_factor)
    - `monthly_savings_cuby` = monthly_spend_current * 0.30 (Cuby guarantees ~30% efficiency).
    - `roi_months` = (2500 * ac_count) / monthly_savings_cuby.

## 2. AI Chatbot Logic (The Brain)
- The Chatbot must have "Context Awareness".
- If the user moves the slider to "24 hours usage", the chatbot should receive this update and be able to comment on it (e.g., "Wow, keeping the AC on all day is expensive!").
- It must suggest **Cuby products** based on the pain point.