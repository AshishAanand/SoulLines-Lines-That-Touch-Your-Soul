import { Link } from "react-router-dom";
import { Heart } from "lucide-react"
import { FaGithub, FaLinkedin } from 'react-icons/fa';


const Footer = () => {

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/30 border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div>
                <img src="../../public/SoulLines-Logo.png" alt="SoulLines Logo" width={32} height={32}/>
              </div>
              <span className="font-serif font-bold text-foreground">SoulLines</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Lines that touch your soul. A peaceful space for meaningful quotes and inspiration.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/feed" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Quote Feed
                </Link>
              </li>
              <li>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">Connect</h3>
            <div className="flex gap-4">

              <a
                href="https://github.com/AshishAanand"
                className="p-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              >
                <FaGithub className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/ashish-anand-49b958311/"
                className="p-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              © {currentYear} SoulLines — Made with <Heart className="w-4 h-4 text-primary" />
            </p>
            <p className="text-sm text-muted-foreground">Lines that touch your soul.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer