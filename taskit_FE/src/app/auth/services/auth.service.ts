
import axios from "axios"

// Define the user registration data type
export interface UserRegistrationData {
  name:string
  email: string
  password: string
  accountType: 'personal' | 'organization'

}



export const registerUser = async (userDetails: UserRegistrationData) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/register`, userDetails)
    
    if (res.status !== 200 && res.status !== 201) {
      throw new Error("Registration failed")
    }
    
    return res.data
  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Handle axios errors
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else if (error.response?.status === 400) {
      throw new Error('Invalid user data provided')
    } else if (error.response?.status === 409) {
      throw new Error('User with this email already exists')
    } else {
      throw new Error('Registration failed. Please try again.')
    }
  }
}

// Login function
export interface LoginCredentials {
  email: string
  password: string
}

export const loginUser = async (credentials: LoginCredentials) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/login`, credentials)
    
    if (res.status !== 200) {
      throw new Error("Login failed")
    }
    localStorage.setItem("token",res.data.token)
    return res.data
  } catch (error: any) {
    console.error('Login error:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else if (error.response?.status === 401) {
      throw new Error('Invalid email or password')
    } else {
      throw new Error('Login failed. Please try again.')
    }
  }
}

export const googleLogin=async(idToken:string)=>{
try {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/googleSignin`, {idToken})

  if(res.status!==200){
    throw new Error("Google Login Failed")
  }
  return res.data
} catch (error:any) {
  throw new Error(error.response.data.message)
}
}
