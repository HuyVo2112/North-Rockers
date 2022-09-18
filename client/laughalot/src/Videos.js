import { useRef, useEffect, useState } from 'react';
import './Videos.css';
import * as faceapi from "face-api.js";
import axios from 'axios';

function Videos() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [videos, setVideos] = useState([]);
  const [videoIndex, setIndex] = useState(0);
  const [laugh, setLaugh] = useState(false);

  const nextVideo = () =>{
    setIndex(prevIndex => prevIndex + 1);
  }

  useEffect(() => {
    startVideo();
    videoRef && loadModels();

    const getVideos = async () => {
        return await axios.get('http://localhost:3000/streaks');
    }

    getVideos().then(videos => {
        console.log(videos.data[0].video_id);
        setVideos(videos.data);
    });
    
  }, []);
  
    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      ]).then(() => {
        faceDetection();
      })
    };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.error(err)
      });
  }

  const faceDetection = async () => {
    setInterval(async() => {
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
      
      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current);
      faceapi.matchDimensions(canvasRef.current, {
        width: 940,
        height: 650,
      })

      const resized = faceapi.resizeResults(detections, {
        width: 940,
        height: 650,
      });
      if (resized[0]) {
        console.log(resized[0].expressions.happy)
        if(resized[0].expressions.happy > 0.6) {
            setLaugh(true);
        }
      }
      

    }, 1000)
  }

  return (
    <div  className="app">
        
      <canvas ref={canvasRef} width="940" height="650" className='app__canvas' />
      <div className='app__video'>
        <video id="camera" crossOrigin='anonymous' ref={videoRef} autoPlay ></video>
      </div>
      {videos.length > 0 ? <iframe width="560" height="315" src={videos[videoIndex].video_id} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe> : <h1>Videos not ready. Please wait</h1>}
      <button onClick={nextVideo}>Next</button>
      {laugh ? <h1>You Laughed :D</h1> : null}
    </div>
  );
}

export default Videos;
