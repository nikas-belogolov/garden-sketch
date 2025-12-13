import Image from "next/image";
import Link from "next/link";

import { LuPencilRuler } from "react-icons/lu";
import { IoLibraryOutline } from "react-icons/io5";
import { BsCalendar4Range } from "react-icons/bs";
import { PiUsersThree } from "react-icons/pi";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { H1, H2, H3 } from "@/components/ui/typography";
import { buttonVariants } from '@/components/ui/button';
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <LuPencilRuler size={30} />,
    title: 'Drag-and-Drop Designer',
    description: 'Easily create garden layouts with our intuitive drag-and-drop interface. Arrange plants, paths, and features with precision.',
  },
  {
    icon: <IoLibraryOutline size={30} />,
    title: 'Plant Library',
    description: 'Access information on thousands of plants including growing requirements, companion planting, and care instructions.',
  },
  {
    icon: <BsCalendar4Range size={30} />,
    title: 'Seasonal Planning',
    description: 'Never miss a planting window with customized calendars and reminders based on your location and climate zone.',
  },
  {
    icon: <PiUsersThree size={30} />,
    title: 'Real-time Collaboration',
    description: 'Collaborate with your community in real-time to create the perfect garden together.',
  }
];

export default function Home() {
  return (
    <>
    <header className=" p-5 fixed top-0 w-full bg-background">
      <div className="flex w-full">
        <div className="flex items-center font-bold text-xl">
          {/* <img src="" alt="" /> */}
          <span className="p-0 me-5">GardenSketch</span>
        </div>
          
        { /* Left side */ }
        <div className="flex-grow">
          <NavigationMenu className="w-full">
            <NavigationMenuList className="flex w-full">
              <NavigationMenuItem className="hidden md:block!">
                <Link href="#features" className={navigationMenuTriggerStyle()}>
                  Features
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="hidden md:block!">
                <Link href="#showcase" className={navigationMenuTriggerStyle()}>
                  Showcase
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="hidden md:block!">
                <Link href="#pricing" className={navigationMenuTriggerStyle()}>
                  Pricing
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        { /* Right side */ }
        <NavigationMenu  className="w-full">
          <NavigationMenuList className="flex w-full">

            <NavigationMenuItem className="ml-auto">
              <Link href="/auth/login" className={navigationMenuTriggerStyle()}>
                Login
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/auth/signup" className={navigationMenuTriggerStyle()}>
                Signup
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
      

      <section id="hero" className="flex h-dvh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <H1>GardenSketch</H1>
        <p className="text-muted-foreground text-center">
          Collaborate in real-time to sketch, schedule planting, and bring your garden to life!
        </p>
        <Link className={cn("w-fit", buttonVariants({ variant: "primary", size: "lg" }))} href="/auth/signup">Start Sketching For Free</Link>
      </section>  

      <section id="features" className="py-30 container mx-auto flex flex-col text-center px-6 items-center gap-8">
        <H2>Features</H2>
        <div className="grid md:grid-cols-2 gap-20">
          {features.map(feature => (
            <div key={feature.title} className="flex flex-col items-center gap-4 p-5">
              <div className="bg-green-400 text-green-700 p-4 rounded-full">
                {feature.icon}
              </div>
              <H3>{feature.title}</H3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="showcase">
      </section>

      <section id="pricing">

      </section>

      <section id="call-to-action" className="py-56 container mx-auto flex flex-col text-center px-6 items-center gap-8">
        <H2>Start Sketching</H2>
        <p className="text-muted-foreground">Get started with GardenSketch and bring your garden vision to life</p>
        <Link className={cn("bg-green-400 w-fit", buttonVariants({ variant: "ghost", size: "lg" }))} href="/auth/signup">Get Started - It&apos;s free!</Link>
      </section>

      <footer className="bg-green-400 text-white flex p-5">
        <p className="flex-grow">&copy; {new Date().getFullYear()} GardenSketch. All rights reserved.</p>
        {/* <div className="flex gap-4">
          <Link href="/auth/login">Login</Link>
          <Link href="/auth/signup">Sign up</Link>
        </div> */}
      </footer>
    </>
  );
}
