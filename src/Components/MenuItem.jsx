import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const MenuItem = ({icon, name, url, isDropdown, dropDownOptions, setShowRecharge, hidden}) => {
  if (hidden) return null;
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(0)
  const [isCurrentMenu, setIsCurrentMenu] = useState(location.pathname === `/dashboard/${url}`)
  useEffect(() => {
    setIsCurrentMenu(location.pathname === `/dashboard/${url}`)
  },[navigate])
  return (
    <>
    <div onClick={isDropdown?()=>setIsOpen(!isOpen):(name==="Wallet Recharge"?()=>setShowRecharge(true):()=>navigate(url))} className={` cursor-pointer px-4 w-full min-h-[48px] py-2 ${isCurrentMenu?'bg-blue-600/90 text-white shadow-inner':'bg-slate-900 text-slate-300'} transition-all duration-300 hover:bg-slate-800 hover:text-white relative flex items-center border-b border-slate-800/40`}>
      {icon && <img src={icon} alt="" className={`w-6 h-6 mr-3 object-contain ${isCurrentMenu ? 'brightness-0 invert' : 'opacity-70 group-hover:opacity-100 brightness-0 invert'}`} />}
      <p className='text-sm font-medium truncate'>{name}</p>
      {isDropdown ? <p className={`ml-auto text-xs transition-transform duration-300 ${isOpen?"rotate-90":""}`}>
        &#9656;	
      </p> : null}
    </div>
    {isDropdown ? <div className={` bg-slate-950/50 ${isOpen?``:"hidden"}`}>
        {dropDownOptions.map((subitem,index) => (
            <MenuItem key={index} icon="" name={subitem.name} url={subitem.url} isDropdown={subitem.isDropdown} dropDownOptions={subitem.dropDownOptions} hidden={subitem.hidden} />
        ))}
    </div> : null}
      </>
  )
}

export default MenuItem
