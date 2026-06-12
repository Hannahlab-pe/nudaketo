import Hero from '../components/Hero'
import TrustBar from '../components/TrustBar'
import StoreShowcase from '../components/StoreShowcase'
import BrandStory from '../components/BrandStory'
import ScrollDraw from '../components/ScrollDraw'
import Features from '../components/Features'
import Testimonials from '../components/Testimonials'
import CTASection from '../components/CTASection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <StoreShowcase />
      <BrandStory />
      <ScrollDraw />
      <Features />
      <Testimonials />
      <CTASection />
    </>
  )
}
