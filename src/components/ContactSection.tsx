import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { audio } from "../utils/audio";
import { Mail, Phone, Linkedin, MessageSquare, Send, Sparkles, CheckCircle2 } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", project: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Starry Galaxy Background Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Array<{ x: number; y: number; r: number; alpha: number; speed: number }> = [];
    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const initStars = () => {
      stars = [];
      const density = Math.floor((width * height) / 8000);
      for (let i = 0; i < density; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.5 + 0.2,
          alpha: Math.random() * 0.8 + 0.1,
          speed: Math.random() * 0.15 + 0.05,
        });
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initStars();
    };

    window.addEventListener("resize", handleResize);
    initStars();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      // Star drawing
      stars.forEach((star) => {
        // Change transparency slightly
        star.alpha += (Math.random() - 0.5) * 0.05;
        if (star.alpha < 0.1) star.alpha = 0.1;
        if (star.alpha > 0.9) star.alpha = 0.9;
        
        // Drifts star downwards
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(212, 175, 55, ${star.alpha})`;
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    audio.playShutterClick();
    setIsSubmitting(true);

    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", project: "", message: "" });
      
      // Auto close success alert
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1800);
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden bg-black-pure border-t border-neutral-900 font-sans">
      
      {/* Heavy-duty moving star canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0 bg-black-pure"
      />

      {/* Radiant ambient bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-[radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.03)_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Visual text block (Left 5 cols) */}
          <div className="lg:col-span-5 h-full flex flex-col justify-between">
            <div>
              <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-3">Initiate Conversation</p>
              
              <h2 className="font-serif text-3xl sm:text-5xl text-white-pure tracking-tight leading-none">
                Let&rsquo;s Create<br />Timeless Stories
              </h2>

              <div className="border-l border-gold/40 pl-6 my-10 italic font-serif text-white-pure/80 text-xl font-light leading-relaxed">
                &ldquo;Every great story begins with a conversation.&rdquo;
              </div>

              {/* Instant Social links connect */}
              <div className="space-y-4">
                <a
                  href="mailto:sreekarraju46@gmail.com"
                  onMouseEnter={() => audio.playLensTick()}
                  className="flex items-center justify-between p-3.5 bg-neutral-950/60 hover:bg-neutral-900/80 border border-neutral-900 hover:border-gold/20 rounded-xl transition-all duration-400 group"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-mono text-gray-soft group-hover:text-white-pure transition-colors">sreekarraju46@gmail.com</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-soft/40 group-hover:text-gold transition-colors">EMAIL &rarr;</span>
                </a>

                <a
                  href="tel:+917013352985"
                  onMouseEnter={() => audio.playLensTick()}
                  className="flex items-center justify-between p-3.5 bg-neutral-950/60 hover:bg-neutral-900/80 border border-neutral-900 hover:border-gold/20 rounded-xl transition-all duration-400 group"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-mono text-gray-soft group-hover:text-white-pure transition-colors">+91 70133 52985</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-soft/40 group-hover:text-gold transition-colors">DIAL &rarr;</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/sreekarraju-411045243"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 bg-neutral-950/60 hover:bg-neutral-900/80 border border-neutral-900 hover:border-gold/20 rounded-xl transition-all duration-400 group"
                >
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-mono text-gray-soft group-hover:text-white-pure transition-colors">Sreekar Raju</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-soft/40 group-hover:text-gold transition-colors">LINKEDIN &rarr;</span>
                </a>

                <a
                  href="https://wa.me/917013352985"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 bg-neutral-950/60 hover:bg-neutral-900/80 border border-neutral-900 hover:border-gold/20 rounded-xl transition-all duration-400 group"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-mono text-gray-soft group-hover:text-white-pure transition-colors">Instant WhatsApp</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-soft/40 group-hover:text-gold transition-colors">CHAT &rarr;</span>
                </a>
              </div>
            </div>

            <div className="text-[10px] font-mono text-gray-soft/40 mt-12 select-none">
              LOC: BENGALURU, IN &middot; TIME: UTC/IST CHASER
            </div>
          </div>

          {/* Emotional Interactive Inquiry Form (Right 7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-neutral-950/90 border border-neutral-900/80 p-8 sm:p-10 rounded-2xl shadow-2xl relative">
              <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest text-gold uppercase flex items-center gap-1.5 shadow-xl">
                <Sparkles className="w-3.5 h-3.5 fill-gold/10" />
                <span>Scholar Z Verified</span>
              </div>

              <form onSubmit={submitInquiry} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.15em] text-gray-soft/50 mb-2">
                    Your Name (First &amp; Last)
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="E.g., Kiara Advani"
                    className="w-full bg-transparent border-b border-neutral-800 focus:border-gold py-3 text-sm text-white-pure outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.15em] text-gray-soft/50 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="E.g., contact@brandstory.com"
                    className="w-full bg-transparent border-b border-neutral-800 focus:border-gold py-3 text-sm text-white-pure outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.15em] text-gray-soft/50 mb-2">
                    Visual Intent (Choose a Category)
                  </label>
                  <input
                    type="text"
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                    placeholder="E.g., Coastal Documentary Series / Model Portfolio Shoot"
                    className="w-full bg-transparent border-b border-neutral-800 focus:border-gold py-3 text-sm text-white-pure outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.15em] text-gray-soft/50 mb-2">
                    Describe the Narrative
                  </label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe what we are creating. Keep it raw, detailed, and emotional."
                    className="w-full bg-transparent border-b border-neutral-800 focus:border-gold py-3 text-sm text-white-pure outline-none transition-colors resize-none"
                  />
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onMouseEnter={() => audio.playLensTick()}
                    className="flex-grow bg-gold hover:bg-transparent text-black-pure hover:text-gold border border-gold px-8 py-3.5 rounded-full font-mono text-xs tracking-widest uppercase transition-all duration-350 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black-pure/30 border-t-black-pure rounded-full animate-spin" />
                        <span>Sending Transmission...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Transmission Message</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      audio.playShutterClick();
                      window.location.href = "mailto:sreekarraju46@gmail.com?subject=Creative Collaboration Invite";
                    }}
                    onMouseEnter={() => audio.playLensTick()}
                    className="px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-full text-xs font-mono tracking-widest uppercase text-gray-soft hover:text-white-pure cursor-pointer select-none transition-colors flex items-center justify-center"
                  >
                    Direct Email
                  </button>
                </div>
              </form>

              {/* Alert success banner */}
              <AnimatePresence>
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute inset-x-6 bottom-6 bg-green-950/90 border border-green-800 p-4 rounded-xl flex items-center gap-3.5 shadow-2xl relative"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-white-pure font-mono text-xs font-semibold uppercase">
                        Transmission Successful
                      </p>
                      <p className="text-gray-soft text-[11px] mt-0.5 leading-relaxed font-light">
                        Log recorded. Sreekar Raju will reply to your inbox within 24 hours.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
