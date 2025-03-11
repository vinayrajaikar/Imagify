import Header from '@/components/shared/Header'
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes} from '@/constants'
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const AddTransformationTypePage = async({params: {type}}:SearchParamProps) => {

  const { userId } = await auth();
  if(!userId) redirect('/sign-in')
  const user = await getUserById(userId);
  const Transformation = transformationTypes[type];
  return (
    <>
      <Header 
        title={Transformation.title} 
        subtitle={Transformation.subTitle}
      />

      <section className="mt-10">
        <TransformationForm 
          action='Add' 
          userId={user._id}
          type={Transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  )
}

export default AddTransformationTypePage
