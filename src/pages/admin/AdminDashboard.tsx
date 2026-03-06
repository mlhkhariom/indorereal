import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, MessageSquare, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ properties: 0, blogs: 0, enquiries: 0, newEnquiries: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [p, b, e, ne] = await Promise.all([
        supabase.from("properties").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("enquiries").select("id", { count: "exact", head: true }),
        supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      setStats({
        properties: p.count || 0,
        blogs: b.count || 0,
        enquiries: e.count || 0,
        newEnquiries: ne.count || 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Properties", value: stats.properties, icon: Building2, color: "text-blue-600" },
    { label: "Blog Posts", value: stats.blogs, icon: FileText, color: "text-green-600" },
    { label: "Total Enquiries", value: stats.enquiries, icon: MessageSquare, color: "text-orange-600" },
    { label: "New Enquiries", value: stats.newEnquiries, icon: TrendingUp, color: "text-red-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardHeader><CardTitle>Welcome to Admin Panel</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Manage your properties, blog posts, and enquiries from here. Use the sidebar navigation to access different sections.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
