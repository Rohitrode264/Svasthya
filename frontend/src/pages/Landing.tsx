import { useState } from 'react';
import { Menu, X, Heart, Users, Pill, MessageCircle, ArrowRight, Check, Play, MapPin, PenLine, Calendar, ShieldCheck, Scale, Info, Bell } from 'lucide-react';
import { Button } from '../component/Button';
import Logo from '../component/Logo';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../component/Modal';

export default function SvasthyaLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [openProduct, setOpenProduct] = useState(false);
  const [openLegal, setOpenLegal] = useState(false);
  const [openLearn, setOpenLearn] = useState(false);

  const isAuthed = () => localStorage.getItem('token') !== null;
  const goOrAuth = (path: string) => {
    if (isAuthed()) {
      const userId = localStorage.getItem('userId');
      if (userId) navigate(`/${userId}${path}`);
      else navigate('/login');
    } else {
      navigate('/login');
    }
  };
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-1">
              <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                <Logo size={40} />
              </div>
              <span className="text-2xl font-semibold
               text-gray-900">Svasthya</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8 items-center">
              <a href="#features" className="text-gray-700 hover:text-teal-600 transition">Features</a>
              <a href="#community" className="text-gray-700 hover:text-teal-600 transition">Community</a>
              <a href="#about" className="text-gray-700 hover:text-teal-600 transition">About</a>
            </div>

            {/* Sign In Button */}
            <div className="hidden md:flex gap-4">
              <Button className="px-6 py-2 text-teal-600 font-medium hover:bg-teal-50 rounded-lg transition" variant='secondary' onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button className="" variant='outline' onClick={() => navigate('/signup')}>
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-3">
              <a href="#features" className="block text-gray-700 hover:text-teal-600">Features</a>
              <a href="#community" className="block text-gray-700 hover:text-teal-600">Community</a>
              <a href="#about" className="block text-gray-700 hover:text-teal-600">About</a>
              <div className="pt-3 space-y-2">
                <button className="w-full px-4 py-2 text-teal-600 font-medium border border-teal-600 rounded-lg hover:bg-teal-50 transition" onClick={() => navigate('/login')}>
                  Sign In
                </button>
                <Button className="w-full px-4 py-2 bg-gradient-to-r from-lime-400 to-teal-500 text-white font-medium rounded-lg" onClick={() => navigate('/Signup')}>
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="px-4 py-2 bg-lime-100 text-lime-700 rounded-full text-sm font-medium">
                  ✨ Wellness Redefined
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Your Health, <span className="bg-gradient-to-r from-lime-400 to-teal-500 bg-clip-text text-transparent">Connected</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Svasthya brings together medication management, wellness insights, and a supportive community. Your complete healthcare companion.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="" variant='secondary' icon={<ArrowRight className="w-5 h-5" />} onClick={() => navigate('/login')}>
                  Start Free
                </Button>
                <Button className="gap-1 flex items-center" variant='primary' icon={<Play className="w-5 h-5" />}>
                  Watch Demo
                </Button>
              </div>


            </div>

            {/* Right Visual */}
            <div className="relative">
              {/* <div className="absolute inset-0 bg-gradient-to-tr from-lime-200 to-teal-100 rounded-3xl blur-3xl opacity-60"></div> */}
              {/* Hero Mockup Card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-lime-200 to-teal-100 rounded-3xl blur-lg opacity-60" />
                <div className="relative bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-6">
                  {/* Smart Medication */}
                  <div className="p-4 bg-gradient-to-br from-lime-50 to-teal-50 rounded-2xl border border-lime-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">Next Dose</span>
                      <Pill className="text-teal-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">Aspirin 500mg</p>
                    <p className="text-sm text-gray-600 mt-1">in 2 hours • 14:30 PM</p>
                    <Button variant="outline" size="sm" className="m-1" icon={<Calendar className="w-4 h-4" />} onClick={() => goOrAuth('/mediminder')}>
                      Schedule Now
                    </Button>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">Nearby Care</span>
                      <MapPin className="text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Find trusted hospitals and facilities.</p>
                    <Button variant="secondary" size="sm" icon={<ArrowRight className="w-4 h-4" />} onClick={() => goOrAuth('/carelocator')}>
                      Discover Now
                    </Button>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">Share Your Journey</span>
                      <PenLine className="text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Inspire others with your experiences.</p>
                    <Button variant="outline" size="sm" icon={<MessageCircle className="w-4 h-4" />} onClick={() => goOrAuth('/carecircle')}>
                      Post Experience
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600">Designed for your wellness journey</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-gradient-to-br from-lime-50 to-white rounded-2xl border border-lime-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-lime-400 rounded-lg flex items-center justify-center mb-4">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Medication</h3>
              <p className="text-gray-600">Never miss a dose. Get timely reminders, track refills, and manage all your medications in one place.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-gradient-to-br from-teal-50 to-white rounded-2xl border border-teal-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Wellness Insights</h3>
              <p className="text-gray-600">Track your health metrics, get personalized recommendations, and understand your wellness patterns.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Supportive Community</h3>
              <p className="text-gray-600">Connect with others, share experiences, and get support from a caring community of wellness enthusiasts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                A Community That <span className="bg-gradient-to-r from-lime-400 to-teal-500 bg-clip-text text-transparent">Cares</span>
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                Share your wellness journey, learn from others, and find support from people who understand. Built on trust, powered by empathy.
              </p>

              <ul className="space-y-4">
                {[
                  'Topic-based communities for every health interest',
                  'Safe, moderated spaces for authentic conversations',
                  'Expert insights and verified health information',
                  'Events and wellness challenges'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-lime-400" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <button className="mt-8 px-8 py-3 bg-gradient-to-r from-lime-400 to-teal-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-lime-200 transition" onClick={() => goOrAuth('/carecircle')}>
                Join Community
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Mental Health</span>
                  <span className="text-sm font-bold text-gray-600">2.4K</span>
                </div>
                <div className="p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Fitness</span>
                  <span className="text-sm font-bold text-gray-600">3.1K</span>
                </div>
                <div className="p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Nutrition</span>
                  <span className="text-sm font-bold text-gray-600">1.8K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Ready to Transform Your Health?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of users who trust Svasthya for their wellness journey.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant='primary' size='md' onClick={() => navigate('/signup')}>
              Start Your Journey
            </Button>
            <Button variant='outline' size='md' onClick={() => setOpenLearn(true)}>
              Learn More
            </Button>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <Logo />
              </div>
              <span className="text-xl font-bold">Svasthya</span>
            </div>
            <p className="text-gray-400">Your health, connected.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button className="hover:text-white transition" onClick={() => setOpenProduct(true)}>Features</button></li>
              <li><span className="text-white">Pricing: Free</span></li>
              <li><button className="hover:text-white transition" onClick={() => setOpenProduct(true)}>Security</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button className="hover:text-white transition" onClick={() => setOpenLegal(true)}>Privacy</button></li>
              <li><button className="hover:text-white transition" onClick={() => setOpenLegal(true)}>Terms</button></li>
              <li><button className="hover:text-white transition" onClick={() => setOpenLegal(true)}>Cookie Policy</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Svasthya. All rights reserved.</p>
        </div>
      </footer>

      <Modal open={openProduct} title="About the Product" onClose={() => setOpenProduct(false)}>
        <ProductContent />
      </Modal>
      <Modal open={openLegal} title="Legal" onClose={() => setOpenLegal(false)}>
        <LegalContent />
      </Modal>
      <Modal open={openLearn} title="How Svasthya Works" onClose={() => setOpenLearn(false)}>
        <LearnMoreContent />
      </Modal>
    </div>
  );
}

function ProductContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-900 font-semibold"><ShieldCheck className="w-5 h-5 text-teal-600" />Secure by design</div>
      <p className="text-gray-600">End-to-end HTTPS, encrypted at rest, and role-based access control.</p>
      <div className="flex items-center gap-2 text-gray-900 font-semibold"><Scale className="w-5 h-5 text-teal-600" />Compliant</div>
      <p className="text-gray-600">Built with privacy-first principles and industry best practices.</p>
      <div className="flex items-center gap-2 text-gray-900 font-semibold"><Info className="w-5 h-5 text-teal-600" />Pricing</div>
      <p className="text-gray-600">Free to use.</p>
    </div>
  );
}

function LegalContent() {
  return (
    <div className="space-y-3 text-sm text-gray-700">
      <p>We collect minimal data necessary to operate core features. You can request export or deletion anytime.</p>
      <p>By using Svasthya you agree to fair use, no abuse, and community guidelines.</p>
      <p>Cookies are used only for essential authentication and performance.</p>
    </div>
  );
}

function LearnMoreContent() {
  const items = [
    { icon: <Pill className="w-5 h-5 text-teal-600" />, title: "Smart Medication", desc: "Add meds and reminders." },
    { icon: <MapPin className="w-5 h-5 text-teal-600" />, title: "Care Locator", desc: "Find nearby care." },
    { icon: <Users className="w-5 h-5 text-teal-600" />, title: "Care Circle", desc: "Join the community." },
    { icon: <Bell className="w-5 h-5 text-teal-600" />, title: "Care Alert", desc: "Notify contacts in emergencies." }
  ];

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-3">
        {items.map(i => (
          <div key={i.title} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200">
            <div className="mt-0.5">{i.icon}</div>
            <div>
              <p className="font-medium text-gray-900">{i.title}</p>
              <p className="text-sm text-gray-600">{i.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-600 text-center">Sign up to get started in minutes.</p>
    </div>
  );
}