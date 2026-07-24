import { Footer } from '../layout/Footer'
import { Navbar } from '../layout/Navbar'
import { ContactSection } from '../sections/ContactSection'
import { FeaturesSection } from '../sections/FeaturesSection'
import { HeroSection } from '../sections/HeroSection'
import { PricingSection } from '../sections/PricingSection'
import { TrustedSection } from '../sections/TrustedSection'
import { WhyChooseUsSection } from '../sections/WhyChooseUsSection'

export function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-premium">
      <Navbar />
      <HeroSection />
      <TrustedSection />
      <FeaturesSection />
      <WhyChooseUsSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
