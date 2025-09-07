import { useState, useEffect, useCallback } from "react";
import ClientTable from "../components/ClientTable";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { RefreshCw, ChevronLeft, ChevronRight, Building2, TrendingUp, Users, Activity } from "lucide-react";

export default function ClientsMorales() {
  const [morales, setMorales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const limit = 10;

  const { token } = useAuth();

  const [filters, setFilters] = useState({
    sortBy: "score" as "score" | "ref",
    sortDir: "desc" as "asc" | "desc",
    moraleSegment: "",
    moraleRisk: "",
  });

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${import.meta.env.VITE_BACKEND_LINK}/clients/morale`);
      url.searchParams.set("limit", String(limit));
      url.searchParams.set("offset", String(offset));
      url.searchParams.set("include_total", "false");
      url.searchParams.set("sort_by", filters.sortBy);
      url.searchParams.set("sort_dir", filters.sortDir);
      if (filters.moraleSegment) url.searchParams.set("segment", filters.moraleSegment);
      if (filters.moraleRisk) url.searchParams.set("business_risk", filters.moraleRisk);

      const res = await fetch(url.toString(), {
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || `Failed to fetch clients: ${res.status}`);
      }
      const json = await res.json();
      const items: any[] = json.items ?? [];
      const mapped = items.map((it) => ({ ...it, type: "moral" }));
      setMorales(mapped);
      setHasMore(Boolean(json.has_more) || items.length === limit);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [offset, filters, token]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const updateClient = (u: any) => setMorales((prev) => prev.map((c) => (c.ref_personne === u.ref_personne ? u : c)));

  const markMessaged = (ref: string) => setMorales((prev) => prev.map((c) => (c.ref_personne === ref ? { ...c, lastContact: "whatsapp" } : c)));

  const onApplyFilters = async (payload: any) => {
    setFilters({
      sortBy: payload.sortBy,
      sortDir: payload.sortDir,
      moraleSegment: payload.moraleSegment ?? "",
      moraleRisk: payload.moraleRisk ?? "",
    });
    setOffset(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative z-10 flex items-center justify-center py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl glass-premium flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-brand-primary animate-spin" />
              </div>
              <div className="absolute -inset-1 bg-gradient-brand rounded-2xl opacity-20 animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-1">Loading Corporate Clients</h3>
              <p className="text-foreground-muted">Fetching premium data...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden p-6">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative z-10 flex items-center justify-center py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="card-premium max-w-md w-full text-center border-error/20"
          >
            <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-error" />
            </div>
            <h3 className="text-xl font-semibold text-error mb-2">Error Loading Clients</h3>
            <p className="text-error/80 mb-6">{error}</p>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchClients} 
              className="btn-glass px-6 py-3 rounded-xl font-medium transition-all hover:shadow-premium"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
      <div className="absolute inset-0 pattern-dots opacity-5" />
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow">
                <Building2 className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-gold flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground-secondary bg-clip-text text-transparent">
                Corporate Clients
              </h1>
              <p className="text-foreground-muted">Manage your premium business accounts</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-premium border border-glass-border/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-brand/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{morales.length}</p>
                  <p className="text-sm text-foreground-muted">Active Clients</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-premium border border-glass-border/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-brand-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {morales.filter(c => c.score > 70).length}
                  </p>
                  <p className="text-sm text-foreground-muted">High Score</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-premium border border-glass-border/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-gold/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round(morales.reduce((acc, c) => acc + (c.score || 0), 0) / morales.length || 0)}
                  </p>
                  <p className="text-sm text-foreground-muted">Avg Score</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="card-premium border border-glass-border/30 p-0 overflow-hidden">
            <ClientTable
              title="Corporate Clients"
              clients={morales}
              onUpdateClient={updateClient}
              onMessageSent={markMessaged}
              onApplyFilters={onApplyFilters}
              currentFilters={filters}
            />
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-foreground-muted"
            >
              Showing <span className="font-medium text-foreground">{morales.length}</span> corporate clients
            </motion.p>
            
            <div className="flex items-center gap-2">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={offset === 0} 
                onClick={() => setOffset((prev) => Math.max(0, prev - limit))} 
                className="btn-glass flex items-center gap-2 px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> 
                Previous
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!hasMore} 
                onClick={() => setOffset((prev) => prev + limit)} 
                className="btn-glass flex items-center gap-2 px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next 
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}