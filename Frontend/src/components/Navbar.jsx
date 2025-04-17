import React, { useEffect, useState } from 'react'
import { assets } from '@/assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Button } from './ui/button'
import { Loader2, Moon, Sun } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import {  Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, } from './ui/sheet'
import { FaBars } from "react-icons/fa";
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { MdLogout } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import UserProfile from './UserProfile'
import { useLogoutMutation } from '@/app/apis/authApi'
import { toast } from 'react-toastify'
import { logoutUser } from '@/app/slices/authSlice'
import { useTheme } from './ThemeProvider'

const Navbar = () => {

    const [theme,setTheme] = useState("system");
    const navigate = useNavigate();

    const {user} = useSelector((state)=>state.auth);

    const courses = [
      {field:'Development',areas:['Web Development','Data Science','Mobile Development','Programming Languages','Game Development','Database Design & Development','Software Testing','No-code Development']},
      {field:'Business',areas:['Entrepreneurship','Communication','Management','Sales','Business statergy','Operations','Business Law','Project Management']},
      {field:'Finance & Accounting',areas:['Economics','Finance','Compliance','Cyrptography & Blockchain','Taxes']},
      {field:'IT & Software',areas:['Hardware','IT Certifications','Network & Security','Operating Systems & Servers']},
      {field:'Office Productivity',areas:['Microsoft','Google','SAP','Oracle']},
      {field:'Marketing',areas:['Digital Marketing','Branding','Search Engine Optimization','Social Media Marketing','Marketing Fundamentals','Public Relations']}
    ];
    
  return (
    <nav className='flex justify-between p-2 items-center sticky z-10 top-0 shadow-xl bg-[#ffff] dark:bg-[#0A0A0A]'>
        <div className='cursor-pointer' onClick={()=>navigate("/")}>
            <img src = {assets.logo_light} className='w-[150px] md:w-[200px] dark:hidden max-[300px]:w-[100px]' />
            <img src = {assets.logo_dark} className='w-[150px] md:w-[200px] hidden dark:block max-[300px]:w-[100px]' />
        </div>
        <div className='flex gap-3 md:gap-5 items-center max-[660px]:hidden'>
            <Explore courses={courses} />
            <Button variant='ghost' className='cursor-pointer font-medium text-md md:text-lg dark:text-white' onClick={()=>navigate("/signup",{state:{role:'instructor'}})}>Instructor</Button>
            {user && <Link to = '/my-learning' className='font-medium text-md md:text-lg dark:text-white'>My Learning</Link>}
        </div>
        <div className='flex gap-3 md:gap-5 items-center'>
          {!user ? <div className='flex gap-1 md:gap-3 max-[660px]:hidden'>
          <Button className='bg-white text-black dark:bg-gray-800 dark:hover:bg-gray-800 hover:bg-white cursor-pointer border-1 dark:text-white' onClick={()=>navigate("/signin")}>Login</Button>
          <Button className='bg-[#F90070] text-white hover:none hover:bg-[#F90070] cursor-pointer' onClick={()=>navigate("/signup")}> Signup</Button>
          </div> : 
          <Profile user={user} /> 
          }
            <div className='hidden max-[660px]:block'>
                <MobileNav user={user} courses={courses} />
            </div>
            <div className='max-[660px]:hidden cursor-pointer'>
              <Mode />
            </div>
        </div>
    </nav>
  )
}

const Profile = ({user})=>{

  const dispatch = useDispatch();

  const [logout,{isLoading:logoutLoading}] = useLogoutMutation();

  const handleLogout = async ()=>{
    try {
      const response = await logout().unwrap();
      if(response?.success){
        dispatch(logoutUser());
        toast.success('Logout Successfully!');
      } else {
        toast.error(response?.message || 'Error in logout, try again!');
      }
    } catch(err) {
      toast.error(err?.data?.message || 'Error in logout, try again!');
    }
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
          <Button variant='none'>
            <UserProfile size={'38px'} />
          </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32 bg-[#ffff] dark:bg-gray-800 px-2 py-3 z-10 rounded-md shadow-md">
        <DropdownMenuLabel className='text-center font-medium'>My Account</DropdownMenuLabel>
        <p className='cursor-pointer hover:text-[#F90070] my-1'><Link to = '/profile'>Edit Profile</Link></p>
        {user?.role === 'instructor' && <p className='cursor-pointer hover:text-[#F90070] my-1'><Link to = '/admin/dashboard'>Dashboard</Link></p>}
        {logoutLoading ?<div className='flex'><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait</div> : 
        <div className='flex justify-between cursor-pointer items-center hover:text-[#F90070] my-1' onClick={handleLogout}>
          <p>Log out</p>
          <MdLogout />
        </div>
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const Explore = ({courses})=>{

    return (
    <DropdownMenu className='border-0 bg-transparent'>
      <DropdownMenuTrigger asChild className='cursor-pointer border-0 hover:border-0 font-medium'>
        <Button variant='none'><p className='text-md md:text-lg cursor-pointer dark:text-white'>Explore</p></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 border-1 bg-[#ffffff] dark:bg-gray-800 shadow-sm z-10 rounded-md px-2 py-1 text-center *:cursor-pointer *:hover:text-[#F90070]">
        {courses.map((item,index)=>(
            <DropdownMenuGroup key={index}>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='hover:border-0 py-1'>{item.field}</DropdownMenuSubTrigger>
              <DropdownMenuPortal className='border-0 hover:border-0'>
                <DropdownMenuSubContent className='ml-4 text-center w-40 bg-[#ffffff] dark:bg-gray-800 border-1 z-10 shadow-sm rounded-md *:cursor-pointer *:hover:text-[#F90070]'>
                  {item.areas.map((area,index)=>(
                    <DropdownMenuItem key={index} className='p-2'>{area}</DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
    )
}

const Mode = ()=>{

  const {setTheme} = useTheme();

    return (
        <DropdownMenu className='z-10'>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className='cursor-pointer' size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className='bg-white dark:bg-gray-800 *:px-2 *:py-1 rounded-md'>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
}

const MobileNav = ({user,courses})=>{

  const navigate = useNavigate();

    return(
        <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className='cursor-pointer'><FaBars /></Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <Mode />
          </SheetHeader>
          <div>
            <p className='font-semibold text-2xl text-center'>Explore</p>
            {courses.map((item, index) => (
            <Popover key={index}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-left text-base font-medium ml-2 mt-2 hover:text-[#F90070] cursor-pointer">
                  {item.field}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 p-2 bg-white dark:bg-gray-800 border rounded-lg shadow-md">
                {item.areas.map((sub, idx) => (
                  <div key={idx} className="p-2 hover:bg-gray-100 rounded cursor-pointer text-sm hover:text-[#F90070]">
                    {sub}
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          ))}
          </div>
          <Button variant='ghost' className='cursor-pointer font-medium text-md md:text-lg dark:text-white' onClick={()=>navigate("/signup",{state:{role:'instructor'}})}>Instructor</Button>
          {user && <p className='font-semibold text-md text-center hover:text-[#F90070]'><Link to='/my-learning'>My Learning</Link></p>}
          {!user && <div className='flex flex-col items-center gap-y-5'>
            <Button className='bg-white text-black hover:bg-white cursor-pointer border-1 w-[70%]' onClick={()=>navigate("/signin")}>Login</Button>
            <Button className='bg-[#F90070] text-white hover:none hover:bg-[#F90070] cursor-pointer w-[70%]' onClick={()=>navigate("/signup")}> Signup</Button></div>
          }
        </SheetContent>
      </Sheet>
    )
}

export default Navbar