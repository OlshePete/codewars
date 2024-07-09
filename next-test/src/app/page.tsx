import ContactSection from "@/components/ContactSection";
import { NextVideoSection } from "@/components/NextVideoSection";
import OrderForm from "@/components/OrderForm";
import VideoSection from "@/components/VideoSection";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
  
    <h1>test header</h1>
    <div className="h-dvh">
      <NextVideoSection/>
    </div>

    <VideoSection/>
    <div className="h-dvh"/>
    <ContactSection/>

    </main>
  );
}
