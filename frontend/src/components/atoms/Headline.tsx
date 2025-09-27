import {  motion } from "motion/react";
import { Link } from "react-router-dom";


type headlineItem = {
  title: string;
  url: string;
};

export interface headlineProps {
  news: headlineItem[];
}

export default function Headline(props: headlineProps) {

  const variants = {
    initial: {
      x: "100%"
    },
    animate: {
      x: `-${50 + (props.news.length * 10)}%`,
      transition: {
        duration: 10 * props.news.length,
        ease: [0.25, 0.25, 0.75, 0.75], // cubic-bezier for linear
        repeat: Infinity
      }
    }
  } as const;


  return (
    <div className="flex gap-12 w-full py-2 px-4 text-sm bg-black text-white rounded-md overflow-x-hidden">
      <motion.div variants={variants} initial="initial" animate="animate" className="w-full flex items-center gap-20">
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
    </div>
  );
}
