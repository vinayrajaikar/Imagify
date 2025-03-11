"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {  Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constants"
import { CustomField } from "./CustomField"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useEffect, useState, useTransition } from "react"
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils"
import MediaUploader from "./MediaUploader"
import TransformedImage from "./TransformedImage"
import { updateCredits } from "@/lib/actions/user.action"
import { getCldImageUrl } from "next-cloudinary"
import { addImage, updateImage } from "@/lib/actions/image.actions"
import { useRouter } from "next/navigation"
import { InsufficientCreditsModal } from "./InsufficientCreditsModal"


export const formSchema = z.object({
    title: z.string(),
    aspectRatio: z.string().optional(),
    color: z.string().optional(),
    prompt: z.string().optional(),
    publicId: z.string(),
})


const TransformationForm = ({action,data = null, userId, type, creditBalance, config =null}: TransformationFormProps) => {
  
    const transformationType = transformationTypes[type]
    const [image, setImage] = useState(data);
    const [newTransformation, setNewTransformation] = useState<Transformations | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);
    const [transformationConfig, setTransformationConfig] = useState(config);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const initialValues = data && action === 'Update' ? {
    title: data?.title,
    aspectRatio: data?.aspectRatio,
    color: data?.color,
    prompt: data?.prompt,
    publicId: data?.publicId,
    }: defaultValues


  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    if(data || image){
        const transformationUrl = getCldImageUrl({
            width: image?.width,
            height: image?.height,
            src: image?.publicId,
            ...transformationConfig
        })

        const imageData = {
            title: values.title,
            publicId: image?.publicId,
            transformationType: type,
            width: image?.width,
            height: image?.height,
            config: transformationConfig,
            secureURL: image?.secureURL,
            transformationURL: transformationUrl,
            aspectRatio: values.aspectRatio,
            prompt:  values.prompt,
            color: values.color
        }

        if(action === 'Add'){
            try {
                const newImage = await addImage({image: imageData, userId, path: '/'})
                if(newImage){
                    form.reset()
                    setImage(data)
                    router.push(`/transformations/${newImage._id}`)
                }
            } 
            catch (error) {
                console.log(error);
            }
        }

        if(action === 'Update'){
            try {
                const updatedImage = await updateImage(
                    {
                        image: {...imageData, _id: data._id}, 
                        userId, 
                        path: `/transformations/${data._id}`
                    }
                )
                if(updatedImage){
                    router.push(`/transformations/${updatedImage._id}`)
                }
            } 
            catch (error) {
                console.log(error);
            }
        }
    }

    setIsSubmitting(false);

  }


  //for aspect ratio
  const onSelectFieldHandler = (value:string, onChangeField:(value:string)=> void)=>{
    const imageSize = aspectRatioOptions[value as AspectRatioKey]
    setImage((prevState:any) =>({
        ...prevState,
        aspectRatio: imageSize.aspectRatio,
        width: imageSize.width,
        height: imageSize.height 
    }))
    setNewTransformation(transformationType.config);
    return onChangeField(value);
  }

  //
  const onInputChangeHandler = (fieldName: string, value:string, type: string,
    onChangeField: (value: string)=> void ) =>{
        debounce(()=>{
             setNewTransformation((prevState: any)=>({
                ...prevState,
                [type]:{
                    ...prevState?.[type],
                    [fieldName === 'prompt' ? 'prompt' : 'to']: value
                }
             }))

            return onChangeField(value);
        },1000);
  }

  // TODO: Return to updateCredits
  const onTransformHandler = async () => {
    setIsTransforming(true);
    if(newTransformation){
        setTransformationConfig(
            deepMergeObjects(newTransformation, transformationConfig)
        );
    }
    setNewTransformation(null);
    startTransition(async () => {
        await updateCredits(userId, creditFee)
    });
  };

  useEffect(()=>{
    if(image && (type === 'restore' || type === 'removeBackground')){
        setNewTransformation(transformationType.config)
    }
  },[image, transformationType, type])

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {creditBalance<Math.abs(creditFee) && <InsufficientCreditsModal/>}
            <CustomField 
                control={form.control}
                name="title"
                formLabel="Image Title"
                className="w-full"
                render={({field})=> <Input {...field} 
                    className="rounded-[16px] border-2 border-purple-200/20 shadow-sm 
                    shadow-purple-200/15 text-dark-600 disabled:opacity-100 p-16-semibold h-[50px] 
                    md:h-[54px] focus-visible:ring-offset-0 px-4 py-3 focus-visible:ring-transparent"/>
                }
            />

            {type === 'fill' && (
                <CustomField 
                    control={form.control}
                    name='aspectRatio'
                    formLabel='Aspect Ratio'
                    className="w-full"
                    render={({field})=>(
                        <Select 
                            onValueChange={(value)=> 
                            onSelectFieldHandler(value, field.onChange)}
                        >
                            <SelectTrigger className=" w-full border-2 border-purple-200/20 shadow-sm shadow-purple-200/15 rounded-[16px] h-[50px] md:h-[54px] text-dark-600 p-16-semibold disabled:opacity-100 placeholder:text-dark-400/50 px-4 py-3 focus:ring-offset-0 focus-visible:ring-transparent focus:ring-transparent focus-visible:ring-0 focus-visible:outline-none">
                                <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(aspectRatioOptions).map((key)=>(
                                    <SelectItem key={key} value={key} className="py-3 cursor-pointer hover:bg-purple-100">
                                        {aspectRatioOptions[key as AspectRatioKey].label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            )}

            {(type === 'remove' || type === 'recolor') && (
                <div className="flex flex-col gap-5 lg:flex-row lg:gap-10">
                    <CustomField
                        control={form.control}
                        name="prompt"
                        formLabel={
                            type === 'remove' ? 'Object to remove' : 'Object to recolor'
                        }
                        className="w-full"
                        render={(({field})=>(
                            <Input 
                                value={field.value}
                                className="rounded-[16px] border-2 border-purple-200/20 shadow-sm shadow-purple-200/15 text-dark-600 disabled:opacity-100 p-16-semibold h-[50px] md:h-[54px] focus-visible:ring-offset-0 px-4 py-3 focus-visible:ring-transparent !important"
                                onChange={(e)=> onInputChangeHandler(
                                    'prompt',
                                    e.target.value,
                                    type,
                                    field.onChange
                                )}
                            />
                        ))}
                    />

                    {type === 'recolor' && (
                        <CustomField
                            control={form.control}
                            name="color"
                            formLabel="Replacement Color"
                            className="w-full"
                            render={({field})=>(
                                <Input
                                    value={field.value}
                                    className="rounded-[16px] border-2 border-purple-200/20 shadow-sm shadow-purple-200/15 text-dark-600 disabled:opacity-100 p-16-semibold h-[50px] md:h-[54px] focus-visible:ring-offset-0 px-4 py-3 focus-visible:ring-transparent !important"
                                    onChange={(e)=> onInputChangeHandler(
                                        'color',
                                        e.target.value,
                                        'recolor',
                                        field.onChange
                                    )}
                                />
                            )}
                        />
                    )}

                </div>
            )}
            
            <div className="grid h-fit min-h-[200px] grid-cols-1 gap-5 py-4 md:grid-cols-2">
                <CustomField 
                    control={form.control}
                    name="publicId"
                    className="flex size-full flex-col"
                    render={({ field }) => (
                        <MediaUploader 
                            onValueChange={field.onChange}
                            setImage={setImage}
                            publicId={field.value}
                            image={image}
                            type={type}
                        />
                    )}
                />

                <TransformedImage 
                    image={image}
                    type={type}
                    title={form.getValues().title}
                    isTransforming={isTransforming}
                    setIsTransforming={setIsTransforming}
                    transformationConfig={transformationConfig}
                />
        </div>

            <div className="flex flex-col gap-4">
                <Button 
                    type="button" 
                    className = "bg-[#7068fc] text-white rounded-full py-4 px-6 mt-5 font-semibold h-[50px] w-full md:h-[54px] hover:bg-[#7068fc] hover:bg-[#5a54e0] transition-shadow duration-300 capitalize"
                    disabled = {isTransforming || newTransformation === null}
                    onClick = {onTransformHandler}
                >
                {isTransforming? 'Transforming...': 'Apply tranformation'}
                </Button>

                <Button 
                    type="submit" 
                    className = "bg-[#7068fc] text-white rounded-full py-4 px-6 font-semibold h-[50px] w-full md:h-[54px] hover:bg-[#7068fc] hover:bg-[#5a54e0] transition-shadow duration-300 capitalize"
                    disabled = {isSubmitting}
                >
                    {isSubmitting? 'Submitting...' : 'Save Image'}
                </Button>
            </div>
        </form>
    </Form>
  )
}

export default TransformationForm
