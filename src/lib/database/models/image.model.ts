import { transformationTypes } from "@/constants";
import { model, models, Schema } from "mongoose";

export interface IImage extends Document {
    title: string;
    transformationType: string;
    publicId: string;
    secureURL: string; 
    width?: number;
    height?: number;
    config?: object; 
    transformationUrl?: string; 
    aspectRatio?: string;
    color?: string;
    prompt?: string;
    author: {
      _id: string;
      firstName: string;
      lastName: string;
    }import { Schema, model, models } from "mongoose";

    const TransactionSchema = new Schema(
        {
            stripeId: {
                type: String,
                required: true,
                unique: true,
            },
            amount: {
                type: Number,
                required: true,
            },
            plan: {
                type: String,
            },
            credits: {
                type: Number,
            },
            buyer: {
                type: Schema.Types.ObjectId, // Corrected ObjectId
                ref: "User",
            },
        },
        {
            timestamps: true, // Correct option name
        }
    );
    
    const Transaction = models?.Transaction || model("Transaction", TransactionSchema);
    
    export default Transaction;
    import { Schema, model, models } from "mongoose";

    const TransactionSchema = new Schema(
        {
            stripeId: {
                type: String,
                required: true,
                unique: true,
            },
            amount: {
                type: Number,
                required: true,
            },
            plan: {
                type: String,
            },
            credits: {
                type: Number,
            },
            buyer: {
                type: Schema.Types.ObjectId, // Corrected ObjectId
                ref: "User",
            },
        },
        {
            timestamps: true, // Correct option name
        }
    );
    
    const Transaction = models?.Transaction || model("Transaction", TransactionSchema);
    
    export default Transaction;
        
    createdAt?: Date;
    updatedAt?: Date;
}

const ImageSchema =  new Schema(
    {
        title: {type:String, required:true},
        transformationType: {type:String, required: true},
        publicId: {type:String, required:true},
        secureUrl: {type:String, required:true},
        width: {type:Number},
        height: {type:Number},
        config: {type:Object},
        transformationUrl: {type:URL},
        aspectRatio: {type:String},
        color: {type:String},
        prompt: {type:String},
        author: {type:Schema.Types.ObjectId,ref:'User'},
    },  
    {
        timestamps: true,
    }
)

const Image = models?.Image || model('Image',ImageSchema);
export default  Image;