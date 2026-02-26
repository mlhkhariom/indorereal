import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Calendar, User, ArrowRight, Clock } from "lucide-react";

const blogPosts = [
  {
    id: "1",
    slug: "best-localities-indore-2025",
    title: "Top 10 Best Localities to Buy Property in Indore (2025)",
    excerpt: "Indore is rapidly growing as a real estate hub. Discover the top localities like Vijay Nagar, Super Corridor, and more that offer the best ROI for property buyers.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    category: "Market Insights",
    date: "Feb 20, 2025",
    readTime: "8 min read",
    author: "Vikram Malhotra",
  },
  {
    id: "2",
    slug: "rera-guide-madhya-pradesh",
    title: "Complete RERA Guide for Property Buyers in Madhya Pradesh",
    excerpt: "Understand RERA registration, compliance, and how it protects your investment. A must-read before purchasing any property in MP.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
    category: "Legal & RERA",
    date: "Feb 15, 2025",
    readTime: "6 min read",
    author: "Rahul Agarwal",
  },
  {
    id: "3",
    slug: "home-loan-tips-first-time-buyers",
    title: "Home Loan Tips: What Every First-Time Buyer Should Know",
    excerpt: "From choosing the right bank to understanding EMI calculations — here's everything you need to know before applying for a home loan.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    category: "Finance",
    date: "Feb 10, 2025",
    readTime: "7 min read",
    author: "Sneha Joshi",
  },
  {
    id: "4",
    slug: "super-corridor-investment-guide",
    title: "Why Super Corridor is the Best Investment Destination in Indore",
    excerpt: "With IT parks, metro plans, and rapid infrastructure development — Super Corridor is set to become Indore's most valuable real estate zone.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    category: "Investment",
    date: "Feb 5, 2025",
    readTime: "5 min read",
    author: "Vikram Malhotra",
  },
  {
    id: "5",
    slug: "vastu-tips-new-home",
    title: "Vastu Tips for Buying a New Home in Indore",
    excerpt: "Follow these essential Vastu Shastra guidelines when selecting your new property for positive energy and prosperity.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    category: "Tips & Guides",
    date: "Jan 28, 2025",
    readTime: "4 min read",
    author: "Pooja Verma",
  },
  {
    id: "6",
    slug: "commercial-property-indore",
    title: "Commercial Property Investment in Indore: A Complete Guide",
    excerpt: "From office spaces to retail shops — explore why Indore's commercial real estate market is booming and how you can benefit.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    category: "Commercial",
    date: "Jan 20, 2025",
    readTime: "9 min read",
    author: "Amit Jain",
  },
];

const categories = ["All", "Market Insights", "Legal & RERA", "Finance", "Investment", "Tips & Guides", "Commercial"];

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="navy-gradient pt-28 pb-16 relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-secondary/10 blur-[100px]" />
          <div className="container mx-auto px-4 lg:px-8 relative">
            <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/50 mb-6">
              <Link to="/" className="hover:text-secondary transition-colors flex items-center gap-1">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-primary-foreground">Blog</span>
            </nav>
            <ScrollReveal>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight">
                Real Estate <span className="text-gold-gradient">Blog</span>
              </h1>
              <p className="text-primary-foreground/60 text-lg md:text-xl mt-4 max-w-2xl leading-relaxed">
                Expert insights, market trends, and property guides to help you make smarter real estate decisions in Indore.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-background border-b border-border sticky top-[72px] z-30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-4 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    cat === "All"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-secondary/10 hover:text-secondary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="section-padding bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 0.08}>
                  <article className="card-elevated overflow-hidden group h-full flex flex-col">
                    <div className="relative overflow-hidden aspect-[16/10]">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                      </div>
                      <h3 className="font-heading font-bold text-foreground text-lg leading-snug group-hover:text-secondary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mt-2 flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <User className="h-3 w-3" /> {post.author}
                        </span>
                        <span className="text-secondary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
      <div className="lg:hidden h-28" />
    </div>
  );
};

export default Blog;
