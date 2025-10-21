import axios from "axios"



//get All Registered users
export const getAllUsers = async ()=>{
    try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/getAllUsers`,  {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        if(res){
            return res.data
        }
    } catch (error) {
        console.error("Failed to get all users",error)
    }
}
