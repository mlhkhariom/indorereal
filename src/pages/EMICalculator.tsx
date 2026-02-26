import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Calculator, IndianRupee, Phone } from "lucide-react";
import { useState, useMemo } from "react";

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const result = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenure * 12;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    return { emi: Math.round(emi), totalPayment: Math.round(totalPayment), totalInterest: Math.round(totalInterest) };
  }, [loanAmount, interestRate, tenure]);

  const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const principalPercent = Math.round((loanAmount / result.totalPayment) * 100);

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
              <span className="text-primary-foreground">EMI Calculator</span>
            </nav>
            <ScrollReveal>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight">
                EMI <span className="text-gold-gradient">Calculator</span>
              </h1>
              <p className="text-primary-foreground/60 text-lg md:text-xl mt-4 max-w-2xl leading-relaxed">
                Plan your home loan with our easy EMI calculator. Adjust the values to see your monthly payment instantly.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Calculator */}
        <section className="section-padding bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
              {/* Inputs */}
              <ScrollReveal>
                <div className="card-elevated p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />
                  <h2 className="font-heading font-bold text-foreground text-2xl mb-8 flex items-center gap-2">
                    <Calculator className="h-6 w-6 text-secondary" /> Loan Details
                  </h2>

                  <div className="space-y-8">
                    {/* Loan Amount */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-heading font-semibold text-foreground">Loan Amount</label>
                        <span className="text-secondary font-heading font-bold text-lg">{formatINR(loanAmount)}</span>
                      </div>
                      <input
                        type="range"
                        min={500000}
                        max={50000000}
                        step={100000}
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full h-2 rounded-full bg-muted appearance-none cursor-pointer accent-secondary"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>₹5L</span>
                        <span>₹5Cr</span>
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-heading font-semibold text-foreground">Interest Rate (% p.a.)</label>
                        <span className="text-secondary font-heading font-bold text-lg">{interestRate}%</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={15}
                        step={0.1}
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full h-2 rounded-full bg-muted appearance-none cursor-pointer accent-secondary"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>5%</span>
                        <span>15%</span>
                      </div>
                    </div>

                    {/* Tenure */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-heading font-semibold text-foreground">Loan Tenure (Years)</label>
                        <span className="text-secondary font-heading font-bold text-lg">{tenure} years</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={30}
                        step={1}
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                        className="w-full h-2 rounded-full bg-muted appearance-none cursor-pointer accent-secondary"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>1 yr</span>
                        <span>30 yrs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Results */}
              <ScrollReveal delay={0.15}>
                <div className="space-y-6">
                  {/* EMI Amount */}
                  <div className="navy-gradient rounded-2xl p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
                    <p className="text-primary-foreground/50 text-sm font-medium uppercase tracking-widest">Monthly EMI</p>
                    <p className="font-heading text-4xl md:text-5xl font-extrabold text-secondary mt-2 flex items-center justify-center gap-1">
                      <IndianRupee className="h-8 w-8" />
                      {result.emi.toLocaleString("en-IN")}
                    </p>
                    <p className="text-primary-foreground/40 text-xs mt-2">per month</p>
                  </div>

                  {/* Breakdown */}
                  <div className="card-elevated p-6">
                    <h3 className="font-heading font-bold text-foreground text-sm uppercase tracking-wider mb-5">Loan Breakdown</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">Principal Amount</span>
                        <span className="font-heading font-bold text-foreground">{formatINR(loanAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">Total Interest</span>
                        <span className="font-heading font-bold text-destructive">{formatINR(result.totalInterest)}</span>
                      </div>
                      <div className="border-t border-border pt-4 flex justify-between items-center">
                        <span className="text-foreground font-heading font-semibold text-sm">Total Payment</span>
                        <span className="font-heading font-bold text-foreground text-lg">{formatINR(result.totalPayment)}</span>
                      </div>
                    </div>

                    {/* Visual bar */}
                    <div className="mt-6">
                      <div className="h-4 rounded-full overflow-hidden bg-muted flex">
                        <div className="bg-secondary rounded-l-full" style={{ width: `${principalPercent}%` }} />
                        <div className="bg-destructive/60 rounded-r-full" style={{ width: `${100 - principalPercent}%` }} />
                      </div>
                      <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-secondary" /> Principal ({principalPercent}%)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-destructive/60" /> Interest ({100 - principalPercent}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <a href="tel:+919876543210" className="block">
                    <button className="w-full btn-gold py-4 rounded-xl text-sm inline-flex items-center justify-center gap-2">
                      <Phone className="h-4 w-4" /> Get Best Loan Rates — Call Now
                    </button>
                  </a>
                </div>
              </ScrollReveal>
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

export default EMICalculator;
