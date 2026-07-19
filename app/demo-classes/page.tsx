import PageHero from "@/components/common/PageHero";
import DemoVideos from "@/components/home/DemoVideos";
import CTA from "@/components/home/CTA";

export default function DemoClassesPage() {
  return (
    <>
      <PageHero
        title="Demo Classes"
        description="Watch our sample lessons and experience how personalized one-on-one learning helps students understand concepts faster."
      />

      <DemoVideos />

      <CTA />
    </>
  );
}