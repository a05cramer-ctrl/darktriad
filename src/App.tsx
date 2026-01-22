import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (error) {
          // Autoplay was blocked, wait for user interaction
          const enableAudio = () => {
            if (audioRef.current) {
              audioRef.current.play().then(() => {
                setIsPlaying(true)
              }).catch(() => {})
            }
            document.removeEventListener('click', enableAudio)
            document.removeEventListener('touchstart', enableAudio)
            document.removeEventListener('keydown', enableAudio)
          }
          document.addEventListener('click', enableAudio, { once: true })
          document.addEventListener('touchstart', enableAudio, { once: true })
          document.addEventListener('keydown', enableAudio, { once: true })
        }
      }
    }
    
    playAudio()
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const videoSlots = [
    { id: 1, label: 'PROPAGANDA I', src: '/video1.mp4' },
    { id: 2, label: 'PROPAGANDA II', src: '/video2.mp4' },
    { id: 3, label: 'PROPAGANDA III', src: '/video3.mp4' },
  ]

  const galleryImages = [
    { id: 1, image: '/gallery1.jpg' },
    { id: 2, image: '/gallery2.jpg' },
    { id: 3, image: '/gallery3.jpg' },
    { id: 4, image: '/gallery4.webp' },
    { id: 5, image: '/gallery5.png', mogged: { top: '-10%', width: '95%' } },
    { id: 6, image: '/gallery6.png', mogged: { top: '12%', width: '45%' } },
    { id: 7, image: '/gallery7.webp', mogged: { top: '35%', width: '85%' } },
    { id: 8, image: '/gallery8.webp', mogged: { top: '25%', width: '60%' } },
  ]

  return (
    <div className="app">
      {/* Background Effects */}
      <div className="bg-effects">
        <div className="grid-overlay"></div>
        <div className="floating-triangles">
          <div className="triangle t1">◬</div>
          <div className="triangle t2">◬</div>
          <div className="triangle t3">◬</div>
          <div className="triangle t4">◬</div>
          <div className="triangle t5">◬</div>
        </div>
        <div className="dark-mist mist-1"></div>
        <div className="dark-mist mist-2"></div>
        <div className="radial-pulse"></div>
      </div>
      <div className="noise-overlay"></div>
      <div className="vignette"></div>
      
      {/* Banner Section */}
      <section className="banner">
        <div className="banner-image">
          <img src="/banner.png" alt="The Dark Triad" />
          <div className="banner-overlay"></div>
        </div>
      </section>

      {/* Title Section */}
      <section className="title-section">
        <span className="subtitle">EMBRACE THE SHADOWS</span>
        <h1 className="title">THE DARK TRIAD</h1>
        <span className="tagline">NARCISSISM · MACHIAVELLIANISM · PSYCHOPATHY</span>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <h2 className="section-title">TRANSMISSIONS</h2>
        <div className="video-grid">
          {videoSlots.map((slot) => (
            <div key={slot.id} className="video-slot">
              <div className="video-frame">
                <video 
                  src={slot.src} 
                  muted 
                  loop 
                  autoPlay
                  playsInline
                />
                <div className="scanlines"></div>
                <div className="video-overlay">
                  <span className="video-label">{slot.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <h2 className="section-title">ICONOGRAPHY</h2>
        <div className="gallery-grid">
          {galleryImages.map((img) => (
            <div key={img.id} className="gallery-item">
              <div className="gallery-frame">
                {'image' in img && (
                  <>
                    <img src={img.image} alt="" className="gallery-image" />
                    {'mogged' in img && img.mogged && (
                      <img 
                        src="/mogged.png" 
                        alt="" 
                        className="mogged-overlay"
                        style={{ 
                          top: img.mogged.top, 
                          width: img.mogged.width 
                        }}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span>◬ DARK TRIAD ◬</span>
      </footer>

      {/* Audio Player */}
      <audio ref={audioRef} src="/music.mp3" loop autoPlay />
      <button className="audio-toggle" onClick={togglePlay}>
        <span className="audio-icon">{isPlaying ? '◼' : '▶'}</span>
        <span className="audio-label">{isPlaying ? 'SILENCE' : 'TRANSMIT'}</span>
      </button>
    </div>
  )
}

export default App
