"use client"
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useConvex, useMutation } from 'convex/react'; // Import useMutation
import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup'; // Ensure consistent file naming
import Image from 'next/image';
import { ArrowRight, Link, Loader2Icon } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useSidebar } from '@/components/ui/sidebar'; // Import useSidebar

const ChatView = () => {
  const { id } = useParams();
  const convex = useConvex();
  const { userDetail } = useContext(UserDetailContext);
  const { messages, setMessages } = useContext(MessagesContext);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const UpdateMessagess = useMutation(api.workspace.UpdateMessages);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    if (id && id !== "null") {
      GetWorkspaceData();
    }
  }, [id]);

  const GetWorkspaceData = async () => {
    if (id && id !== "null") {
      const result = await convex.query(api.workspace.GetWorkspace, { workspaceId: id });
      setMessages(Array.isArray(result?.messages) ? result.messages : []);
      console.log(result);
    }
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages.length - 1].role;
      if (role === 'user') {
        GetAiResponse();
      }
    }
  }, [messages]);

  const GetAiResponse = async () => {
    try {
      setLoading(true);
      const PROMPT = JSON.stringify(messages) + Lookup.CHAT_PROMPT;
      
      console.log("Sending request to AI chat API...");
      const result = await axios.post('/api/ai-chat', {
        prompt: PROMPT
      });
      
      if (result.data.error) {
        throw new Error(result.data.error);
      }

      if (!result.data.result) {
        throw new Error("No response received from AI");
      }

      const aiResp = {
        role: 'ai',
        content: result.data.result
      }
      
      setMessages(prev => [
        ...prev, aiResp
      ]);
      
      await UpdateMessagess({ workspaceId: id, messages: [...messages, aiResp] });
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      let errorMessage = 'Sorry, I encountered an error while generating the response.';
      
      if (error.response?.status === 401) {
        errorMessage = 'API key error. Please check your environment variables.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setMessages(prev => [
        ...prev, {
          role: 'ai',
          content: errorMessage
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onGenerate = async (input) => {
    // Add your onGenerate logic here
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setUserInput('');
  };

  return (
    <div className='relative h-[85vh] flex flex-col'>
      <div className='flex-1 overflow-y-scroll scrollbar-hide px-5'>
        {Array.isArray(messages) &&
          messages.map((message, index) => (
            <div
              key={index}
              className='p-3 rounded-lg mb-2'
              style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
            >
              {message?.role === 'user' && userDetail?.picture && (
                <Image
                  src={userDetail.picture}
                  alt="userImage"
                  width={35}
                  height={35}
                  className='rounded-full'
                />
              )}
              {/* Render markdown content to remove extra asterisks */}
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ))}
        {loading && (
          <div
            className='p-3 rounded-lg mb-2 flex gap-2 items-center'
            style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
          >
            <Loader2Icon className='animate-spin' />
            <h2>Generating Response.....</h2>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className='flex gap-2 items-end '>
       {userDetail && <Image src= {userDetail?.picture} alt="user" width={30} height={30} className='rounded-full cursor-pointer'
       onClick={toggleSidebar} />}
      </div>
      <div
        className="p-5 border rounded-xl max-w-2xl w-full mt-3 shadow-lg transition-transform transform hover:scale-105"
        style={{ backgroundColor: Colors.BACKGROUND }}
      >
        <div className='flex items-center gap-2 mt-4'>
          <textarea
            placeholder={Lookup.INPUT_PLACEHOLDER}
            value = {userInput}
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
    </div>
  )
}

export default ChatView;
