import { anthropic } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // 1. Check API Key Availability
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("CRITICAL: ANTHROPIC_API_KEY is missing from environment variables.");
      return new Response(JSON.stringify({ error: "Configuration Error", details: "API Key missing on server." }), { status: 500 });
    }
    console.log("DEBUG: API Key found (length: " + apiKey.length + ")");

    const { messages, calculatorState } = await req.json();

    console.log("DEBUG: Incoming Chat Request");
    console.log("DEBUG: Calculator State:", JSON.stringify(calculatorState, null, 2));
    console.log("DEBUG: Raw messages (UIMessage format):", JSON.stringify(messages, null, 2));

    // CRITICAL FIX: Convert UIMessages to ModelMessages
    // Frontend useChat sends UIMessage format (with parts, id, etc.)
    // Backend streamText expects ModelMessage format (with content only)
    const modelMessages = convertToModelMessages(messages);
    console.log("DEBUG: Converted messages (ModelMessage format):", JSON.stringify(modelMessages, null, 2));

    const vertical = calculatorState?.vertical || 'home';
    let verticalContext = "";

    if (vertical === 'hotel') {
      verticalContext = `
      **Vertical: HOTEL**
      - **Focus:** Preventing guest abuse (leaving AC on when out), auto-off features, and centralized management.
      - **Key Benefit:** "Stop cooling empty rooms."
      - **Tone:** Professional, business-oriented.
      `;
    } else if (vertical === 'datacenter') {
      verticalContext = `
      **Vertical: DATA CENTER**
      - **Focus:** Safety, high-temp alerts, redundancy, and protecting critical hardware.
      - **Key Benefit:** "Prevent downtime and equipment failure."
      - **Constraint:** DO NOT talk about "comfort" or "sleeping well". Servers don't sleep. Talk about uptime and reliability.
      - **Tone:** Technical, critical, reliable.
      `;
    } else if (vertical === 'school') {
      verticalContext = `
      **Vertical: SCHOOL**
      - **Focus:** "Mass Turn-Off" (end of day), "Temperature Limits" (preventing students from setting 16°C), and "Hard Schedules".
      - **Key Benefit:** "Control energy waste in classrooms automatically."
      - **Tone:** Administrative, organized, responsible.
      `;
    } else {
      verticalContext = `
      **Vertical: HOME**
      - **Focus:** Comfort, monthly bill savings, and convenience (app control).
      - **Key Benefit:** "Save money without sacrificing comfort."
      - **Tone:** Friendly, helpful.
      `;
    }

    const systemPrompt = `
      # ROLE
      You are "CubyBot", an expert energy consultant for Cuby.mx.
      You are talking to a potential customer in **Mexico**.
      **Language:** Spanish (Mexico).

      # TONE
      Professional, helpful, concise, and persuasive.
      ${verticalContext}

      # CATALOGO DE PRODUCTOS CUBY
      Usa esta información para recomendar el producto adecuado:

      1. **Cuby G4** (Producto Estrella)
         - **Qué es:** Control inteligente WiFi para minisplits (cualquier marca).
         - **Funciones:** Control por App/Voz (Alexa, Google), Programación, Gráficas de consumo.
         - **Link:** https://cuby.mx/products/cuby-g4

      2. **Cuby G4 Pro**
         - **Diferencia:** Igual al G4 + **Sensor de Ruido** integrado.
         - **Uso ideal:** Hoteles y Airbnb (monitorea fiestas/ruido excesivo).
         - **Link:** https://cuby.mx/products/cuby-g4-pro

      3. **Cuby Aria**
         - **Qué es:** Termostato inteligente de pared (reemplaza controles viejos).
         - **Uso ideal:** Oficinas, Edificios, Fan & Coil, Equipos Paquete.
         - **Variantes:** Aria IR (infrarrojo), Aria 24V (sistemas centrales).

      4. **Sensores de Ahorro (Accesorios)**
         - **Cuby Blue (Bee):** Sensor de puertas/ventanas. Apaga el aire si abren la ventana.
         - **Cuby Sentry:** Sensor de movimiento. Apaga el aire si la habitación está vacía.

      5. **Seguridad y Gas**
         - **Cuby Helios:** Medidor de nivel de Gas LP para tanque estacionario + Alarma de fugas.
         - **Cuby Protect:** Alarma de fugas de gas y monóxido de carbono (CO).

      # INSTRUCTIONS
      1. **Analyze Context:** You have access to the user's calculator inputs (Usage hours, Spending). Use this data aggressively to personalize your advice.
         - Example: "Veo que gastas $3000 al mes. Con Cuby podrías ahorrar $900."
      2. **Goal:** Convince the user to buy the **Cuby G4**.
      3. **Safety:** Do not invent prices other than the approximate $2,500 MXN.
      4. **Format:** Keep responses short (max 3 sentences) unless asked for a detailed explanation. Use Markdown for bolding key savings numbers.

      # CURRENT USER CONTEXT
      - Vertical: ${vertical}
      - Hours of Usage per Day: ${calculatorState?.hours_per_day || 'Unknown'} hours
      - Number of ACs: ${calculatorState?.ac_count || 'Unknown'}
      - Electricity Tariff: $${calculatorState?.tariff || '3.0'} MXN/kWh
      - Current Temp Setting: ${calculatorState?.current_temp_setting || 'Unknown'}°C
      - Estimated Monthly Spend: $${calculatorState?.monthly_spend_current?.toFixed(2) || '0.00'} MXN
      - Potential Savings with Cuby: $${calculatorState?.monthly_savings_cuby?.toFixed(2) || '0.00'} MXN
      - ROI (Return on Investment): ${calculatorState?.roi_months?.toFixed(1) || '0.0'} months
    `;

    // 2. Attempt Stream with Anthropic Claude Haiku 3.5
    const result = streamText({
      model: anthropic('claude-3-5-haiku-20241022'),
      system: systemPrompt,
      messages: modelMessages, // Use converted ModelMessages
    });

    // 3. Return Response (using toUIMessageStreamResponse for AI SDK v5)
    // CRITICAL: Use toUIMessageStreamResponse() for useChat compatibility
    // This creates a UI Message stream HTTP response for Next.js App Router
    return result.toUIMessageStreamResponse();
    
  } catch (error: any) {
    console.error("═══════════════════════════════════════");
    console.error("CRITICAL BACKEND ERROR");
    console.error("═══════════════════════════════════════");
    console.error("Error Type:", error.constructor.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);

    // Log the full error object for debugging
    if (error.cause) {
      console.error("Error Cause:", JSON.stringify(error.cause, null, 2));
    }
    if (error.prompt) {
      console.error("Invalid Prompt:", JSON.stringify(error.prompt, null, 2));
    }

    // Extract meaningful error message
    const errorMessage = error.message || "Unknown error occurred";
    const errorType = error.constructor.name || "Error";

    // Return proper error response
    return new Response(JSON.stringify({
        error: "Chat request failed",
        type: errorType,
        message: errorMessage,
        details: "Check server logs for full error details"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'X-Error-Type': errorType
      },
    });
  }
}
