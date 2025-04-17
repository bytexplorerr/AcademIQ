import React, { useRef } from "react"
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
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { useForgotPasswordMutation } from "@/app/apis/authApi"
import { Loader2 } from "lucide-react"

const ForgotPassword = ()=> {

    const emailRef = useRef(null);

    const [forgotPassword,{isLoading:forgotLoading}] = useForgotPasswordMutation();

    const handleForgotPassword = async ()=>{
        if(!emailRef.current.value) {
            toast.error('Email is required1');
            return;
        }

        try {
            const response = await forgotPassword({
              email:emailRef.current.value,
            }).unwrap();

            if(response?.success) {
              toast.success('Password reset link is sent to your email, please check your email!');
              emailRef.current.value = '';
            } else  {
              toast.error(response?.message || 'Error in sending the reset link, try again!');
            }
        } catch(err) {
            toast.error(err?.data?.message || 'Error in sending the reset link, try again!');
        }
    }

  return (
    <Card className="w-[350px] max-[350px]:w-full max-[350px]:mx-2 m-auto my-12">
      <CardHeader>
        <CardTitle className='text-3xl text-center max-[300px]:text-2xl'>Forgot Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name" className="after:content-['*'] after:text-red-600 after:ml-1">Email</Label>
              <Input type='email' required placeholder='user@example.com' ref={emailRef} />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button disabled={forgotLoading} className='cursor-pointer bg-[#F90070] hover:bg-[#F90070] text-white' onClick={handleForgotPassword}>
          {
            forgotLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /></>) : "Send Mail" 
          }
        </Button>
      </CardFooter>
      <p className="text-center">
        Back to <Link to = "/signin" className="text-blue-700 hover:underline">Sigin</Link>
      </p>
    </Card>
  )
}

export default ForgotPassword