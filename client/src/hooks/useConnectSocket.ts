import { UserContext } from "@/context/UserProvider"
import { useContext, useEffect } from "react"
import {io} from 'socket.io-client'

export const socket = io(import.meta.env.VITE_API_URL as string)
function useConnectSocket() {
  const userContext = useContext(UserContext)
  const {currUser} = userContext || {}
  useEffect(()=>{
    socket.auth = { token: localStorage.getItem("token") }

    socket.connect()
    socket.emit("join")
    socket.on("connect_error", (err) => {
      console.log(err)
    })

    
    socket.on("disconnect", () => {})
    return () => {
      socket.disconnect()
    }
  },[currUser])
}

export default useConnectSocket
