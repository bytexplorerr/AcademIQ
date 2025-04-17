import React from 'react'
import { Avatar } from './ui/avatar'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useSelector } from 'react-redux'

const UserProfile = ({size}) => {
  const {user} = useSelector((state)=>state.auth);
  return (
    <Avatar className='cursor-pointer' style={{width:size,height:size}}>
            <AvatarImage src={ user?.photoURL ||"https://github.com/shadcn.png"} alt="@shadcn" className='rounded-full'/>
            <AvatarFallback>User</AvatarFallback>
    </Avatar>
  )
}

export default UserProfile