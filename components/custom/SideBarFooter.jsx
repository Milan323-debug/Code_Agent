import { HelpCircle, Wallet } from 'lucide-react'
import React from 'react'

const SideBarFooter = () => {
    const options= [
        {
        name: "Settings",
        icon: Settings
    },
    {
        name: "Help & Support",
        icon: HelpCircle
    },
    {
        name: "MySubscriptions",
        icon: Wallet
    },
    {
        name: "Sign Out",
        icon: LogOut
    }
]
  return (
    <div className='p-2 mb-10'>
        {options.map((option,index) => (
           <Button varient = "ghost" className="w-full flex  justify-start my-3" key={index}>
            <option.icon/>
               {option.name}
           </Button>
        ))}
    </div>
  )
}

export default SideBarFooter