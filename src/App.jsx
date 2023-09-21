import { useRef, useEffect } from 'react'
import * as faceapi from 'face-api.js'

function App() {
  const videoRef = useRef()
  const canvasRef = useRef()

  // LOAD FROM USEEFFECT
  useEffect(() => {
    startVideo()
    videoRef && loadModels()

  }, [])



  // OPEN YOU FACE WEBCAM
  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream
      })
      .catch((err) => {
        console.log(err)
      })
  }
  // LOAD MODELS FROM FACE API

  const loadModels = () => {
    Promise.all([
      // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models")

    ]).then(() => {
      faceMyDetect()
    })
  }

  const faceMyDetect = () => {
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(videoRef.current,
        new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

      // DRAW YOU FACE IN WEBCAM
      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current)
      faceapi.matchDimensions(canvasRef.current, {
        width: 900,
        height: 610
      })

      const resized = faceapi.resizeResults(detections, {
        width: 940,
        height: 650
      })

      faceapi.draw.drawDetections(canvasRef.current, resized)
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized)
      faceapi.draw.drawFaceExpressions(canvasRef.current, resized)
      faceapi.draw.drawContour(canvasRef.current, resized)

    }, 1000)
  }

  return (
    <div className='bg-[#93B1A6] min-h-full h-screen flex flex-col items-center pt-16 text-[#040D12]'>
      <h1 className='text-5xl font-bold mb-4'>Face Detection</h1>

      <div>
        <video crossOrigin='anonymous' autoPlay ref={videoRef}></video>
      </div>
      <canvas className='absolute top-2' ref={canvasRef} width="940" height="650" />

    </div>
  )

}

export default App;