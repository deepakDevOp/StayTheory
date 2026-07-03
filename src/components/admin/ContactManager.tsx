import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail, Instagram, MessageCircle,
  Clock, Save, CheckCircle2, ChevronDown, ChevronUp, Loader2,
} from "lucide-react";
import { adminService } from "../../services/adminService";

const defaultSettings = {
  whatsapp: "",
  email: "",
  instagram: "",
  hours_weekday: "",
  hours_weekend: "",
};

interface SectionProps {
  title: string;
  icon: React.ElementType;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function Section({ title, icon: Icon, open, onToggle, children }: SectionProps) {
  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${open ? "border-accent/20 shadow-sm" : "border-stone-100"}`}>
      <button
        type="button"
        className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-stone-50 transition-colors"
        onClick={onToggle}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${open ? "bg-accent/10" : "bg-stone-100"}`}>
          <Icon className={`w-4 h-4 ${open ? "text-accent" : "text-stone-400"}`} />
        </div>
        <span className={`flex-1 text-[13px] font-semibold tracking-wide ${open ? "text-accent" : "text-stone-700"}`}>{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-stone-300" /> : <ChevronDown className="w-4 h-4 text-stone-300" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4 pt-1 space-y-3 border-t border-stone-50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  prefix?: string;
}

function Field({ label, placeholder, value, onChange, type = "text", prefix }: FieldProps) {
  return (
    <div>
      <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-stone-300 block mb-1.5 pl-1">{label}</label>
      <div className={`flex items-center bg-stone-50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-accent/20 transition-all`}>
        {prefix && (
          <span className="pl-3 pr-1 text-[11px] text-stone-400 font-mono shrink-0">{prefix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-3 text-[13px] text-stone-700 focus:outline-none placeholder:text-stone-300"
        />
      </div>
    </div>
  );
}

export default function ContactManager() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string>("whatsapp");

  useEffect(() => {
    adminService.getContactSettings()
      .then(data => setSettings({ ...defaultSettings, ...data }))
      .catch(() => setError("Failed to load contact settings."))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) => setOpenSection(prev => prev === id ? "" : id);

  const set = (key: keyof typeof defaultSettings) => (value: string) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await adminService.updateContactSettings(settings);
      setSettings({ ...defaultSettings, ...updated });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
          className="font-serif italic text-stone-400">Loading contact settings...</motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">

      {/* Header */}
      <div className="shrink-0 pb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-serif italic text-accent leading-tight">Contact Settings</h1>
          <p className="text-xs text-stone-400 mt-0.5">Manage your public contact information</p>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest shrink-0 mt-1 transition-all duration-300 disabled:opacity-60 ${
            saved ? "bg-emerald-500 text-white" : "bg-stone-900 text-white"
          }`}
        >
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.span key="saved" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved
              </motion.span>
            ) : saving ? (
              <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving
              </motion.span>
            ) : (
              <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5" /> Save
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="shrink-0 mb-3 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-red-500 text-[11px] font-medium">
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sections */}
      <div className="flex-grow overflow-y-auto no-scrollbar space-y-3 pb-6">

        <Section title="WhatsApp" icon={MessageCircle} open={openSection === "whatsapp"} onToggle={() => toggle("whatsapp")}>
          <Field label="WhatsApp Number" placeholder="+91 98765 43210" value={settings.whatsapp} onChange={set("whatsapp")} type="tel" />
        </Section>

        <Section title="Email" icon={Mail} open={openSection === "email"} onToggle={() => toggle("email")}>
          <Field label="Email Address" placeholder="hello@staytheory.com" value={settings.email} onChange={set("email")} type="email" />
        </Section>

        <Section title="Instagram" icon={Instagram} open={openSection === "instagram"} onToggle={() => toggle("instagram")}>
          <Field label="Instagram Handle" placeholder="staytheory" value={settings.instagram} onChange={set("instagram")} prefix="@" />
        </Section>

        <Section title="Business Hours" icon={Clock} open={openSection === "hours"} onToggle={() => toggle("hours")}>
          <Field label="Weekdays (Mon – Fri)" placeholder="9:00 AM – 8:00 PM" value={settings.hours_weekday} onChange={set("hours_weekday")} />
          <Field label="Weekends (Sat – Sun)" placeholder="10:00 AM – 6:00 PM" value={settings.hours_weekend} onChange={set("hours_weekend")} />
        </Section>

        {/* Preview card */}
        <div className="bg-stone-900 rounded-2xl p-5 space-y-3">
          <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-500 mb-3">Preview</p>

          {settings.whatsapp && (
            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="text-white/80 text-[12px]">{settings.whatsapp}</span>
            </div>
          )}

          {settings.email && (
            <div className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="text-white/80 text-[12px]">{settings.email}</span>
            </div>
          )}

          {settings.instagram && (
            <div className="flex items-center gap-2.5">
              <Instagram className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="text-white/80 text-[12px]">@{settings.instagram}</span>
            </div>
          )}

          {(settings.hours_weekday || settings.hours_weekend) && (
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              {settings.hours_weekday && (
                <div className="flex items-center gap-2.5">
                  <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="text-white/50 text-[10px]">Mon–Fri</span>
                  <span className="text-white/80 text-[12px]">{settings.hours_weekday}</span>
                </div>
              )}
              {settings.hours_weekend && (
                <div className="flex items-center gap-2.5">
                  <Clock className="w-3.5 h-3.5 text-accent/40 shrink-0" />
                  <span className="text-white/50 text-[10px]">Sat–Sun</span>
                  <span className="text-white/80 text-[12px]">{settings.hours_weekend}</span>
                </div>
              )}
            </div>
          )}

          {!settings.whatsapp && !settings.email && !settings.instagram && !settings.hours_weekday && (
            <p className="text-stone-600 text-[11px] italic text-center py-2">Fill in the fields above to preview</p>
          )}
        </div>

      </div>
    </motion.div>
  );
}
