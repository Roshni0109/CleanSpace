import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Clock, Shield, ChevronRight, CheckCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const services = [
  {
    id: 'service-1',
    name: 'Basic House Cleaning',
    description: 'Standard cleaning of all rooms including dusting, vacuuming, mopping, and bathroom cleaning.',
    price: 89.99,
    duration: '2 hours',
    image: 'https://images.unsplash.com/photo-1597665863042-47e00964d899',
    features: ['All rooms cleaned', 'Bathroom sanitization', 'Vacuuming & mopping']
  },
  {
    id: 'service-2',
    name: 'Deep Cleaning',
    description: 'Thorough cleaning including baseboards, inside appliances, windows, and hard-to-reach areas.',
    price: 179.99,
    duration: '4 hours',
    image: 'https://images.unsplash.com/photo-1759301495175-51e540735644',
    features: ['Everything in basic', 'Inside appliances', 'Window cleaning', 'Baseboards & trim']
  },
  {
    id: 'service-3',
    name: 'Office Cleaning',
    description: 'Professional cleaning for office spaces including desks, common areas, restrooms, and kitchenettes.',
    price: 149.99,
    duration: '3 hours',
    image: 'https://images.unsplash.com/photo-1504297050568-910d24c426d3',
    features: ['Desk sanitization', 'Common areas', 'Restrooms', 'Kitchenette']
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F0E9] via-[#FAFAF9] to-[#E8ECE6]">
      {/* Navigation */}
      <nav className="px-6 md:px-12 lg:px-24 py-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-primary font-heading"
          >
            CleanSpace
          </motion.div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">
              Services
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            {token ? (
              <>
                <Button
                  data-testid="nav-dashboard-btn"
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  data-testid="nav-book-btn"
                  onClick={() => navigate('/book')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Book Now
                </Button>
              </>
            ) : (
              <>
                <Button
                  data-testid="nav-login-btn"
                  variant="ghost"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  data-testid="nav-register-btn"
                  onClick={() => navigate('/register')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          <button
            data-testid="mobile-menu-btn"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 flex flex-col gap-4 bg-white/80 backdrop-blur-md rounded-2xl p-6"
          >
            <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">
              Services
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            {token ? (
              <>
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
                <Button
                  onClick={() => navigate('/book')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                >
                  Book Now
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                >
                  Get Started
                </Button>
              </>
            )}
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-1 lg:col-span-6 flex flex-col gap-8"
          >
            <div className="inline-flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-muted-foreground/80 mb-2">
              <Sparkles className="w-4 h-4" />
              Professional Cleaning Services
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] font-heading">
              Your Space,
              <br />
              <span className="text-primary">Spotlessly Clean</span>
            </h1>
            
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-xl">
              Book professional cleaning services in minutes. Trusted, verified cleaners for your home or office.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button
                data-testid="hero-book-btn"
                onClick={() => navigate(token ? '/book' : '/register')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                Book Your Cleaning
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                data-testid="hero-learn-btn"
                variant="outline"
                onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
                className="h-14 px-10 rounded-full font-medium text-lg border-2 hover:bg-secondary/50"
              >
                Learn More
              </Button>
            </div>

            <div className="flex items-center gap-8 mt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Verified Cleaners</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Insured Service</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="col-span-1 lg:col-span-6 relative h-full min-h-[500px]"
          >
            <img
              src="https://images.unsplash.com/photo-1597665863042-47e00964d899"
              alt="Bright modern living room with white furniture"
              className="rounded-[3rem] overflow-hidden shadow-2xl w-full h-full object-cover rotate-1 hover:rotate-0 transition-all duration-700 ease-out"
            />
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="px-6 md:px-12 lg:px-24 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-muted-foreground/80 mb-4">
            Our Services
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight font-heading mb-4">
            Choose Your Perfect Clean
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From basic maintenance to deep cleaning, we've got you covered
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-8">
          {/* Deep Cleaning - Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="col-span-full md:col-span-8 row-span-2 group relative overflow-hidden rounded-3xl bg-white border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl"
            data-testid="service-card-deep-cleaning"
          >
            <div className="grid md:grid-cols-2 h-full">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="text-sm font-medium tracking-widest uppercase text-accent mb-4">
                  Most Popular
                </div>
                <h3 className="text-3xl md:text-4xl font-semibold mb-4 font-heading">
                  {services[1].name}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {services[1].description}
                </p>
                <ul className="space-y-3 mb-8">
                  {services[1].features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-primary">${services[1].price}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4" />
                      {services[1].duration}
                    </div>
                  </div>
                  <Button
                    data-testid="book-deep-cleaning-btn"
                    onClick={() => navigate(token ? '/book' : '/register')}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 rounded-full font-semibold"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
              <div className="hidden md:block relative h-full min-h-[400px]">
                <img
                  src={services[1].image}
                  alt={services[1].name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Basic Cleaning */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="col-span-full md:col-span-4 row-span-1 group relative overflow-hidden rounded-3xl bg-white border border-border/50 p-8 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl"
            data-testid="service-card-basic-cleaning"
          >
            <h3 className="text-2xl font-semibold mb-3 font-heading">
              {services[0].name}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {services[0].description}
            </p>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-primary">${services[0].price}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  {services[0].duration}
                </div>
              </div>
              <Button
                data-testid="book-basic-cleaning-btn"
                onClick={() => navigate(token ? '/book' : '/register')}
                size="sm"
                className="rounded-full"
              >
                Book
              </Button>
            </div>
          </motion.div>

          {/* Office Cleaning */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="col-span-full md:col-span-4 row-span-2 group relative overflow-hidden rounded-3xl bg-white border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl"
            data-testid="service-card-office-cleaning"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={services[2].image}
                alt={services[2].name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-semibold mb-3 font-heading">
                {services[2].name}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {services[2].description}
              </p>
              <ul className="space-y-2 mb-6">
                {services[2].features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-3 h-3 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary">${services[2].price}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {services[2].duration}
                  </div>
                </div>
                <Button
                  data-testid="book-office-cleaning-btn"
                  onClick={() => navigate(token ? '/book' : '/register')}
                  className="rounded-full"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="col-span-full md:col-span-4 bg-secondary/30 rounded-2xl p-8 border border-border/50 flex flex-col items-center justify-center text-center"
          >
            <img
              src="https://images.unsplash.com/photo-1591077101603-132e07f5b1e3"
              alt="Eco-friendly green glass cleaning bottles"
              className="w-24 h-24 object-cover rounded-full mb-4"
            />
            <h4 className="font-semibold text-lg mb-2 font-heading">Eco-Friendly</h4>
            <p className="text-sm text-muted-foreground">
              We use environmentally safe cleaning products
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 md:px-12 lg:px-24 py-24 md:py-32 bg-white/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight font-heading mb-4">
            Book in 3 Simple Steps
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { step: '01', title: 'Choose Service', desc: 'Select the cleaning service that fits your needs' },
            { step: '02', title: 'Pick Date & Time', desc: 'Choose a convenient date and time slot' },
            { step: '03', title: 'Confirm & Relax', desc: 'Confirm your booking and let us handle the rest' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="text-6xl font-bold text-primary/20 mb-4 font-heading">{item.step}</div>
              <h3 className="text-xl font-semibold mb-2 font-heading">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button
            data-testid="how-it-works-cta-btn"
            onClick={() => navigate(token ? '/book' : '/register')}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 rounded-full font-semibold text-lg shadow-xl"
          >
            Get Started Now
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 lg:px-24 py-12 bg-primary text-primary-foreground">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4 font-heading">CleanSpace</div>
            <p className="text-sm opacity-90">
              Professional cleaning services you can trust.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><a href="#services" className="hover:underline">Services</a></li>
              <li><a href="#how-it-works" className="hover:underline">How it Works</a></li>
              <li><Link to="/login" className="hover:underline">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-sm opacity-90">Email: hello@cleanspace.com</p>
            <p className="text-sm opacity-90">Phone: (555) 123-4567</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm opacity-75">
          © 2024 CleanSpace. All rights reserved.
        </div>
      </footer>
    </div>
  );
}