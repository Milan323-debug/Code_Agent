import React from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { MessageCircleCode } from 'lucide-react';
import WorkspaceHistory from './WorkspaceHistory';
import Image from 'next/image';
import { Button } from '@/components/ui/button'; // Import the Button component

const AppSideBar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="p-5" />
      <Image src={"/logo.jpg"} alt="Logo" width={30} height={30} />
      <Button className="mt-5">
        <MessageCircleCode /> Start New chart
      </Button>

      <SidebarHeader />
      <SidebarContent className="p-5">
        <SidebarGroup />
        <WorkspaceHistory />
        <SidebarGroup />
        {/* <SidebarGroup /> */}
      </SidebarContent>
      <SidebarFooter />
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSideBar;