import { Plus, Trash2, Percent } from "lucide-react";
import { motion } from "motion/react";

interface EditorRulesProps {
  rules: string[];
  newRule: string;
  onNewRuleChange: (val: string) => void;
  onAddRule: () => void;
  onRemoveRule: (index: number) => void;
}

export default function EditorRules({ rules, newRule, onNewRuleChange, onAddRule, onRemoveRule }: EditorRulesProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
      <section>
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-8 flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" /> Sanctuary Rules
        </h3>
        <div className="space-y-4">
          {rules.map((rule, i) => (
            <div key={i} className="flex items-center justify-between p-6 bg-white rounded-2xl border border-stone-100 shadow-sm group">
              <span className="text-sm text-stone-600 font-medium">{rule}</span>
              <button onClick={() => onRemoveRule(i)} className="text-stone-300 hover:text-red-500 transition-colors p-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex gap-4 mt-6">
            <input 
              type="text" 
              value={newRule}
              onChange={(e) => onNewRuleChange(e.target.value)}
              placeholder="Add a new sanctuary rule..."
              className="flex-grow bg-white border border-stone-100 rounded-2xl px-6 py-4 outline-none focus:border-primary/20 transition-all text-sm"
            />
            <button onClick={onAddRule} className="bg-stone-900 text-white px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all">Add</button>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-8 flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" /> Dynamic Discounts
        </h3>
        <div className="bg-stone-900 p-10 rounded-[2.5rem] text-white">
          <div className="flex items-center gap-4 mb-8">
            <Percent className="w-6 h-6 text-primary" />
            <h4 className="text-xl font-serif italic">Seasonal Promotions</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Discount Percentage</label>
              <input type="text" placeholder="e.g. 15%" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-primary transition-all" />
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Promotion Name</label>
              <input type="text" placeholder="e.g. Summer Solstice" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-primary transition-all" />
            </div>
          </div>
          <button className="mt-8 bg-primary text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all">
            Activate Discount
          </button>
        </div>
      </section>
    </motion.div>
  );
}
