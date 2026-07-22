import { useEffect, useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import VideoCarousel from './components/VideoCarousel'
// import CardArc5 from './components/CardArc5'


function App()
 { 
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
    requestAnimationFrame(() => window.scrollTo(0, 0))
  }, [])

  useEffect(() => {
   const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
   const revealed = new Set()
   const animationFrames = []
   const observer = new IntersectionObserver(
     (entries) => {
       entries.forEach((entry) => {
         if (entry.isIntersecting && !revealed.has(entry.target)) {
           entry.target.classList.add('is-visible')
           revealed.add(entry.target)
         }
       })
     },
     { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
   )

   const revealNodes = document.querySelectorAll('[data-reveal]')
   revealNodes.forEach((node) => observer.observe(node))

   const countNodes = document.querySelectorAll('[data-count-target]')
   const setCountValue = (node, value) => {
     const suffix = node.dataset.countSuffix ?? ''
     const prefix = node.dataset.countPrefix ?? ''
     const pad = Number(node.dataset.countPad ?? 0)
     node.textContent = `${prefix}${String(value).padStart(pad, '0')}${suffix}`
   }

   const animateCount = (node) => {
     const target = Number(node.dataset.countTarget ?? 0)
     const duration = Number(node.dataset.countDuration ?? 1600)
     if (!Number.isFinite(target) || target <= 0) {
       setCountValue(node, 0)
       return
     }
     const start = performance.now()
     const tick = (now) => {
       const elapsed = now - start
       const progress = Math.min(elapsed / duration, 1)
       const eased = 1 - (1 - progress) ** 3
       const next = Math.round(target * eased)
       setCountValue(node, next)
       if (progress < 1) {
         animationFrames.push(requestAnimationFrame(tick))
       } else {
         setCountValue(node, target)
       }
     }
     animationFrames.push(requestAnimationFrame(tick))
   }

   const runCounters = () => {
     countNodes.forEach((node) => {
       const target = Number(node.dataset.countTarget ?? 0)
       if (prefersReducedMotion) {
         setCountValue(node, target)
         return
       }
       setCountValue(node, 0)
       animateCount(node)
     })
   }

   let didCount = false
   const statsNode = document.querySelector('.stats')
   const countObserver = new IntersectionObserver(
     (entries) => {
       entries.forEach((entry) => {
         if (!didCount && entry.isIntersecting) {
           didCount = true
           runCounters()
           countObserver.disconnect()
         }
       })
     },
     { threshold: 0.35 },
   )
   if (statsNode) countObserver.observe(statsNode)

   const setScrollProgress = () => {
     const max = Math.max(document.body.scrollHeight - window.innerHeight, 1)
     const progress = Math.min(Math.max(window.scrollY / max, 0), 1)
     document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4))
   }
   setScrollProgress()
   window.addEventListener('scroll', setScrollProgress, { passive: true })

   return () => {
     observer.disconnect()
     countObserver.disconnect()
     animationFrames.forEach((id) => cancelAnimationFrame(id))
     window.removeEventListener('scroll', setScrollProgress)
   }
  }, [])

  return (
   <>
   <div className="noise" /><header className="wrap"><nav><a className="brand" href="#top">Made<span>/</span>by.V</a><div className="nav-links"><a href="#about">About</a><a href="#work">Selected work</a><a className="pill" href="#contact">Let's talk ↗</a></div></nav></header><main id="top">
  <section className="hero wrap reveal" data-reveal><div className="hero-top"><div className="eyebrow"><i /> Available for select projects / 2026</div><h1>I cut stories<br />that <em>stay.</em></h1><p className="hero-copy">Independent video editor shaping rhythm, feeling, and memorable frames for artists, brands, and culture-makers.</p></div><div className="hero-orb" /><div className="hero-foot"><a className="round-link" href="#work">Watch selected<br />work&nbsp; ↓</a><span className="scroll">SCROLL TO EXPLORE ↓</span></div></section>
  <div className="marquee"><div className="marquee-inner">{Array(2).fill(['Music videos','✦','Brand films','✦','Short-form','✦','Creative direction','✦']).flat().map((item,index) => <span className={item === '✦' ? 'star' : ''} key={index}>{item}</span>)}</div></div>
  <section id="about" className="wrap reveal" data-reveal><div className="section-head"><span className="label">01 — About me</span><div><h2>Editing is<br />emotional architecture.</h2><p className="about-copy">I’m Kio, a Lagos-based editor with a soft spot for <em>sharp transitions, imperfect texture,</em> and the split-second where a cut changes how a story feels.</p></div></div><div className="stats"><div className="stat"><strong className="count-value" data-count-target="5" data-count-suffix="+" data-count-pad="2">05+</strong><span>Years cutting</span></div><div className="stat"><strong className="count-value" data-count-target="120">120</strong><span>Films delivered</span></div><div className="stat"><strong className="count-value" data-count-target="19" data-count-suffix="M">19M</strong><span>Organic views</span></div></div></section>
  <section className="services reveal" data-reveal><div className="wrap"><div className="section-head"><span className="label">02 — What I do</span><h2>Built for the<br />re-watch.</h2></div><div className="service-list">{[['01','Talking Head edits','Performance, narrative and visualiser cuts that move with the music.'],['02','Brand films','Campaign films with a clear point of view and a little edge.'],['03','Social cutdowns','Platform-native edits made to earn the next second of attention.']].map(([n,title,copy]) => <div className="service" key={n}><span className="label">{n}</span><b>{title}</b><p>{copy}</p><span className="arrow">↗</span></div>)}</div></div></section>
  <section id="work" className="work wrap reveal" data-reveal><div className="work-intro"><div><span className="label">03 — Selected work</span><h2>Pick a frame.</h2></div><span className="label desktop-only">Rotate to explore</span></div><VideoCarousel /></section>
  <section id="contact" className="contact reveal" data-reveal><div className="wrap"><span className="label">04 — Have a story?</span><h2>Let's make<br />it <em>move.</em></h2><div className="contact-row"><a href="mailto:vitaliskalu7@gmail.com">hello@madebyv ↗</a><div className="socials"><a href="My page : https://www.instagram.com/vitalis_kalu?igsh=MXhkcjk4eThka3kyOQ%3D%3D&utm_source=qr">Instagram</a><a href="https://www.linkedin.com/in/vitalis-kalu/">LinkedIn</a></div></div></div></section>
  </main>
  </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
