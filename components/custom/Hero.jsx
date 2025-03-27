"use client"
import React, { useState, useContext, useEffect } from 'react';
import Lookup from '@/data/Lookup'; // Ensure consistent file naming
import { ArrowRight, Link } from 'lucide-react';
import Colors from '@/data/Colors';
import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import SignInDialog from './SignInDialog';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

const Hero = () => {
  const [userInput, setUserInput] = useState('');
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.createWorkspace);
  const router = useRouter();

  const onGenerate = async (input) => {
    if (!userDetails?.name) {
      setOpenDialog(true);
      return;
    }
    const msg = {
      role: "user",
      content: input
    }
    setMessages(msg);

    try {
      const workspaceId = await CreateWorkspace({
        user: userDetails._id,
        messages: [msg]
      });
      console.log("Workspace ID:", workspaceId);
      if (workspaceId) {
        router.push('/workspace/' + workspaceId);
      } else {
        console.error("Failed to create workspace");
      }
    } catch (error) {
      console.error("Failed to create workspace:", error.message, error);
    }
  };

  return (
    <div className='flex flex-col items-center mt-36 xl:mt-52 gap-2'>
      <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center animate-fade-in">
        {Lookup.HERO_HEADING}
      </h2>
      <p className='text-gray-400 font-medium text-center animate-fade-in'>
        {Lookup.HERO_DESC}
      </p>
      <div
        className="p-5 border rounded-xl max-w-2xl w-full mt-3 shadow-lg transition-transform transform hover:scale-105"
        style={{ backgroundColor: Colors.BACKGROUND }}
      >
        <div className='flex items-center gap-2 mt-4'>
          <textarea
            placeholder={Lookup.INPUT_PLACEHOLDER}
            onChange={(event) => setUserInput(event.target.value)}
            className='outline-none bg-transparent w-full h-32 rounded-md max-h-56 resize-none p-2 border border-gray-300 focus:border-blue-500 transition-colors'
          />
          {userInput && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className='bg-red-900 p-2 h-10 w-15 rounded-md cursor-pointer hover:bg-red-700 transition-colors'
            />
          )}
        </div>
        <div className='flex justify-end mt-2'>
          <Link className='h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors' />
        </div>
      </div>
      <div className='flex mt-8 flex-wrap max-w-2xl items-center justify-center gap-3'>
        {Lookup?.SUGGSTIONS?.map((suggestion, index) => (
          <h2
            key={index}
            onClick={() => onGenerate(suggestion)}
            className='p-1 px-2 border border-gray-400 rounded-md text-sm text-gray-400 hover:text-white hover:bg-gray-600 cursor-pointer transition-colors'
          >
            {suggestion}
          </h2>
        ))}
      </div>
      <SignInDialog openDialog={openDialog} closeDialog={(v) => setOpenDialog(v)} />
    </div>
  );
};

export default Hero;