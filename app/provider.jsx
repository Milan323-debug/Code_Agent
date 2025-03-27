"use client";
import React, { useState, useEffect } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import Header from '@/components/custom/Header';
import { MessagesContext } from '../context/MessagesContext';
import { UserDetailContext } from '../context/UserDetailContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Sidebar } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSideBar from '@/components/custom/AppSideBar';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

function Provider({ children }) {
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    IsAuthenticated();
  }, []);

  const IsAuthenticated = async () => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.email) { // Ensure email is present before making the query
        const result = await convex.query(api.user.GetUser, { email: user.email });
        setUserDetails(result);
        console.log(result);
      } else {
        console.error("User email is missing in localStorage.");
      }
    }
  };

  return (
    <div>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}>
        <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <ConvexProvider client={convex}>
              <NextThemesProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                <Header />
                <SidebarProvider defaultOpen={false}>
                  <AppSideBar />
                  {children}
                </SidebarProvider>
              </NextThemesProvider>
            </ConvexProvider>
          </MessagesContext.Provider>
        </UserDetailContext.Provider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default Provider;