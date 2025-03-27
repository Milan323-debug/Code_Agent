import dedent from 'dedent';

export default {
  SUGGSTIONS: [
    'Create TODO APP in React',
    'Create a Budget Track App',
    'Create a Blog App',
    'Create a E-commerce App',
    'Create a Social Media App',
    'Create a Chat App',
    'Create a Video Streaming App',
    'Create a Music Streaming App',
    'Create a Food Delivery App',
    'Create a Fitness App',
    'Create a Weather App',
    'Create a News App',
    'Create a Stock Market App',
    'Create a Cryptocurrency App',
    'Create a Job Portal App',
    'Create a Dating App',
    'Create a Travel App',
    'Create a Learning App',
    'Create a Quiz App',
    'Create a Survey App',
    'Create a Poll App',
    'Create a Feedback App',
    'Create a Review App',
    'Create a Rating App',
    'Create a Comment App',
    'Create a Notification App',
    'Create a Reminder App',
    'Create a Calendar App',
    'Create a Timer App',
    'Create a Stopwatch App',
    'Create a Countdown App',
    'Create a Alarm App',
    'Create a Clock App',
    'Create a Calculator App',
    'Create a Converter App',
    'Create a Translator App',
    'Create a Dictionary App',
    'Create a Thesaurus App',
    'Create a Encyclopedia App',
    'Create a Wiki App',
    'Create a Search Engine App',
    'Create a Browser App',
    'Create a Email App',
    'Create a Chat App',
    'Create a Video Call App',
    'Create a Voice Call App',
    'Create a Messaging App',
    'Create a Social Media App',
    'Create a Blog App',
    'Create a Forum App',
    'Create a Community App',
    'Create a Group App',
    'Create a Team App',
    'Create a Project Management App',
    'Create a Task Management App',
    'Create a Time Management App',
    'Create a Goal Management App',
    'Create a Habit Tracking App',
    'Create a Mood Tracking App',
    'Create a Sleep Tracking App',
    'Create a Fitness Tracking App',
    'Create a Health Tracking App',
    'Create a Diet Tracking App',
    'Create a Water Tracking App',
    'Create a Medication Tracking App',
    'Create a Symptom Tracking App',
    'Create a Period Tracking App',
    'Create a Pregnancy Tracking App',
    'Create a Baby Tracking App',
    'Create a Pet Tracking App',
    'Create a Plant Tracking App',
    'Create a Car Tracking App',
    'Create a Bike Tracking App',
    'Create a Walk Tracking App',
    'Create a Run Tracking App',
    'Create a Hike Tracking App',
    'Create a Swim Tracking App',
    'Create a Bike Tracking App',
  ],
  HERO_HEADING: "What you want to build?",
  HERO_DESC: "Prompt,run, edit deploy full stack webpages",
  SIGNIN_HEADING: 'Continue With Codient',
  SIGNIN_SUBHEADING: ' To use Codient, you need to sign in with your Codient account.',
  SIGNIn_AGREEMENT_TEXT: 'By signing in, you agree to our Terms of Service and Privacy Policy.',

  DEFAULT_FILE: {
    '/public/index.html': {
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
    },
    '/App.css': {
      code: `@tailwind base;
@tailwind components;
@tailwind utilities;`
    },
    '/tailwind.config.js': {
      code: `
                /** @type {import('tailwindcss').Config} */
                module.exports = {
                  content: [
                    "./src/**/*.{js,jsx,ts,tsx}",
                  ],
                  theme: {
                    extend: {},
                  },
                  plugins: [],
                }`
    },
    '/postcss.config.js': {
      code: `
                /** @type {import('postcss-load-config').Config} */
    const config = {
      plugins: {
        tailwindcss: {},
      },
    };
export default config;`
    },
    '/App.js': {
      overwrite: true, // Add this flag to indicate the file should always be overwritten
      code: `
import React from 'react';

function App() {
  return (
    <div className="App">
      <h1>Your React Application</h1>
    </div>
  );
}

export default App;
      `
    }
  },
  DEPENDANCY: {  
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    autoprefixer: "^10.0.0",
    "uuid4": "^2.0.3",
    "tailwind-merge": "^2.4.0",
    "tailwindcss-animate": "^1.0.7",
    "lucide-react": "latest",
    "react-router-dom": "latest",
    "firebase": "^11.1.0",
    "@google/generative-ai": "^0.21.0",
    "axios": "^1.3.0",        
    "framer-motion": "^10.0.0"        
  },
};
