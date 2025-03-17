/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import toast from '@/components/ui/sonner'
'use client';
import { dataUrl } from "@/lib/utils";
import {CldImage, CldUploadWidget} from "next-cloudinary"
// import { getImageSize } from "next/dist/server/image-optimizer";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React from "react";
import { toast } from "sonner"

type MediaUploaderProps = {
    onValueChange: (value: string) => void;
    setImage: React.Dispatch<any>;
    publicId: string;
    image: {    
        title: string,
        aspectRatio: string,
        color: string,
        prompt: string,
        publicId: string,
    };
    type: string;   
}

const MediaUploader = ({
    onValueChange,
    setImage,
    image,
    publicId,
    type
}: MediaUploaderProps) => {

  const onUploadSuccessHandler = (result:any) => {
    setImage((prevState:any)=>({
        ...prevState,
        publicId: result?.info?.public_id,
        width: result?.info?.width,
        height: result?.info?.height,
        secureURL: result?.info?.secure_url
    }))

    onValueChange(result?.info?.public_id)
    toast.success('Image uploaded successfully',{
        description:"1 credit was deducted from your account",
        duration:5000
    })
  }

  const onUploadErrorHandler = () => {
    toast('Something gone wrong',{
        description:"Please try again",
        duration:5000,
        className:"bg-red-100 text-red-900"
    })
  }

  return (
    <CldUploadWidget 
        uploadPreset="vinay_imagify"  
        options={{
            multiple: false,
            resourceType: "image",     
        }}
        onSuccess={onUploadSuccessHandler}
        onError={onUploadErrorHandler}
    >
        {({open})=>(
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-dark-100">Original</h3>
                {
                    publicId? (
                        <> 
                            <div className="cursor-pointer overflow-hidden rounded-[10px]">
                                <CldImage 
                                    // width={getImageSize(type, image, "width")}
                                    // height={getImageSize(type, image, "height")}
                                    width={14}
                                    height={14}
                                    src={publicId}
                                    alt="image"
                                    sizes={"(max-width: 767px) 100vw, 50vw"}
                                    placeholder={dataUrl as PlaceholderValue}
                                    className="h-fit min-h-72 w-full rounded-[10px] border border-dashed bg-purple-100/20 object-cover p-2"
                                />
                            </div>
                        </>):(
                        <div className="flex justify-center items-center flex h-72 cursor-pointer flex-col gap-5 rounded-[16px] border border-dashed bg-purple-100/20 shadow-inner"
                            onClick={()=> open()}>
                            <div className="rounded-[16px] bg-white  p-5 shadow-sm shadow-purple-200/50">
                                <Image
                                    src="/assets/icons/add.svg"
                                    alt="Add Image"
                                    width={24}
                                    height={24}
                                />
                            </div>
                            <p className="p-14-medium">Click here to upload image</p>
                        </div>
                    )
                }
            </div>
        )}
    </CldUploadWidget>

  )
}

export default MediaUploader
