import { motion } from "framer-motion";

function EmptyCartAnimation() {
  return (
    <div className="flex justify-center items-center h-[60vh]">

      {/* Cart container */}
      <div className="relative w-48 h-48 border-2 rounded-lg flex items-end justify-center overflow-hidden">
        
        {/* Cart icon */}
        <div className="absolute bottom-2 text-4xl">🛒</div>

        {/* Falling items */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ y: -150, opacity: 0 }}
            animate={{ y: 60, opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 1.5,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeIn",
            }}
            className="absolute text-2xl"
          >
            📦
          </motion.div>
        ))}

      </div>
    </div>
  );
}
export default EmptyCartAnimation