"use client"

import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

const Home = () => {
  return (
    <>
      <main className="min-h-screen flex flex-col bg-(--background) text-(--forground)">
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-20 sm:py-32">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            {/* Background gradient elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
            </div>

            <div className="space-y-4">
              <h1 className="font-serif text-5xl sm:text-6xl font-bold text-foreground leading-tight">
                Lines that touch your soul.
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                SoulLines is a peaceful space where thoughts, emotions, and words come together. Discover quotes that
                inspire, heal, and connect souls across the world.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                to="/feed"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                Explore Quotes
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Brand highlights */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <span>Minimal</span>
              <span className="hidden sm:inline">•</span>
              <span>Meaningful</span>
              <span className="hidden sm:inline">•</span>
              <span>Emotional</span>
            </div>
          </div>
        </section>
      </main>

    </>
  )
}


export default Home;