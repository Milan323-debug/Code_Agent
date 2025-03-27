"use client";
import React from 'react';
import { ConvexReactClient, ConvexProvider } from 'convex/react';

const CustomConvexClientProvider = ({ children }) => {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  return (
    <ConvexProvider client={convex}>{children}</ConvexProvider>
  );
};

export default CustomConvexClientProvider;