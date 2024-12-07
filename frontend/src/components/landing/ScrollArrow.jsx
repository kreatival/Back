import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { animateScroll as scroll } from "react-scroll";
import { FaArrowUp } from "react-icons/fa";

export function ScrollArrow() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showArrow = scrollY > 100;

  return (
    showArrow && (
      <motion.div
        className="fixed flex items-center justify-center w-12 h-12 border-4 border-blue-500 rounded-full cursor-pointer bottom-5 right-5 z-10"
        onClick={() => scroll.scrollToTop({ duration: 500 })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-full h-full rounded-full"
          style={{ border: "4px solid transparent" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, loop: Infinity }}
        ></motion.div>
        <FaArrowUp className="absolute text-lg text-blue-500" />
      </motion.div>
    )
  );
}
