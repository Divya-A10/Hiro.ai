import Navbar from '../components/Navbar';
import SophisticatedHero from '../components/SophisticatedHero';
import DashboardPreview from '../components/DashboardPreview';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="bg-black min-h-screen text-white select-none">
      <Navbar />
      <SophisticatedHero />
      <DashboardPreview />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
