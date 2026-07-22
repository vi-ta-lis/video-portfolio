import React, { useRef, useState } from 'react'

const projects = [
  {  instagramUrl: 'https://www.instagram.com/reel/C_mLbnTAhbL/' },
  { instagramUrl: 'https://www.instagram.com/reel/C_CbL-QRaQ-/?igsh=MTh2eXJ0bnJhZTBmYg==' },
  {  instagramUrl: 'https://www.instagram.com/reel/C-vyy9-SDDx/?igsh=MWhvaXUyczNjbHJtOA==' },
  {  instagramUrl: 'https://www.instagram.com/reel/C_g384Rv1mx/?igsh=MWw3bm92NzN0NXI2' },
  // { title: 'Days Like These / Tayo', type: 'Documentary', instagramUrl: 'https://www.instagram.com/reel/C9Q6D7Aq4y3/' },
]

function toInstagramEmbed(url) {
  try {
    const parsed = new URL(url)
    const segments = parsed.pathname.split('/').filter(Boolean)
    const kindIndex = segments.findIndex((segment) => ['reel', 'p', 'tv'].includes(segment))
    if (kindIndex === -1 || !segments[kindIndex + 1]) return ''
    const kind = segments[kindIndex]
    const id = segments[kindIndex + 1]
    return `https://www.instagram.com/${kind}/${id}/embed`
  } catch {
    return ''
  }
}

export default function VideoCarousel() {
  const [rotation, setRotation] = useState(0)
  const [active, setActive] = useState(null)
  const touchStartRef = useRef({ x: 0, y: 0 })
  const suppressTapRef = useRef(false)
  const spin = (amount) => setRotation((value) => value + amount)
  const handleTilt = (event) => {
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    const tiltX = (0.5 - y) * 12
    const tiltY = (x - 0.5) * 16
    card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`)
    card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`)
  }
  const resetTilt = (event) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg')
    event.currentTarget.style.setProperty('--tilt-y', '0deg')
  }
  const handleTouchStart = (event) => {
    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }
  const handleTouchEnd = (event) => {
    const touch = event.changedTouches[0]
    const dx = touch.clientX - touchStartRef.current.x
    const dy = touch.clientY - touchStartRef.current.y
    const isHorizontalSwipe = Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 28
    if (isHorizontalSwipe) {
      suppressTapRef.current = true
      spin(dx < 0 ? -72 : 72)
      window.setTimeout(() => {
        suppressTapRef.current = false
      }, 160)
    }
  }
  const openProject = (project) => {
    if (suppressTapRef.current) return
    setActive(project)
  }
  return (
    <>
      <div className="carousel-stage" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}><div className="carousel" style={{ transform: `rotateY(${rotation}deg)` }}>
        {projects.map((project, index) => <button className="project" style={{ '--i': index }} key={project.title} onClick={() => openProject(project)} onMouseMove={handleTilt} onMouseLeave={resetTilt}>
          <div className="project-surface">
            {toInstagramEmbed(project.instagramUrl) ? (
              <iframe
                className="project-embed"
                src={toInstagramEmbed(project.instagramUrl)}
                title={project.title}
                loading="lazy"
                allow="encrypted-media"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <div className="project-fallback">Invalid Instagram link</div>
            )}
            <span className="play-mini">▶</span><span className="project-info"><span>{project.type}</span><b>{project.title}</b></span>
          </div>
        </button>)}
      </div></div>
      <div className="carousel-controls"><button onClick={() => spin(72)} aria-label="Previous project">←</button><button onClick={() => spin(-72)} aria-label="Next project">→</button></div>
      <p className="hint">Swipe left/right or use arrows</p>
      {active && <div className="modal" role="dialog" aria-modal="true" aria-label={active.title} onClick={() => setActive(null)}><div className="modal-box modal-box--portrait" onClick={(event) => event.stopPropagation()}><button className="close" onClick={() => setActive(null)} aria-label="Close player">×</button>{toInstagramEmbed(active.instagramUrl) ? <iframe className="modal-embed" src={toInstagramEmbed(active.instagramUrl)} title={active.title} allow="autoplay; encrypted-media; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <div className="project-fallback project-fallback--modal">Invalid Instagram link</div>}</div></div>}
    </>
  )
}