"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup"; // Ensure consistent file naming
import Prompt from "@/data/Prompt"; // Import Prompt
import { MessagesContext } from "@/context/MessagesContext";
import axios from 'axios';

const CodeView = () => {
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(() => {
    // Try to load saved files from localStorage
    if (typeof window !== 'undefined') {
      const savedFiles = localStorage.getItem('codeFiles');
      if (savedFiles) {
        try {
          return JSON.parse(savedFiles);
        } catch (e) {
          console.error('Error parsing saved files:', e);
        }
      }
    }
    // Default files if no saved state exists
    return {
      "/App.js": {
        code: `import React from 'react'
import './styles.css'

function App() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  )
}

export default App`
      },
      "/styles.css": {
        code: `/* Add your styles here */`
      },
      "/index.html": {
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.jsx"></script>
  </body>
</html>`
      },
      "/main.jsx": {
        code: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`
      }
    };
  });
  const { messages, setMessages } = useContext(MessagesContext);
  const [isClient, setIsClient] = useState(false);

  // Save files to localStorage whenever they change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('codeFiles', JSON.stringify(files));
    }
  }, [files, isClient]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (messages?.length > 0) {   
      const role = messages[messages.length - 1].role;
      if (role === 'user') {
        GenarateAiCode();
      }
    }
  }, [messages]);

  const GenarateAiCode = async () => {
    try {
      const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
      console.log("Sending prompt:", PROMPT);
      
      const result = await axios.post('/api/gen-ai-code', {
        prompt: PROMPT,
      });

      if (!result.data) {
        throw new Error("No response received from API");
      }

      if (result.data.error) {
        throw new Error(result.data.error);
      }

      console.log("Raw AI response received:", result.data);

      const aiResp = result.data;

      if (!aiResp || typeof aiResp !== "object") {
        throw new Error("Invalid response format from AI");
      }

      console.log("Parsed AI response:", aiResp);

      // Create a new files object starting with the existing files
      const mergedFiles = { ...files };

      // Update files with AI response
      if (aiResp.files) {
        Object.entries(aiResp.files).forEach(([filePath, fileContent]) => {
          // Skip src/ prefixed files
          if (filePath.startsWith('/src/')) {
            return;
          }

          // Update the file with unescaped code
          if (fileContent.code) {
            // Convert escaped code back to normal format
            const unescapedCode = fileContent.code
              .replace(/\\n/g, '\n')   // Convert escaped newlines
              .replace(/\\r/g, '\r')   // Convert escaped carriage returns
              .replace(/\\t/g, '\t')   // Convert escaped tabs
              .replace(/\\"/g, '"')    // Convert escaped quotes
              .replace(/\\\\/g, '\\'); // Convert escaped backslashes

            mergedFiles[filePath] = {
              code: unescapedCode
            };
          }
        });
      }

      // Always preserve main.jsx and index.html
      mergedFiles['/main.jsx'] = files['/main.jsx'];
      mergedFiles['/index.html'] = files['/index.html'];

      // Ensure all required components exist
      const requiredComponents = ['TodoForm', 'TodoList', 'Filter'];
      requiredComponents.forEach(component => {
        if (!mergedFiles[`/components/${component}.jsx`]) {
          mergedFiles[`/components/${component}.jsx`] = {
            code: `import React from 'react';\n\nexport default function ${component}() {\n  return (\n    <div>\n      {/* ${component} component */}\n    </div>\n  );\n}`
          };
        }
      });

      console.log("Final files object:", mergedFiles);
      setFiles(mergedFiles);

      // Add success message
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Code has been updated successfully! You can now see the changes in the code editor.",
        },
      ]);
    } catch (error) {
      console.error('Error generating AI response:', {
        message: error?.message || "Unknown error occurred",
        response: error?.response?.data,
        status: error?.response?.status,
        stack: error?.stack
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: error?.response?.data?.error || error?.message || "An error occurred while generating the code. Please try again later.",
        },
      ]);
    }
  };

  return (
    <div className="w-full">
      {/* Top bar with toggle buttons */}
      <div className="bg-black w-full p-2 border">
        <div className="flex items-center flex-wrap bg-black p-1 gap-3">
          {/* Code Button */}
          <button
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer px-3 py-1 rounded transition-colors duration-300 
              ${
                activeTab === "code"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-white hover:text-blue-400"
              }
            `}
          >
            Code
          </button>

          {/* Preview Button */}
          <button
            onClick={() => setActiveTab("preview")}
            className={`text-sm cursor-pointer px-3 py-1 rounded transition-colors duration-300 
              ${
                activeTab === "preview"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-white hover:text-blue-400"
              }
            `}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Sandpack Area */}
      {isClient && (
        <SandpackProvider
          files={files}
          template="react"
          theme="dark"
          customSetup={{
            dependencies: {
              ...Lookup.DEPENDANCY,
              // Optionally include devDependencies if needed in the preview environment:
              // ...Lookup.DEPENDANCY.devDependencies,
            },
          }}
          options={{
            externalResources: ['https://cdn.tailwindcss.com'],
          }}
        >
          {/* Conditionally show the code or the preview based on activeTab */}
          {activeTab === "code" && (
            <SandpackLayout className="h-[80vh] flex flex-col md:flex-row">
              <SandpackFileExplorer style={{ height: "80vh", minWidth: "180px" }} />
              <SandpackCodeEditor style={{ height: "80vh", width: "100%" }} />
            </SandpackLayout>
          )}

          {activeTab === "preview" && (
            <SandpackLayout className="h-[80vh]">
              <SandpackPreview style={{ height: "80vh", width: "100%" }} showNavigator={true} />
            </SandpackLayout>
          )}
        </SandpackProvider>
      )}
    </div>
  );
};

export default CodeView;
