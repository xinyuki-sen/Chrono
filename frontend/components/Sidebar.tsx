"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HomeIcon, 
  BookmarkIcon, 
  ChatBubbleLeftRightIcon, 
  WrenchScrewdriverIcon, 
  ChartBarIcon, 
  SparklesIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";

const SOURCES = [
  { name: "ArXiv", color: "#3b82f6" },
  { name: "HuggingFace", color: "#f97316" },
  { name: "DeepMind", color: "#10b981" },
  { name: "OpenAI", color: "#8b5cf6" },
  { name: "Google AI", color: "#ef4444" },
  { name: "ProductHunt", color: "#f43f5e" },
  { name: "O'Reilly", color: "#06b6d4" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Feed", href: "/", icon: HomeIcon, badge: "Live" },
    { name: "Saved", href: "/saved", icon: BookmarkIcon },
    { name: "Prompts", href: "/prompts", icon: ChatBubbleLeftRightIcon },
    { name: "Tools", href: "/tools", icon: WrenchScrewdriverIcon },
    { name: "Models", href: "/models", icon: ChartBarIcon },
    { name: "Concepts", href: "/concepts", icon: SparklesIcon },
  ];

  return (
    <aside className="w-64 flex-shrink-0 h-screen bg-[#0b0f17] text-slate-300 flex flex-col border-r border-slate-800/80 select-none z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/60">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">Chrono</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">AI News & Intelligence Hub</p>
          </div>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-3">
          Explore
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 stroke-[2.2]" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Sources Section */}
        <div className="pt-6">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-3">
            Tracked Feeds
          </div>
          <div className="space-y-1">
            {SOURCES.map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2 h-2 rounded-full shadow-sm"
                    style={{ backgroundColor: s.color }}
                  />
                  <span>{s.name}</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Active Feed" />
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer Info */}
      <div className="p-3.5 border-t border-slate-800/80 bg-[#070a10]">
        <div className="flex items-center justify-between text-xs px-2 py-1 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium text-slate-300">Scraper: Hourly</span>
          </div>
          <a
            href="https://github.com/xinyuki-sen/Chrono"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors flex items-center gap-1 text-[11px]"
          >
            GitHub
            <ArrowTopRightOnSquareIcon className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
}
