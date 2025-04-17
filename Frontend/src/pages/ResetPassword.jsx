import React, { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify"
import axios from "axios"
import { replace, useLocation, useNavigate } from "react-router-dom"
import { useResetPasswordMutation, useVerifyPasswordResetTokenQuery } from "@/app/apis/authApi"
import { Loader2 } from "lucide-react"

const ResetPassword = ()=>{

    const [showNewPassword,setShowNewPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);
    const new_passwordRef = useRef(null);
    const confirm_passwordRef = useRef(null);

    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const {data,error,isLoading:resetTokenLoading} = useVerifyPasswordResetTokenQuery(token);

    const [resetPassword,{isLoading:resetLoading}] = useResetPasswordMutation();

    useEffect(()=>{

        const verifyToken = async ()=>{

            if(!token) {
                navigate("/signin");
                return;
            }

            if(data?.success === false || error) {
                navigate("/signin");
            }
        }

        verifyToken();

    },[data,error,token,navigate]);


    const handleChangePassword = async ()=>{
        if(!new_passwordRef.current.value || !confirm_passwordRef.current.value) {
            toast.error('All fields are required!');
            return;
        }
        if(new_passwordRef.current.value !== confirm_passwordRef.current.value) {
            toast.error('Both Passwords should be same!');
            return;
        }
        try {
            const response = await resetPassword({
                token:token,
                newPassword:new_passwordRef.current.value,
            }).unwrap();


            if(response?.success) {
                toast.success('Password changed successfully!');
                new_passwordRef.current.value = '';
                confirm_passwordRef.current.value = '';

                queryParams.delete("token");
                navigate({pathname:"/signin"},{search:queryParams.toString()},{replace:true});
            } else {
                toast.error(response?.message || 'Error in changing the password, try again!');
            }

        } catch(err) {
            toast.error(err?.data?.message || 'Error in changing the password, try again!');
        }
    }

  return (
    <Card className="w-[350px] m-auto my-16 max-[350px]:w-full max-[350px]:mx-2">
      <CardHeader>
        <CardTitle className='text-3xl text-center'>Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
            <div className="grid w-full items-center gap-4">
            <div className="space-y-1 relative">
                <Label htmlFor="password" className="after:content-['*'] after:text-red-500 after:ml-1">New Password</Label>
                <Input type = {showNewPassword?'text':'password'} placeholder='password' required ref={new_passwordRef} />
                <span onClick={()=>setShowNewPassword(prev => !prev)} className='absolute bottom-3 right-2 cursor-pointer'>{showNewPassword? <FaRegEyeSlash /> : <FaRegEye />}</span>
            </div>
            <div className="space-y-1 relative">
                <Label htmlFor="password" className="after:content-['*'] after:text-red-500 after:ml-1">Confirm Password</Label>
                <Input type = {showConfirmPassword?'text':'password'} placeholder='password' required ref={confirm_passwordRef} />
                <span onClick={()=>setShowConfirmPassword(prev => !prev)} className='absolute bottom-3 right-2 cursor-pointer'>{showConfirmPassword? <FaRegEyeSlash /> : <FaRegEye />}</span>
                </div>
            </div>            
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button disabled={resetLoading} className='cursor-pointer bg-[#F90070] hover:bg-[#F90070] text-white' onClick={handleChangePassword}>
            {
                resetLoading ? (<><Loader2 className="mr-2 w-4 h-4 animate-spin" /> PLease Wait</>) : "Change Password"
            }
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ResetPassword