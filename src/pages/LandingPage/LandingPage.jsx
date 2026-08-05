import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../../redux/auth/authSlice.js";
import axios from "../../services/axios.js";
import {
  MessageCircleMore,
  Zap,
  Shield,
  Users,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Send,
  Bot,
  Globe,
  Lock,
  Palette,
  SmartphoneNfc,
  MessagesSquare,
  Star,
  CheckCircle2,
  MousePointerClick,
  Code2,
} from "lucide-react";

function useCounter(end, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (!startOnView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTime = null;
          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, startOnView]);

  return { count, ref };
}


function FadeIn({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const FEATURES = [
  {
    icon: Zap,
    title: "Blazing Fast",
    desc: "Real-time messaging powered by WebSockets for instant delivery.",
  },
  {
    icon: Shield,
    title: "End-to-End Secure",
    desc: "Your conversations stay private with enterprise-grade encryption.",
  },
  {
    icon: Bot,
    title: "AI Companions",
    desc: "Built-in AI assistants to help you draft, translate, and more.",
  },
  {
    icon: Palette,
    title: "Custom Themes",
    desc: "16+ beautiful themes to personalize your chat experience.",
  },
  {
    icon: Globe,
    title: "Cross Platform",
    desc: "Access your chats anywhere — desktop, tablet, or mobile.",
  },
  {
    icon: Users,
    title: "Group Chats",
    desc: "Create groups, share media, and collaborate effortlessly.",
  },
];

const CHAT_MESSAGES = [
  { id: 1, from: "Alex", text: "Hey! Have you tried Chatify yet? 🚀", time: "2:14 PM", self: false },
  { id: 2, from: "You", text: "Just signed up — the UI is insane! 🔥", time: "2:15 PM", self: true },
  { id: 3, from: "Alex", text: "Right?! And the AI feature is game-changing", time: "2:15 PM", self: false },
  { id: 4, from: "You", text: "Plus 16 themes to choose from 🎨", time: "2:16 PM", self: true },
];

export default function LandingPage() {
  const [headerSolid, setHeaderSolid] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [visibleMessages, setVisibleMessages] = useState(0);

  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/user/get-current-user");
        dispatch(login(res.data.data));
      } catch (error) {
        dispatch(logout());
      }
    };
    checkAuth();
  }, []);

  const fullText = "Connect. Chat. Collaborate.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 55);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const blink = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    const onScroll = () => setHeaderSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timers = CHAT_MESSAGES.map((_, i) =>
      setTimeout(() => setVisibleMessages((v) => v + 1), 1800 + i * 700)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden landing-scroll">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerSolid
          ? "glass-header shadow-lg shadow-black/20"
          : "bg-transparent"
          }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/chatify" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-theme-gradient shadow-lg shadow-theme-600/30 group-hover:scale-110 transition-transform duration-300">
              <MessageCircleMore className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Chatify
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">
              Features
            </a>
            <a href="#preview" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">
              Preview
            </a>
            <a href="#tech" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">
              Tech Stack
            </a>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                to="/chatify"
                className="group flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl bg-theme-gradient shadow-lg shadow-theme-600/30 hover:shadow-theme-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <MessagesSquare className="h-4 w-4" />
                Open Chats
              </Link>
            ) : (
              <>
                <Link
                  to="/chatify/sign-in"
                  className="text-sm font-medium text-zinc-300 hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/chatify/sign-up"
                  className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl bg-theme-gradient shadow-lg shadow-theme-600/30 hover:shadow-theme-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-20">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-theme-500 mix-blend-screen"
              style={{
                width: `${4 + i * 2}px`,
                height: `${4 + i * 2}px`,
                top: `${15 + i * 13}%`,
                left: `${10 + i * 15}%`,
                opacity: 0.2 + i * 0.05,
                animation: `landing-float ${5 + i * 1.5}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
                <Sparkles className="h-3.5 w-3.5 text-theme-400" />
                <span className="text-xs font-medium text-theme-300">
                  AI-Powered Chat Platform
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                The Future of
                <br />
                <span className="bg-gradient-to-r from-theme-400 via-theme-500 to-theme-600 bg-clip-text text-transparent">
                  Messaging
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="mt-6 text-lg sm:text-xl text-zinc-400 font-light max-w-lg mx-auto lg:mx-0">
                <span>{typedText}</span>
                <span
                  className="inline-block w-[2px] h-5 bg-theme-400 ml-0.5 align-middle"
                  style={{ opacity: showCursor ? 1 : 0 }}
                />
              </p>
            </FadeIn>

            <FadeIn delay={350}>
              <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                {isLoggedIn ? (
                  <Link
                    to="/chatify"
                    className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-theme-gradient text-white font-semibold text-base shadow-xl shadow-theme-600/25 hover:shadow-theme-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    <MessagesSquare className="h-5 w-5" />
                    Open Your Chats
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                ) : (
                  <Link
                    to="/chatify/sign-up"
                    className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-theme-gradient text-white font-semibold text-base shadow-xl shadow-theme-600/25 hover:shadow-theme-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    Start Chatting Free
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                )}
                <a
                  href="#features"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-white/10 text-zinc-300 font-medium text-base hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                >
                  <MousePointerClick className="h-4 w-4" />
                  Explore Features
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={500}>
              <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-zinc-500 text-xs">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-theme-400" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <SmartphoneNfc className="h-3.5 w-3.5 text-sky-400" />
                  <span>Works Everywhere</span>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={300} className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-8 bg-theme-500/10 rounded-3xl blur-3xl pointer-events-none" />

              <div className="relative glass-surface-heavy rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-black/40">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-white/8">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-theme-400 to-theme-600 flex items-center justify-center text-white text-sm font-bold">
                    A
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">Alex Johnson</p>
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      Online
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                      <MessagesSquare className="h-4 w-4 text-zinc-400" />
                    </div>
                  </div>
                </div>

                <div className="px-5 py-6 space-y-4 min-h-[280px]">
                  {CHAT_MESSAGES.map((msg, i) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.self ? "justify-end" : "justify-start"}`}
                      style={{
                        opacity: i < visibleMessages ? 1 : 0,
                        transform: i < visibleMessages ? "translateY(0) scale(1)" : "translateY(12px) scale(0.95)",
                        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${msg.self
                          ? "bg-theme-gradient text-white rounded-br-md"
                          : "bg-white/8 text-zinc-200 rounded-bl-md"
                          }`}
                      >
                        <p>{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${msg.self ? "text-white/50" : "text-zinc-500"}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-5 py-4 border-t border-white/8">
                  <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 outline-none"
                      readOnly
                    />
                    <div className="w-8 h-8 rounded-xl bg-theme-gradient flex items-center justify-center cursor-pointer hover:scale-110 active:scale-90 transition-transform">
                      <Send className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute -top-6 -right-6 glass-surface rounded-2xl border border-white/10 px-4 py-3 shadow-xl shadow-black/30"
                style={{
                  animation: "landing-float 4s ease-in-out infinite alternate",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Message Delivered</p>
                    <p className="text-[10px] text-zinc-500">Just now</p>
                  </div>
                </div>
              </div>

              <div
                className="absolute -bottom-4 -left-6 glass-surface rounded-2xl border border-white/10 px-4 py-3 shadow-xl shadow-black/30"
                style={{
                  animation: "landing-float 5s ease-in-out infinite alternate-reverse",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-theme-500/20 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-theme-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">AI Assistant</p>
                    <p className="text-[10px] text-zinc-500">Ready to help</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <a
          href="#features"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          <span className="text-xs">Scroll</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </a>
      </section>

      <section id="features" className="relative py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-theme-400" />
              <span className="text-xs font-medium text-theme-300">Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Everything You Need
            </h2>
            <p className="mt-4 text-zinc-400 text-lg max-w-2xl mx-auto">
              Built with modern tech stack for an unmatched chat experience.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 80}>
                <div className="group relative glass-surface rounded-2xl border border-white/8 p-7 hover:border-theme-500/30 hover:bg-white/[0.04] transition-all duration-500 cursor-default h-full">
                  <div className="absolute inset-0 rounded-2xl bg-theme-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-theme-500/15 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-theme-500/25 transition-all duration-300">
                      <f.icon className="h-6 w-6 text-theme-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {f.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="preview" className="relative py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
              <MessagesSquare className="h-3.5 w-3.5 text-theme-400" />
              <span className="text-xs font-medium text-theme-300">Live Preview</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              See It In Action
            </h2>
            <p className="mt-4 text-zinc-400 text-lg max-w-2xl mx-auto">
              A sneak peek at the beautiful chat experience that awaits you.
            </p>
          </FadeIn>

          <FadeIn>
            <div className="relative">
              <div className="absolute -inset-12 bg-theme-500/8 rounded-3xl blur-3xl pointer-events-none" />

              <div className="relative glass-surface-heavy rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-white/8 bg-white/[0.02]">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white/5 rounded-lg px-4 py-1.5 text-xs text-zinc-500 max-w-md mx-auto text-center">
                      chatify.app
                    </div>
                  </div>
                </div>

                <div className="flex min-h-[420px]">
                  <div className="w-72 border-r border-white/8 p-4 hidden sm:block">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-theme-gradient">
                        <MessageCircleMore className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-bold text-white">Chatify</span>
                    </div>

                    {[
                      { name: "Alex Johnson", msg: "The UI is insane! 🔥", online: true, time: "2m" },
                      { name: "Sarah Chen", msg: "Let's meet at 5pm", online: true, time: "15m" },
                      { name: "AI Assistant", msg: "How can I help?", online: false, time: "1h", ai: true },
                      { name: "Team Chat", msg: "Meeting notes shared", online: false, time: "3h" },
                      { name: "Maya Patel", msg: "Sent a photo 📸", online: true, time: "5h" },
                    ].map((chat, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 p-3 rounded-xl mb-1 cursor-pointer transition-colors duration-200 ${i === 0 ? "bg-theme-500/10 border border-theme-500/20" : "hover:bg-white/5"
                          }`}
                      >
                        <div className="relative">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ${chat.ai
                              ? "bg-gradient-to-br from-theme-400 to-theme-600"
                              : "bg-zinc-700"
                              }`}
                          >
                            {chat.ai ? <Bot className="h-4 w-4" /> : chat.name[0]}
                          </div>
                          {chat.online && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0e1016]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-white truncate">{chat.name}</p>
                            <span className="text-[10px] text-zinc-600">{chat.time}</span>
                          </div>
                          <p className="text-[11px] text-zinc-500 truncate">{chat.msg}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-white/8">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-theme-400 to-theme-600 flex items-center justify-center text-white text-sm font-bold">
                        A
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Alex Johnson</p>
                        <p className="text-[11px] text-emerald-400">Active now</p>
                      </div>
                    </div>

                    <div className="flex-1 p-5 space-y-3 overflow-hidden">
                      {CHAT_MESSAGES.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.self ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[70%] px-4 py-2 rounded-2xl text-xs ${msg.self
                              ? "bg-theme-gradient text-white rounded-br-md"
                              : "bg-white/8 text-zinc-200 rounded-bl-md"
                              }`}
                          >
                            <p>{msg.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="px-5 py-3 border-t border-white/8">
                      <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="flex-1 bg-transparent text-xs text-zinc-300 placeholder:text-zinc-600 outline-none"
                          readOnly
                        />
                        <div className="w-7 h-7 rounded-lg bg-theme-gradient flex items-center justify-center">
                          <Send className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="tech" className="relative py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
              <Code2 className="h-3.5 w-3.5 text-theme-400" />
              <span className="text-xs font-medium text-theme-300">Tech Stack</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Built With Modern Tech
            </h2>
            <p className="mt-4 text-zinc-400 text-lg max-w-2xl mx-auto">
              Powered by industry-leading technologies for speed, reliability, and scale.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                name: "React",
                desc: "Component-based UI with blazing-fast virtual DOM rendering.",
                color: "from-cyan-400 to-blue-500",
                iconBg: "bg-cyan-500/15",
                iconColor: "text-cyan-400",
                letter: "R",
              },
              {
                name: "Node.js",
                desc: "High-performance JavaScript runtime for scalable server-side logic.",
                color: "from-green-400 to-emerald-500",
                iconBg: "bg-emerald-500/15",
                iconColor: "text-emerald-400",
                letter: "N",
              },
              {
                name: "MongoDB",
                desc: "Flexible NoSQL database for fast, schema-less data storage.",
                color: "from-green-500 to-lime-500",
                iconBg: "bg-lime-500/15",
                iconColor: "text-lime-400",
                letter: "M",
              },
              {
                name: "Socket.IO",
                desc: "Real-time, bidirectional communication for instant messaging.",
                color: "from-yellow-400 to-orange-500",
                iconBg: "bg-orange-500/15",
                iconColor: "text-orange-400",
                letter: "S",
              },
              {
                name: "Tailwind CSS",
                desc: "Utility-first CSS framework for rapid, consistent UI design.",
                color: "from-sky-400 to-blue-500",
                iconBg: "bg-sky-500/15",
                iconColor: "text-sky-400",
                letter: "T",
              },
              {
                name: "Express",
                desc: "Minimal, flexible Node.js framework for robust REST APIs.",
                color: "from-violet-400 to-purple-500",
                iconBg: "bg-violet-500/15",
                iconColor: "text-violet-400",
                letter: "E",
              },
            ].map((tech, i) => (
              <FadeIn key={tech.name} delay={i * 80}>
                <div className="group relative glass-surface rounded-2xl border border-white/8 p-6 hover:border-white/15 transition-all duration-500 cursor-default h-full overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 pointer-events-none rounded-2xl`} />

                  <div className="relative z-10">
                      <div className={`w-12 h-12 rounded-xl ${tech.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <span className={`text-lg font-extrabold ${tech.iconColor}`}>{tech.letter}</span>
                    </div>
                    <h3 className="text-base font-semibold text-white mb-1.5">{tech.name}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{tech.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
              <Star className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-medium text-amber-300">Loved by Users</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              What People Say
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                name: "Priya Sharma",
                handle: "@priya_dev",
                text: "Chatify's UI is the most beautiful I've ever used. The theme customization is 🔥",
                avatar: "P",
              },
              {
                name: "James Wilson",
                handle: "@james_w",
                text: "The AI assistant feature is a game-changer. It helps me draft messages so much faster!",
                avatar: "J",
              },
              {
                name: "Sakura Tanaka",
                handle: "@sakura_t",
                text: "Finally a chat app that works flawlessly across all my devices. And it's completely free!",
                avatar: "S",
              },
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="glass-surface rounded-2xl border border-white/8 p-7 hover:border-theme-500/20 transition-all duration-500 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed flex-1">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/8">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-theme-400 to-theme-600 flex items-center justify-center text-white text-sm font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-zinc-500">{t.handle}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[500px] h-[500px] bg-theme-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-theme-gradient shadow-2xl shadow-theme-600/40 mx-auto mb-8 hover:scale-110 transition-transform duration-300">
                <MessageCircleMore className="h-10 w-10 text-white" />
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Ready to Start Chatting?
              </h2>
              <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto">
                Join thousands of users already enjoying Chatify. It's completely free, secure, and built for you.
              </p>

              {isLoggedIn ? (
                <Link
                  to="/chatify"
                  className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-theme-gradient text-white font-semibold text-lg shadow-xl shadow-theme-600/30 hover:shadow-theme-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <MessagesSquare className="h-5 w-5" />
                  Go to Your Chats
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-200" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/chatify/sign-up"
                    className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-theme-gradient text-white font-semibold text-lg shadow-xl shadow-theme-600/30 hover:shadow-theme-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    Get Started — It's Free
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-200" />
                  </Link>

                  <p className="mt-6 text-xs text-zinc-600">
                    No credit card required • Setup in 30 seconds
                  </p>
                </>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      <footer className="border-t border-white/8 px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-theme-gradient">
              <MessageCircleMore className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">Chatify</span>
          </div>
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Chatify. Built with ❤️
          </p>
          <div className="flex gap-6">
            {isLoggedIn ? (
              <Link to="/chatify" className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                <MessagesSquare className="h-3 w-3" />
                Open Chats
              </Link>
            ) : (
              <>
                <Link to="/chatify/sign-in" className="text-xs text-zinc-500 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/chatify/sign-up" className="text-xs text-zinc-500 hover:text-white transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
