import { motion } from "framer-motion";

export default function BackgroundBlob() {
  return (
    <motion.div
      className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500 rounded-full opacity-20 blur-2xl pointer-events-none z-0"
      animate={{
        x: [0, 150, -150, 0],
        y: [0, 100, -100, 0],
        scale: [1, 1.2, 0.9, 1],
      }}
      transition={{
        duration: 60,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
