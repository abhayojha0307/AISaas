import React, { useEffect,useState } from 'react'
import { dummyCreationData } from '../assets/assets';
import { Gem, Sparkle } from 'lucide-react';
import CreationItem from '../Components/CreationItem';
import axios from "axios";
import toast from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react';

const DashBoard = () => {
  const [creations, setCreations] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const getDashboardData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get(
        "http://localhost:3000/api/user/get-user-creations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data)
      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getDashboardData();
  }, []);
  return !loading ?  (
    <div className='h-full overflow-y-scroll p-6'>
      <div className='flex justify-start gap-4 flex-wrap'>
        <div className='flex justify-between items-center w-72 p-4 px-6
         bg-white rounded-xl border border-gray-500'>
          <div className="text-slate-600">
            <p className='text-sm'>Total Creations</p>
            <h2 className='text-xl font-semibold'>{creations.length}</h2>
          </div> 
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br
           from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
          <Sparkle className='w-5 text-white'/>
          </div>
         </div>
        <div className='flex justify-between items-center w-72 p-4 px-6
         bg-white rounded-xl border border-gray-500'>
          <div className="text-slate-600">
            <p className='text-sm'>Active Plan</p>
            <h2 className='text-xl font-semibold'>Premium</h2>
          </div> 
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br
           from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center'>
          <Gem className='w-5 text-white'/>
          </div>
         </div>
      </div>
      <div className='space-y-3'>
        <p className='mt-6 mb-6'>Recent Creations</p>
        {creations.map((item)=><CreationItem key={item.id} item={item}/>)}
      </div>
    </div> ):(
      <div className="flex justify-center items-center h-full">
      <span className="w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin"></span>
    </div>
    )
}

export default DashBoard
