import React, { useEffect, useRef } from 'react'

export const Audio: React.FC<{ stream: MediaStream }> = ({ stream }) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  useEffect(() => {
    const $audio = audioRef.current
    if ($audio === null) {
      return
    }
    if ($audio.srcObject === stream) {
      return
    }
    $audio.srcObject = stream
    $audio.paused && $audio.play()
  }, [stream])
  return <audio ref={audioRef} />
}
