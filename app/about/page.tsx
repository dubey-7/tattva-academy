import PageHero from "@/components/common/PageHero";
import AboutTeacher from "@/components/home/AboutTeacher";
import CTA from "@/components/home/CTA";

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Tattva"
        description="We believe every student learns differently. Our personalized one-on-one tutoring approach helps students build confidence, strengthen concepts, and achieve academic success."
      />

      <AboutTeacher />

      <CTA />
    </>
  );
}