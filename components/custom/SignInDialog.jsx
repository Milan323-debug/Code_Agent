import React, { useContext } from "react";
import Lookup from "@/data/lookup";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { UserDetailContext } from '@/context/UserDetailContext'; // Import UserDetailContext
import { useGoogleLogin } from '@react-oauth/google'; // Import useGoogleLogin
import axios from 'axios'; // Import axios
import { useMutation } from 'convex/react'; // Import useMutation
import { api } from '@/convex/_generated/api'; // Import api


const SignInDialog = ({ openDialog, closeDialog }) => {
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const CreateUser = useMutation(api.user.createUser);

  const googleLogin = useGoogleLogin({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY, // Use clientId from environment variables
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: 'Bearer ' + tokenResponse?.access_token } },
      );

      console.log(userInfo);
      const user = userInfo.data;
      await CreateUser({ name: user?.name, email: user?.email, picture: user?.picture, uid: user?.sub });
      
      if(typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
      }
      setUserDetails(userInfo?.data);
      //save this inside out database
      closeDialog(false);
    },
    onError: errorResponse => console.log(errorResponse),
  });

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="flex flex-col items-center justify-center gap-3">
            <h2 className="font-bold text-2xl text-center text-white">{Lookup.SIGNIN_HEADING}</h2>
            <p className='mt-2 text-center text-lg'>{Lookup.SIGNIN_SUBHEADING}</p>
            <Button className="bg-red-800 text-white hover:bg-red-500 mt-3" onClick={googleLogin}>Sign In with Google</Button>
            <p>{Lookup.SIGNIn_AGREEMENT_TEXT}</p>
          </div>
        </DialogDescription>
        <DialogFooter>
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
