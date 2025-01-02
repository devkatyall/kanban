import React from 'react'
import SideDrawer from '@/components/ui/SideDrawer'

export default function layout({children}) {
  return (
    <div className=" h-[calc(100vh-80px)] grid grid-cols-6">
        <div className=" h-full col-span-1" >
        <SideDrawer />
        </div>
        <div className="h-full col-span-5 " >
            {children}
        </div>
     </div>
  )
}
