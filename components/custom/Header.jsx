import React, { useContext } from 'react'; // Import useContext from React
import Image from 'next/image';
import { Button } from '../ui/button'; // Ensure Button is correctly imported
import { UserDetailContext } from '@/context/UserDetailContext';

const Header = () => {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  return (
    <div className='p-4 flex justify-between items-center'>
      <Image src={'/logo.jpg'} alt="Logo" width={40} height={40} />
      {userDetail?.name && <div className='flex gap-5'>
        <Button variant={"ghost"}>Sign In</Button>
        <Button className='bg-red-600 hover:bg-red-700 transition-transform transform hover:scale-105' style={{ backgroundColor: 'darkred', color: 'white' }}>Get Started</Button>
      </div>}
    </div>
  );
};

export default Header;