import Link from 'next/link';
import Image from 'next/image';
import AuroraBackground from '@/components/aurora-background';
import Navbar from '@/components/shared/Navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] relative">
      <AuroraBackground />
      <Navbar transparent />
      
      <main className="relative z-10 pt-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Text */}
            <div className="space-y-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#F1F5F9] leading-[1.1]">
                Finally, someone understands what you meant.
              </h1>
              
              <p className="text-xl text-[#94A3B8] max-w-xl leading-relaxed">
                Teens express. AI translates. Adults finally get it.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth?role=teen"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
                >
                  I&apos;m a Teen
                </Link>
                
                <Link
                  href="/auth?role=adult"
                  className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-[#F1F5F9] font-semibold rounded-full hover:bg-white/5 transition-colors"
                >
                  I&apos;m a Parent or Counselor
                </Link>
              </div>
            </div>
            
            {/* Right: Hero Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent z-10" />
              <Image
                src="/Gemini_Generated_Image_vka71nvka71nvka7 (1).png"
                alt="MindBridge - AI-powered emotional translation"
                width={600}
                height={600}
                className="w-full h-auto rounded-3xl"
                priority
              />
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#F1F5F9] mb-16">
            Three steps. Real understanding.
          </h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#7C3AED] via-[#0D9488] to-[#7C3AED] opacity-30" />
            
            {/* Step 1 */}
            <div className="relative mb-12 md:text-right">
              <div className="md:mr-8 md:ml-0 ml-16">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED] text-[#A78BFA] font-bold text-xl mb-4">
                  1
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:inline-block">
                  <h3 className="text-xl font-semibold text-[#F1F5F9] mb-2">
                    You write what you actually feel
                  </h3>
                  <p className="text-[#94A3B8]">
                    No judgment. No filters. Just honest expression in your own words.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative mb-12">
              <div className="md:ml-8 md:mr-0 ml-16">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#0D9488]/20 border border-[#0D9488] text-[#2DD4BF] font-bold text-xl mb-4">
                  2
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:inline-block">
                  <h3 className="text-xl font-semibold text-[#F1F5F9] mb-2">
                    MindBridge reads between the lines
                  </h3>
                  <p className="text-[#94A3B8]">
                    Our AI understands what you really mean, not just what you say.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative">
              <div className="md:mr-8 md:ml-0 ml-16">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED] text-[#A78BFA] font-bold text-xl mb-4">
                  3
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:inline-block">
                  <h3 className="text-xl font-semibold text-[#F1F5F9] mb-2">
                    They finally know how to show up for you
                  </h3>
                  <p className="text-[#94A3B8]">
                    Adults get clear guidance on what you need and how to help.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Why It Matters Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-gradient-to-br from-[#0D9488]/20 via-[#0A0A0F] to-[#7C3AED]/20 border border-[#0D9488]/30 rounded-3xl p-12 text-center">
              <p className="text-sm text-[#0D9488] uppercase tracking-widest mb-4">
                Why it matters
              </p>
              <p className="text-6xl md:text-8xl font-black text-[#0D9488] mb-6">
                1 in 5
              </p>
              <p className="text-xl text-[#94A3B8] max-w-xl mx-auto">
                teens experience a mental health condition. Most never find the words.
              </p>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="border-t border-white/5 py-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="MindBridge"
                width={24}
                height={24}
                className="h-6 w-auto"
              />
              <span className="text-lg font-bold text-[#F1F5F9]">MindBridge</span>
            </div>
            
            <p className="text-sm text-[#64748B]">
              © 2026 MindBridge. Built with purpose.
            </p>
            
            <p className="text-sm text-[#64748B] italic">
              Made for the ones who couldn&apos;t find the words.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

