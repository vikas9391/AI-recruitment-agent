import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { recruitmentPipeline } from "../../constants/mockData";

export function PipelineCard() {
  const max = recruitmentPipeline[0].count;

  return (
    <GlassCard hover={false}>
      <h3 className="text-sm font-semibold text-ink mb-5">Recruitment Pipeline</h3>
      <div className="flex items-end gap-4 md:gap-6 overflow-x-auto pb-1">
        {recruitmentPipeline.map((stage, i) => {
          const heightPct = Math.max((stage.count / max) * 100, 6);
          return (
            <div key={stage.stage} className="flex flex-col items-center gap-2 min-w-[64px]">
              <div className="h-28 w-9 rounded-full bg-ink/5 flex items-end overflow-hidden">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${heightPct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                  className="w-full rounded-full bg-gradient-to-t from-accent-blue to-accent-purple"
                />
              </div>
              <p className="text-xs font-semibold text-ink">{stage.count}</p>
              <p className="text-[11px] text-ink-secondary text-center">{stage.stage}</p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}