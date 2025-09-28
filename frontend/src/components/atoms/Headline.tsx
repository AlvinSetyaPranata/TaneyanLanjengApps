import {  motion, useAnimation, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";


type headlineItem = {
  title: string;
  url: string;
};

export interface headlineProps {
  news: headlineItem[];
}

export default function Headline(props: headlineProps) {

  const containerRef = useRef<HTMLDivElement>(null)

  const controls = useAnimation()

  const start = {
    x: `-${50 + (props.news.length * 10)}%`,
    transition: {
      duration: 40,
      repeat: Infinity
    }
  }

  useEffect(() => {
    const execute = async () => await controls.start(start)

    execute()
  }, [])


  return (
    <motion.div onHoverEnd={() => controls.start(start)} onHoverStart={() => controls.stop()} className="flex gap-12 w-full py-2 px-4 text-sm bg-black text-white rounded-md overflow-x-hidden">
      <motion.div ref={containerRef}  initial={{x: "100%"}} animate={controls} className="w-full flex items-center gap-20">
        {props.news.map((item) => (
          <div className="flex items-center">
            <p className="whitespace-nowrap">{item.title.length > 50 ? item.title.slice(0, 20).concat("...") : item.title}</p>
            <p className="whitespace-nowrap pl-2 pr-3">-</p>
            <Link to={item.url} className="whitespace-nowrap hover:underline hover:cursor-pointer">
              Lihat detail
            </Link>
          </div>
        ))}

      </motion.div>
    </motion.div>
  );
}
