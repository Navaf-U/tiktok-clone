import { IoClose } from "react-icons/io5"

function PfpOnlyShow({profile,setProfileShow} : {profile:string,setProfileShow:(show: boolean) => void}) :JSX.Element {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative bg-[#191919] flex justify-center items-center rounded-md h-full w-full max-w-2xl max-h-[90vh]">
      <IoClose size={40} onClick={()=>setProfileShow(false)} className="absolute top-4 right-4 cursor-pointer"/>
        <img src={profile} alt=""/>
        </div>
    </div>
  )
}

export default PfpOnlyShow