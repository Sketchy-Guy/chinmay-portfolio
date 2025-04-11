
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createClient } from '@supabase/supabase-js';

// Create a storage bucket for profile images first time the app loads
const initializeStorage = async () => {
  const SUPABASE_URL = "https://lvjfqefqrmgzwkhtknbj.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2amZxZWZxcm1nendraHRrbmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNzU5NDksImV4cCI6MjA1OTc1MTk0OX0.2Tb29dHS4Gc3dL9KceXCc8UlRlLhg7U-m_gKFpVSL5Q";
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  try {
    // Check if the bucket already exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const portfolioBucket = buckets?.find(bucket => bucket.name === 'portfolio');
    
    if (!portfolioBucket) {
      // Create bucket if it doesn't exist
      await supabase.storage.createBucket('portfolio', {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      });
      console.log('Portfolio storage bucket created');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Initialize storage before mounting the app
initializeStorage().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
