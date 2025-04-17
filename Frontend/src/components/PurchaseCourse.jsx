import React from 'react'
import { Button } from './ui/button'
import { toast } from 'react-toastify'
import { useCreateCheckoutSessionMutation } from '@/app/apis/purchaseApi'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const PurchaseCourse = ({courseID}) => {

    const [createCheckoutSession,{isLoading}] = useCreateCheckoutSessionMutation();
    const navigate = useNavigate();

    const handlePurchaseCourse = async ()=> {
        try {
            const response = await createCheckoutSession({
                courseID,
            }).unwrap();

            if(response?.success) {
                if(response?.url) {
                    window.open(response?.url,'_blank');
                } else if(response?.message) {
                    toast.success(response?.message);
                    navigate(`/course-progress/${courseID}`);
                }
            }

        } catch(err) {
            toast.error(err?.data?.message || 'Error in purchasing the course try again!');
        }
    }

  return (
    <Button className='bg-[#F90070] hover:bg-[#F90070] text-white cursor-pointer mt-6' onClick={handlePurchaseCourse} disabled={isLoading}>
       {isLoading ? (<><Loader2 className='w-4 h-4 animate-spin mr-1' /> Please Wait</>) : ' Purchase Course'}
    </Button>
  )
}

export default PurchaseCourse
