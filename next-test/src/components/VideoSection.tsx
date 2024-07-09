'use client'
import React from 'react'
import SectionLayout from './SectionLayout'
import {motion, useScroll, useTransform} from 'framer-motion'
import styles from './VideoSection.module.css'
function VideoSection() {
    const video = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: video,
      offset: ["start end", "end start"],
    });
  
    const opacity = useTransform(scrollYProgress, [0, 0.65, 1], [1, 1, 0]);
    const scale = useTransform(
      scrollYProgress,
      [0, 0.6, 0.8, 0.9],
      [1, 0.8, 0.8, 0]
    );
  return (
    <SectionLayout>
    <motion.div
      className={styles.video}
      ref={video}
      style={{
        opacity,
        scale,
      }}
    >
      <iframe
        src="https://www.youtube.com/embed/OuaUjkZhfqQ"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </motion.div>
  </SectionLayout>
  )
}

export default VideoSection