import { motion } from "framer-motion";

const COMPANIES = ["Microsoft", "Google", "Amazon", "Adobe", "Oracle", "IBM", "Infosys"];

// Duplicated once so the track can loop seamlessly at -50%.
const TRACK = [...COMPANIES, ...COMPANIES];

export function TrustedBy() {
  return (
    <section id="trusted-by" className="px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-ink">Trusted by Innovative Companies</h2>
        </motion.div>

        <div className="relative mt-12 overflow-hidden glass-card py-8">
          {/* Edge fade masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-glass-card to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-glass-card to-transparent z-10" />

          <motion.div
            className="flex w-max items-center gap-16 sm:gap-24"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 26, ease: "linear" }}
          >
            {TRACK.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="shrink-0 text-xl sm:text-2xl font-extrabold tracking-tight text-ink-secondary/40 grayscale transition-all duration-300 hover:grayscale-0 hover:text-ink hover:scale-105"
              >
                {name}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}