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

## 3. Customer Profiles (Verticals)
The calculator must allow selecting a "Profile":

1.  **Home (Residential):**
    * *Focus:* Comfort & Monthly Bills.
    * *Defaults:* 8 Hours/day, 1-3 ACs, Tariff $3.00.
    * *Pain Point:* "High bills in summer."

2.  **Hotel / Airbnb (Hospitality):**
    * *Focus:* Guest Management & Waste.
    * *Defaults:* 12 Hours/day (Guests leave AC on), 10-50 ACs, Tariff $4.00 (Commercial).
    * *Pain Point:* "Guests leave the AC on when they leave the room."
    * *Cuby Solution:* "Auto-off when room is empty (Motion sensors)."

3.  **Data Center / Server Room (Critical):**
    * *Focus:* Uptime, Redundancy, Heat Alerts.
    * *Defaults:* 24 Hours/day (Mandatory), 2-5 ACs (Redundancy), Tariff $4.50.
    * *Pain Point:* "If AC fails, servers melt."
    * *Cuby Solution:* "Real-time alerts to your phone if temp > 26°C."

4.  **School / University (Education):**
    * *Focus:* Scheduling & Centralized Control.
    * *Defaults:* 9 Hours/day (7 AM - 4 PM), 20-100 ACs, Tariff $3.50.
    * *Pain Point:* "Teachers forget to turn off ACs after class. Holidays waste energy."
    * *Cuby Solution:* "Hard Schedules (Force OFF at 4 PM) and Remote Lock (prevent students from changing temp)."