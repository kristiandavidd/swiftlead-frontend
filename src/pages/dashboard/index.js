import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import UserLayout from '@/layout/UserLayout';
import { IconBellFilled } from '@tabler/icons-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/context/userContext';

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  console.log(user);

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <UserLayout head={"Dashboard"}>
      <div className='flex items-center'>
        <div div className='flex flex-col w-full ' >
          <p className='text-lg font-semibold'>Dashboard</p>
          <p className='hidden text-sm md:block'>Provides an overview of key activities and statistics, helping users quickly assess performance and notifications.</p>
        </div >
        <Popover >
          <PopoverTrigger asChild className='duration-300 ease-in cursor-pointer text-primary hover:text-primary/80'>
            <IconBellFilled />
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-2 w-80">
            <Alert>
              <AlertTitle className="font-semibold">Congratulations!</AlertTitle>
              <AlertDescription>
                Your first device installation has been successful!
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertTitle className="font-semibold">Welcome!</AlertTitle>
              <AlertDescription>
                Your account registration is successful!
              </AlertDescription>
            </Alert>
          </PopoverContent>
        </Popover>
      </div>
      <div className='flex flex-col gap-2 my-4 md:flex-row'>
        <Card className="md:w-1/2">
          <CardHeader>
            <CardDescription>
              Total Revenue
            </CardDescription>
            <CardTitle>
              No data available.
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <span className='text-sm text-muted-foreground'>Same as last month.</span>
            <Button>See Details</Button>
          </CardFooter>
        </Card>
        <Card className="md:w-1/2">
          <CardHeader>
            <CardDescription>
              Total Harvest
            </CardDescription>
            <CardTitle>
              No data available.
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <span className='text-sm text-muted-foreground'>Same as last month.</span>
            <Button>See Details</Button>
          </CardFooter>
        </Card>
      </div>
      <div div className='flex flex-col w-full ' >
        <p className='text-lg font-semibold'>Recent Article</p>
        <p className='text-sm'>Explore the fascinating lives and vital roles of swallow birds in nature, culture, and agriculture.</p>
      </div >
      <div className='flex flex-col gap-2 my-4'>

        <Alert >
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className='flex flex-col items-center gap-4 md:flex-row '>
              <Avatar className="w-full rounded-md h-60 md:h-16 md:w-16">
                <AvatarImage className="" src="/images/article1.jpg" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div>
                <p className='text-[12px] mb-2 text-muted-foreground'>Oct 19, 2024 </p>
                <AlertTitle className="font-semibold">The Fascinating World of Swiftlets: Builders of Edible Nests</AlertTitle>
                <AlertDescription>
                  {truncateText("Discover the remarkable behavior of swiftlets, the small birds that create intricate nests from their saliva, and learn about the cultural and economic significance of their edible nests.", 100)}
                </AlertDescription>
              </div>
            </div>
            <Button variant="outline" size="sm">Read Article</Button>
          </div>
        </Alert>
        <Alert >
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className='flex flex-col items-center gap-4 md:flex-row '>
              <Avatar className="w-full rounded-md h-60 md:h-16 md:w-16">
                <AvatarImage className="" src="/images/article2.jpg" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div>
                <p className='text-[12px] mb-2 text-muted-foreground'>Oct 18, 2024 </p>
                <AlertTitle className="font-semibold">Swiftlets and Their Nesting Mastery: A Natural Wonder</AlertTitle>
                <AlertDescription>
                  {truncateText("Explore the nesting habits of swiftlets, how they build their nests in caves and tall buildings, and the valuable role these nests play in traditional cuisine and medicine.", 100)}
                </AlertDescription>
              </div>
            </div>
            <Button variant="outline" size="sm">Read Article</Button>
          </div>
        </Alert>
        <Alert >
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className='flex flex-col items-center gap-4 md:flex-row '>
              <Avatar className="w-full rounded-md h-60 md:h-16 md:w-16">
                <AvatarImage className="" src="/images/article3.jpg" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div>
                <p className='text-[12px] mb-2 text-muted-foreground'>Oct 16, 2024 </p>
                <AlertTitle className="font-semibold">Swiftlets: The Silent Architects of Nature&apos;s Edible Nests</AlertTitle>
                <AlertDescription>
                  {truncateText("Uncover the secret life of swiftlets, their unique ability to create edible nests, and the sustainable practices behind harvesting these nests for one of the world’s most prized delicacies.", 100)}
                </AlertDescription>
              </div>
            </div>
            <Button variant="outline" size="sm">Read Article</Button>
          </div>
        </Alert>
      </div>
    </UserLayout >
  );
}
