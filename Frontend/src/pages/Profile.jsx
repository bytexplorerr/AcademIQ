import { useEditProfileMutation, useGetProfileQuery } from "@/app/apis/authApi";
import { loggedIn } from "@/app/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UserProfile from "@/components/UserProfile";
import { Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Profile = () => {
  const { data, error, isLoading: profileLoading } = useGetProfileQuery();
  const [editProfile,{isLoading:editProfileLoading}] = useEditProfileMutation();
  

  const {user} = useSelector((state)=>state.auth);

  const [name,setName] = useState('');
  const [photo,setPhoto] = useState('');

  const photoRef = useRef(null);

  const dispatch = useDispatch();

  const handlePhotoChange = (e)=>{
    const file = e.target.files?.[0];
    if(file){
      setPhoto(file);
    }
  }

  useEffect(() => {
    if (data) {
      if (data?.success) {
        setName(data.user.name);
        setPhoto(data.user.photoURL);
        dispatch(loggedIn(data.user));
      } else {
        toast.error("Error in fetching the user data, Try again!");
      }
    } else if (error) {
      toast.error(error?.data?.message || "Error in fetching the user data, Try again!");
    }
  }, [data,error]);

  const handleEditProfile = async (e)=>{
    try {

      // we can't send the 'files' data directly via JSON object so we need to use the 'form' to send this data.

      const formData = new FormData();
      formData.append("name",name);
      formData.append("profilePhoto",photoRef.current?.files[0]);
 
      const response = await editProfile(formData).unwrap();

      if(response?.success) {
        toast.success(response?.message || 'Profile updated successfully!');
        dispatch(loggedIn(response?.user));
      } else {
        toast.error(response?.message || 'Error in changing the profile try again!');
      }
    } catch(err) {
      toast.error(err?.data?.message || 'Error in changing the profile try again!');
    }
  }
  return (
    <section>
      {profileLoading ? (
        <div className="flex justify-center my-16">
          <Loader2 className="animate-spin w-16 h-16" />
        </div>
      ) : (
        <main>
          <p className="my-6 font-semibold text-center text-2xl md:text-3xl lg:text-4xl">
            Profile
          </p>
          <section className="my-16">
            <div className="flex flex-col gap-y-4 sm:gap-y-2 sm:flex-row gap-x-6 justify-center items-center">
              <div>
                <UserProfile size={"60px"} />
              </div>
              <div className="mx-2">
                <p className="font-semibold dark:text-white">
                  Name : <span className="font-normal">{user?.name}</span>
                </p>
                <p className="font-semibold dark:text-white">
                  Email : <span className="font-normal">
                    {user?.email}
                  </span>
                </p>
                <p className="font-semibold dark:text-white">
                  Role : <span className="font-normal uppercase">{user?.role}</span>
                </p>
              </div>
            </div>
            <div className="flex justify-center my-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button className='cursor-pointer bg-[#F90070] hover:bg-[#F90070]'>Edit Profile</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className='text-center my-2 font-semibold text-2xl'>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="grid py-4 gap-y-6">
                  <div className="grid justify-between grid-cols-4 items-center">
                    <Label className="text-left">
                      Name
                    </Label>
                    <Input
                      type='text'
                      placeholder='Name'
                      className="col-span-3"
                      value={name}
                      onChange={(e)=>setName(e.target.value)}
                    /> 
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-left">
                      Photo
                    </Label>
                    <Input
                      type='file'
                      accept='image/*'
                      className="col-span-3"
                      onChange={handlePhotoChange}
                      ref={photoRef}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className='cursor-pointer bg-[#F90070] hover:bg-[#F90070]' onClick={handleEditProfile} disabled={editProfileLoading}>
                    {editProfileLoading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Please Wait</>) : "Save Changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </div>
          </section>
        </main>
      )}
    </section>
  );
};

export default Profile;