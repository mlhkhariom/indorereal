import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { Home, ChevronRight, Calendar, User, ArrowRight, Clock } from "lucide-react";

interface BlogPost {
  id: string; slug: string; title: string; excerpt: string | null;
  cover_image: string | null; category: string; author_name: string;
  read_time: number | null; created_at: string; published: boolean;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, cover_image, category, author_name, read_time, created_at, published")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (data) setPosts(data as BlogPost[]);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const filtered = activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="navy-gradient pt-28 pb-16 relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-secondary/10 blur-[100px]" />
          <div className="container mx-auto px-4 lg:px-8 relative">
            <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/50 mb-6">
              <Link to="/" className="hover:text-secondary transition-colors flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Home</Link>
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

        <section className="bg-background border-b border-border sticky top-[72px] z-30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-4 no-scrollbar">
              {categories.map((cat) => (
                <button key={cat} onClick={() => { const params = new URLSearchParams(); if (cat !== "All") params.set("category", cat); setSearchParams(params); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary/10 hover:text-secondary"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="card-elevated h-96 animate-pulse bg-muted rounded-2xl" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24"><p className="text-muted-foreground text-lg">No blog posts found in this category.</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((post, i) => (
                  <ScrollReveal key={post.id} delay={i * 0.08}>
                    <Link to={`/blog/${post.slug}`} className="block">
                      <article className="card-elevated overflow-hidden group h-full flex flex-col">
                        <div className="relative overflow-hidden aspect-[16/10]">
                          <img src={post.cover_image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">{post.category}</span>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(post.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.read_time || 5} min read</span>
                          </div>
                          <h3 className="font-heading font-bold text-foreground text-lg leading-snug group-hover:text-secondary transition-colors line-clamp-2">{post.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed mt-2 flex-1 line-clamp-3">{post.excerpt}</p>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><User className="h-3 w-3" /> {post.author_name}</span>
                            <span className="text-secondary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Read <ArrowRight className="h-3.5 w-3.5" /></span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            )}
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
