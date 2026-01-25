import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [audioData, setAudioData] = useState({ bass: 0, mid: 0, high: 0 })
  const [volume, setVolume] = useState(0.5)
  const [copied, setCopied] = useState(false)

  const contractAddress = ''

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const animationRef = useRef<number>(0)

  const setupAudioAnalyser = () => {
    if (!audioRef.current || audioContextRef.current) return

    const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaElementSource(audioRef.current)
    
    analyser.fftSize = 256
    source.connect(analyser)
    analyser.connect(audioContext.destination)
    
    audioContextRef.current = audioContext
    analyserRef.current = analyser
    sourceRef.current = source

    const analyze = () => {
      if (!analyserRef.current) return
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(dataArray)
      
      // Get bass (low frequencies), mid, and high
      const bass = dataArray.slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255
      const mid = dataArray.slice(10, 50).reduce((a, b) => a + b, 0) / 40 / 255
      const high = dataArray.slice(50, 100).reduce((a, b) => a + b, 0) / 50 / 255
      
      setAudioData({ bass, mid, high })
      animationRef.current = requestAnimationFrame(analyze)
    }
    
    analyze()
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const enterSite = () => {
    // Restart all videos
    const videos = document.querySelectorAll('.video-frame video') as NodeListOf<HTMLVideoElement>
    videos.forEach(video => {
      video.currentTime = 0
      video.play()
    })
    
    // Start audio
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.volume = 0.5
      audioRef.current.play().then(() => {
        setIsPlaying(true)
        setupAudioAnalyser()
      }).catch(() => {})
    }
    setShowIntro(false)
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
        if (!audioContextRef.current) {
          setupAudioAnalyser()
        }
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
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
      {/* Intro Overlay */}
      {showIntro && (
        <div className="intro-overlay">
          <div className="intro-content">
            <h2 className="intro-title">THE DARK TRIAD</h2>
            <p className="intro-subtitle">EMBRACE THE TRANSMISSION</p>
            <button className="intro-button" onClick={enterSite}>
              <span className="intro-button-icon">▶</span>
              <span className="intro-button-text">ENTER</span>
            </button>
          </div>
        </div>
      )}

      {/* Background Effects */}
      <div className="bg-effects">
        <div className="grid-overlay"></div>
        <div className="floating-triangles">
          <div 
            className="triangle t1" 
            style={{ 
              transform: `translateY(${-audioData.bass * 50}px) scale(${1 + audioData.bass * 0.3})`,
              opacity: 0.2 + audioData.bass * 0.4
            }}
          >◬</div>
          <div 
            className="triangle t2"
            style={{ 
              transform: `translateY(${-audioData.mid * 40}px) scale(${1 + audioData.mid * 0.25})`,
              opacity: 0.2 + audioData.mid * 0.35
            }}
          >◬</div>
          <div 
            className="triangle t3"
            style={{ 
              transform: `translateY(${-audioData.high * 30}px) scale(${1 + audioData.high * 0.2})`,
              opacity: 0.2 + audioData.high * 0.3
            }}
          >◬</div>
          <div 
            className="triangle t4"
            style={{ 
              transform: `translateY(${-audioData.bass * 35}px) rotate(${audioData.mid * 15}deg)`,
              opacity: 0.2 + audioData.bass * 0.3
            }}
          >◬</div>
          <div 
            className="triangle t5"
            style={{ 
              transform: `translateY(${-audioData.mid * 45}px) rotate(${-audioData.high * 10}deg)`,
              opacity: 0.2 + audioData.mid * 0.35
            }}
          >◬</div>
        </div>
        <div className="dark-mist mist-1"></div>
        <div className="dark-mist mist-2"></div>
        <div 
          className="radial-pulse music-reactive"
          style={{ 
            transform: `translate(-50%, -50%) scale(${1 + audioData.bass * 0.5})`,
            opacity: 0.4 + audioData.bass * 0.6
          }}
        ></div>
        {/* Beat flash effect */}
        <div 
          className="beat-flash"
          style={{ 
            opacity: audioData.bass > 0.6 ? audioData.bass * 0.3 : 0
          }}
        ></div>
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
                  preload="auto"
                  disablePictureInPicture
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
        <span className="footer-title">◬ DARK TRIAD ◬</span>
        <div className="footer-links">
          <div className="footer-item ca-item" onClick={copyToClipboard}>
            <span className="footer-label">CA {copied && <span className="copied-text">COPIED!</span>}</span>
            <span className="footer-value ca-address">{contractAddress}</span>
          </div>
          <a href="https://x.com/DarkTriad75999" target="_blank" rel="noopener noreferrer" className="footer-item twitter-link">
            <span className="footer-label">TWITTER</span>
          </a>
        </div>
      </footer>

      {/* Audio Player */}
      <audio ref={audioRef} src="/music.mp3" loop />
      <div className="audio-controls">
        <button className="audio-toggle" onClick={togglePlay}>
          <span className="audio-icon">{isPlaying ? '◼' : '▶'}</span>
          <span className="audio-label">{isPlaying ? 'SILENCE' : 'TRANSMIT'}</span>
        </button>
        <div className="volume-control">
          <span className="volume-icon">🔊</span>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
          <span className="volume-value">{Math.round(volume * 100)}%</span>
        </div>
      </div>
    </div>
  )
}

export default App
