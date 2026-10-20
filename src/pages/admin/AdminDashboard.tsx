import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, CalendarCheck, TrendingUp, Eye, Inbox } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, Cell } from "recharts";
import { PIPELINE_STAGES, normalizeStage, followUpBucket } from "@/lib/crm";

const AdminDashboard = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [props, setProps] = useState<any[]>([]);
  const [visits, setVisits] = useState(0);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    Promise.all([
      supabase.from("enquiries").select("id,status,created_at,source,follow_up_at"),
      supabase.from("properties").select("id,title,slug,view_count"),
      supabase.from("site_visits").select("id", { count: "exact", head: true }).gte("visit_at", new Date().toISOString()).neq("status", "cancelled"),
      supabase.from("property_submissions").select("id", { count: "exact", head: true }).eq("review_status", "pending"),
    ]).then(([l, p, v, s]) => { setLeads(l.data || []); setProps(p.data || []); setVisits(v.count || 0); setPending(s.count || 0); });
  }, []);

  const daily = useMemo(() => {
    const days = [...Array(30)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - 29 + i); return d; });
    return days.map((d) => ({ day: d.toLocaleDateString(undefined, { day: "numeric", month: "short" }), leads: leads.filter((l) => new Date(l.created_at).toDateString() === d.toDateString()).length }));
  }, [leads]);
  const funnel = PIPELINE_STAGES.map((s) => ({ stage: s.label, count: leads.filter((l) => normalizeStage(l.status) === s.id).length }));
  const sources: [string, number][] = Object.entries(leads.reduce(<(a: Record<string, number>, l) => { const k = (l.source || "website").replace(/_/g, " "); a[k] = (a[k] || 0) + 1; return a; }, {}) as Record<string, number>).sort((a, b) => b[1] - a[1]);
  const topProps = [...props].sort((a, b) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 5);
  const won = leads.filter((l) => normalizeStage(l.status) === "won").length;
  const due = leads.filter((l) => ["overdue", "today"].includes(followUpBucket(l.follow_up_at))).length;

  const kpis = [
    { label: "Total Leads", value: leads.length, icon: Users, to: "/admin/crm" },
    { label: "Follow-ups Due", value: due, icon: TrendingUp, to: "/admin/crm" },
    { label: "Upcoming Visits", value: visits, icon: CalendarCheck, to: "/admin/visits" },
    { label: "Conversion", value: leads.length ? `${Math.round((won / leads.length) * 100)}%` : "0%", icon: TrendingUp, to: "/admin/crm" },
    { label: "Properties", value: props.length, icon: Building2, to: "/admin/properties" },
    { label: "Owner Submissions", value: pending, icon: Inbox, to: "/admin/submissions" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((k) => (
          <Link key={k.label} to={k.to}>
            <Card className="hover:border-secondary transition-colors h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">{k.label}</p><k.icon className="h-4 w-4 text-secondary" /></div>
                <p className="text-2xl font-bold mt-1">{k.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Leads — last 30 days</CardTitle></CardHeader>
          <CardContent className="h-64 pl-0">
            <ResponsiveContainer>
              <AreaChart data={daily}>
                <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.5} /><stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={30} />
                <Tooltip />
                <Area type="monotone" dataKey="leads" stroke="hsl(var(--secondary))" fill="url(#g)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Pipeline</CardTitle></CardHeader>
          <CardContent className="h-64 pl-0">
            <ResponsiveContainer>
              <BarChart data={funnel} layout="vertical">
                <XAxis type="number" hide allowDecimals={false} />
                <YAxis type="category" dataKey="stage" width={90} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {funnel.map((_, i) => <Cell key={i} fill={i >= 4 ? (i === 4 ? "hsl(var(--secondary))" : "hsl(var(--muted-foreground))") : "hsl(var(--primary))"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Eye className="h-4 w-4" />Most viewed properties</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {topProps.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm gap-2">
                <a href={`/property/${p.slug}`} target="_blank" rel="noreferrer" className="truncate hover:text-secondary">{p.title}</a>
                <span className="font-semibold shrink-0">{p.view_count || 0}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Lead sources</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {sources.length === 0 && <p className="text-sm text-muted-foreground">No leads yet.</p>}
            {sources.map(([k, v]) => (
              <div key={k}>
                <div className="flex justify-between text-sm capitalize"><span>{k}</span><span className="font-semibold">{v}</span></div>
                <div className="h-2 rounded-full bg-muted mt-1"><div className="h-2 rounded-full bg-secondary" style={{ width: `${(v / leads.length) * 100}%` }} /></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default AdminDashboard;
