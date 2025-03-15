import {asyncHandler} from "../utils/asycnHandler.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponce} from "../utils/ApiResponce.js"
 
const generateAccessAndRefreshToken = async (id)=>{
     try {
        console.log(id);
        
        const user = await User.findById(id)
      const accessToken = await user.generateAccesToken()
      const refreshToken = await user.generateRefreshToken()
       user.refreshToken = refreshToken
      await user.save({validateBeforeSave:false})
   
       return {accessToken, refreshToken}
     } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token",error)
        
     }

}


const registerUser = asyncHandler(async (req,res)=>{
    
    console.log(req.body);
    
    const {username, email,password,rePassword}=req.body
    
    if([username,email,password,rePassword].some((field)=> field?.trim() === "")){
        throw new ApiError(401,"All fields are required")
    }
    if(!(rePassword===password)){
        throw new ApiError(401,"re-enter password could not match")
    }
    const exisedUser = await User.findOne({
        $or:[{email}, {username}]
        
    })

    if(exisedUser){
        throw new ApiError(401, "User Already Existed")

    }
    const user = await  User.create({
        username,
        email,
        password,

    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(400,"Error occured while trying to create user")
    }
    return res
    .status(200)
    .json(
        new ApiResponce(200,createdUser,"User Successfully Created")
    )
    
     
})

const loginUser = asyncHandler(async (req,res)=>{
    const {email , password} = req.body

    if(!email || !password){
        throw new ApiError(401,"All fields are required")
    }

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(401,"No Account Found")
    }
    
    const isPasswordValidate = await user.isPasswordCorrect(password)
    if(!isPasswordValidate){
        throw new ApiError(401,"Invalid Password")
    }
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken
    (user._id)
        
    if(!accessToken || !refreshToken){
        throw new ApiError(500,"Tokens generate faild")
    }
    const options ={
        httpOnly:true,
        secure:true
    }
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    return res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken", refreshToken,options)
    .json(
        new ApiResponce(200,{loggedInUser,accessToken,refreshToken},"Successfully Logged In")
    )


})
export {registerUser,
    loginUser,
}