import { Collection } from "@/components/shared/Collection";
import { navLinks } from "@/constants";
import { getAllImages } from "@/lib/actions/image.actions";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imagify - Home",
  description: "Unleash Your Creative Vision with Imagify",
};

interface SearchParamProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const Home = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams.page) || 1;
  const searchQuery = (searchParams.query as string) || "";

  const images = await getAllImages({ page, searchQuery });

  return (
    <> 
      {/* 🔹 Hero Section */}
      <section className="sm:flex justify-center items-center hidden h-72 flex-col gap-4 rounded-[20px] border bg-banner bg-cover bg-no-repeat p-10 bg-[#7068fc] shadow-inner">
        <h1 className="text-[36px] font-semibold sm:text-[44px] leading-[120%] sm:leading-[56px] max-w-[500px] flex-wrap text-center text-white text-4xl font-bold">
          Unleash Your Creative Vision with Imagify
        </h1>
        <ul className="flex justify-center items-center w-full gap-20">
          {navLinks.slice(1, 5).map((link) => (
            <Link key={link.route} href={link.route} className="flex justify-center items-center flex-col gap-2">
              <li className="flex justify-center items-center w-fit rounded-full bg-white p-4">
                <Image src={link.icon} alt={link.label} width={24} height={24} />
              </li>
              <p className="p-14-medium text-center text-white">{link.label}</p>
            </Link>
          ))}
        </ul>
      </section>

      {/* 🔹 Collection Component */}
      <section className="sm:mt-12">
        <Collection hasSearch={true} images={images?.data} totalPages={images?.totalPage} page={page} />
      </section>
    </>
  );
};

export default Home;
