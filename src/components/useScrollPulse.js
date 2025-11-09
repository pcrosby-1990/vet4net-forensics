// src/hooks/useScrollPulse.js
import { useEffect } from 'react';

export default function useScrollPulse(selector = '.sigil-hover') {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('pulse-visible');
          }
        });
      },
      { threshold: 0.6 }
    );

    const targets = document.querySelectorAll(selector);
    targets.forEach(el => observer.observe(el));

    return () => targets.forEach(el => observer.unobserve(el));
  }, [selector]);
}
