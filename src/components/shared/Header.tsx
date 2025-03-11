
const Header = ({title, subtitle }: {title: string, subtitle?: string}) => {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className='p-16-regular text-md mt-4 text-gray-600'>{subtitle}</p>}
    </>
  )
}

export default Header
