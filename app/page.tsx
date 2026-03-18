import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { SectionDivider } from "@/components/section-divider"
import { ExpenseTable } from "@/components/expense-table"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { WhyChooseSection } from "@/components/why-choose-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="bg-[#0c0a14]">
      <Navbar />
      <Hero />
      <ExpenseTable />
      <SectionDivider />
      <FeaturesSection />
      <SectionDivider />
      <TestimonialsSection />
      <SectionDivider />
      <WhyChooseSection />
      <Footer />
    </main>
  )
}
