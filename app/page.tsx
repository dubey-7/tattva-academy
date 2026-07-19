import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import AboutTeacher from "@/components/home/AboutTeacher";
import Subjects from "@/components/home/Subjects";
import DemoVideos from "@/components/home/DemoVideos";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedReviews from "@/components/home/FeaturedReviews";
import FAQ from "@/components/home/FAQ";
import ContactSection from "@/components/home/ContactSection";
import CTA from "@/components/home/CTA";
import SuccessStories from "@/components/home/SuccessStories";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Countries + Statistics */}
      <Stats />

      {/* Premium Programs */}
      <Subjects />

      <AboutTeacher />

      <DemoVideos />

      <HowItWorks />

      <FeaturedReviews />

      <SuccessStories />

      <FAQ />

      <ContactSection />

      <CTA />
    </>
  );
}