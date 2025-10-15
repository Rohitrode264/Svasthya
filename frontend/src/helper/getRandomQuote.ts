const healthQuotes: string[] = [
    "Take care of your body — it's the only place you have to live.",
    "Healing is not just about the body; it’s about the mind and the spirit too.",
    "Small steps every day lead to big changes over time.",
    "Your health is your greatest wealth — nurture it with love.",
    "Rest when you need to. Your body is your most loyal companion.",
    "Wellness is the natural state of our being — return to it gently.",
    "You are stronger than the storm you’re facing.",
    "Each sunrise is another chance to care for yourself with kindness.",
    "Medicine can heal the body, but hope and love heal the heart.",
    "Progress, not perfection — your journey to health is uniquely yours.",
    "Listen to your body; it whispers before it ever needs to shout.",
    "Taking your medication is an act of self-respect, not just routine.",
    "Even on your hardest days, your effort counts. Keep showing up for yourself.",
    "The best project you’ll ever work on is you.",
    "Healthy habits are a form of self-love practiced daily.",
    "Every small act of care adds up — your consistency matters.",
    "Rest, breathe, and trust that healing takes time.",
    "Don’t just add years to your life, add life to your years.",
    "Your story of resilience will inspire others — even if you don’t see it yet.",
    "Caring for yourself is not selfish; it’s essential."
  ];
  
  export const getRandomQuote = (): string => {
    return healthQuotes[Math.floor(Math.random() * healthQuotes.length)];
  };
  