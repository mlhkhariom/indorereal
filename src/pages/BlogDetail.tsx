import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import { Home, ChevronRight, Calendar, User, Clock, Tag } from "lucide-react";
import { Helmet } from "react-helmet-async";

interface BlogPost {
  id: string; slug: string; title: string; excerpt: string | null; content: string;
  cover_image: string | null; category: string; tags: string[]; author_name: string;
  read_time: number | null; created_at: string; seo_title: string | null;
  seo_description: string | null; seo_keywords: string | null;
}

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (data) {
        setPost(data as BlogPost);
        // Fetch related posts
        const { data: related } = await supabase
          .from("blog_posts")
          .select("id, slug, title, cover_image, category, created_at, read_time, author_name, excerpt")
          .eq("published", true)
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(3);
        if (related) setRelatedPosts(related as BlogPost[]);
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Blog Post Not Found</h1>
            <Link to="/blog" className="text-secondary hover:underline font-medium">Browse all posts</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const publishDate = new Date(post.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  // Simple markdown-like content rendering
  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} className="font-heading font-bold text-xl text-foreground mt-8 mb-3">{line.replace("## ", "")}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="font-heading font-bold text-lg text-foreground mt-6 mb-2">{line.replace("### ", "")}</h3>;
      if (line.startsWith("- ")) return <li key={i} className="text-muted-foreground ml-4 mb-1">{line.replace("- ", "")}</li>;
      if (line.startsWith("|")) return null; // Skip table rows for simple rendering
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className="text-muted-foreground leading-relaxed mb-2">{line}</p>;
    });
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    image: post.cover_image,
    author: { "@type": "Person", name: post.author_name },
    publisher: { "@type": "Organization", name: "Indore Realty", logo: { "@type": "ImageObject", url: "https://indorerealty.in/logo.png" } },
    datePublished: post.created_at,
    dateModified: post.created_at,
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://indorerealty.in/blog/${post.slug}` },
    keywords: post.seo_keywords || post.tags?.join(", "),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{post.seo_title || post.title} | Indore Realty</title>
        <meta name="description" content={post.seo_description || post.excerpt || ""} />
        {post.seo_keywords && <meta name="keywords" content={post.seo_keywords} />}
        <meta property="og:title" content={post.seo_title || post.title} />
        <meta property="og:description" content={post.seo_description || post.excerpt || ""} />
        <meta property="og:type" content="article" />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
        <meta property="og:url" content={`https://indorerealty.in/blog/${post.slug}`} />
        <link rel="canonical" href={`https://indorerealty.in/blog/${post.slug}`} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>
      <Header />
      <main className="flex-1 bg-muted">
        <div className="navy-gradient pt-24 pb-6">
          <div className="container mx-auto px-4 lg:px-8">
            <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/50">
              <Link to="/" className="hover:text-secondary transition-colors flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Home</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link to="/blog" className="hover:text-secondary transition-colors">Blog</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-primary-foreground truncate max-w-[200px]">{post.title}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              {post.cover_image && (
                <div className="rounded-2xl overflow-hidden aspect-video shadow-lg mb-8">
                  <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="card-elevated p-6 lg:p-10">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20 mb-4">{post.category}</span>
                <h1 className="font-heading text-2xl md:text-4xl font-bold text-card-foreground leading-tight mb-4">{post.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
                  <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {post.author_name}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {publishDate}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.read_time || 5} min read</span>
                </div>

                <article className="prose prose-lg max-w-none">
                  {renderContent(post.content)}
                </article>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
                    <Tag className="h-4 w-4 text-muted-foreground mt-1" />
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full text-xs bg-muted text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <h2 className="font-heading font-bold text-xl text-foreground mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedPosts.map((rp) => (
                    <Link key={rp.id} to={`/blog/${rp.slug}`} className="card-elevated overflow-hidden group">
                      {rp.cover_image && <img src={rp.cover_image} alt={rp.title} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" />}
                      <div className="p-4">
                        <h3 className="font-heading font-semibold text-sm text-foreground line-clamp-2 group-hover:text-secondary transition-colors">{rp.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(rp.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <div className="lg:hidden h-28" />
    </div>
  );
};

export default BlogDetail;
