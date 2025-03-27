import Hero from "@/components/custom/Hero";
import Workspace from "@/components/custom/Workspace";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto px-4 min-h-screen">
      <Hero />
      <Workspace />
    </div> 
  );
}