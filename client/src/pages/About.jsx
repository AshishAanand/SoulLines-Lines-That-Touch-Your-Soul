import React from "react"
import { Heart, Sparkles, Users } from "lucide-react"

const About = () => {
  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6">About SoulLines</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              A peaceful sanctuary where words touch hearts and inspire souls to grow, connect, and find meaning in
              life's journey.
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-16">
            <div className="bg-card border border-border rounded-2xl p-8 sm:p-12">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SoulLines exists to create a meaningful space where people can discover, share, and celebrate the power
                of words. We believe that quotes have the ability to transform perspectives, heal hearts, and inspire
                action.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                In a world of constant noise, we've created a sanctuary of silence and reflection—a place where every
                quote is carefully curated to touch your soul and remind you of what truly matters.
              </p>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Value 1 */}
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <div className="inline-block p-3 bg-primary/10 rounded-lg mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">Authenticity</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We believe in genuine, heartfelt words that resonate with real human experiences and emotions.
                </p>
              </div>

              {/* Value 2 */}
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <div className="inline-block p-3 bg-accent/10 rounded-lg mb-4">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">Inspiration</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Every quote is chosen to spark growth, creativity, and positive change in your life and perspective.
                </p>
              </div>

              {/* Value 3 */}
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <div className="inline-block p-3 bg-secondary/10 rounded-lg mb-4">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">Community</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We're building a global community of souls who believe in the power of words to connect and heal.
                </p>
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="mb-16">
            <div className="bg-muted/30 border border-border rounded-2xl p-8 sm:p-12">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  SoulLines was born from a simple observation: in our fast-paced world, we often forget to pause and
                  reflect. We scroll through endless content, yet rarely encounter words that truly touch our hearts.
                </p>
                <p>
                  We created SoulLines to change that. What started as a personal collection of meaningful quotes has
                  grown into a sanctuary for seekers, dreamers, and souls looking for inspiration and connection.
                </p>
                <p>
                  Today, SoulLines is home to thousands of carefully curated quotes spanning wisdom, love, motivation,
                  resilience, and more. Each quote is selected not just for its beauty, but for its ability to spark
                  something meaningful within you.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Ready to explore?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/feed"
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                Browse Quotes
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}


export default About;