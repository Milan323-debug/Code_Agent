"use client";
import React, { useEffect, useContext, useState } from 'react'; // Combine imports from 'react'
import { UserDetailContext } from '@/context/UserDetailContext';
import { useConvex } from 'convex/react';
import { useSidebar } from '../ui/sidebar';
import Link from 'next/link';

const WorkspaceHistory = () => {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const convex = useConvex();
  const [workspaceList, setWorkspaceList] = useState([]);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    userDetail && GetAllWorkspace();
  }, [userDetail]);

  const GetAllWorkspace = async () => {
    const result = await convex.query(api.workspace.GetAllWorkspace, { userId: userDetail?._id });
    setWorkspaceList(result);
    console.log(result);
  };

  return (
    <div>
      <h2 className='font-medium text-lg'>Your Charts</h2>
      <>
        {workspaceList &&
          workspaceList.map((workspace, index) => (
            <Link href={"/workspace/" + workspace?._id} key={index}>
              <h2
                onClick={toggleSidebar}
                className='text-sm text-gray-400 mt-2 font-light cursor-pointer hover:text-white'
              >
                {workspace?.messages[0]?.content}
              </h2>
            </Link>
          ))}
      </>
    </div>
  );
};

export default WorkspaceHistory;