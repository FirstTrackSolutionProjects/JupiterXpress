import React, { useState } from 'react'
import { menuItems } from '../Constants'
const MenuItem = ({icon, name, isDropdown, dropDownOptions, menuID ,setMenuID, setShowRecharge}) => {
    const [isOpen, setIsOpen] = useState(0)
  return (
    <>
    <div onClick={isDropdown?()=>setIsOpen(!isOpen):(name==="Wallet Recharge"?()=>setShowRecharge(true):()=>setMenuID(menuID))} className=' cursor-pointer px-2 w-full h-12 bg-white transition-all duration-300 hover:bg-[rgba(37,168,229,0.6)] relative flex items-center border-r-2 border-b-2'>
      <img src={icon} alt="" className='w-12' />
      <p className=''>{name}</p>
      {isDropdown ? <p className={`absolute transition-transform duration-300 ${isOpen?"rotate-90":""} right-1`}>
        &#9656;	
      </p> : null}
    </div>
    {isDropdown ? <div className={`  ${isOpen?``:"hidden"}`}>
        {dropDownOptions.map((subitem,index) => (
            <MenuItem key={index} icon="" name={subitem.name} isDropdown={subitem.isDropdown} menuID={subitem.menuID} setMenuID={setMenuID} dropDownOptions={subitem.dropDownOptions} />
        ))}
    </div> : null}
      </>
  )
}

export default MenuItem
