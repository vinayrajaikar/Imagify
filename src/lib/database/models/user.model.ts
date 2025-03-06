import { model, models, Schema } from "mongoose";

const UserSchema = new Schema(
    {
        clerkId:{ 
            type: String, 
            unique: true, 
            required:true
        },
        email:{
            type:String, 
            unique: true, 
            required:true
        },
        username: {
            type:String, 
            unique: true, 
            required:true
        },
        photo: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        planId: {
            type: Number,
            default: 1,
        },
        creditBalance:{
            type: Number,
            default: 10,
        }
    },{
        timestamps:true,
    }
)

const User = models?.User || model("User", UserSchema);

export default User;