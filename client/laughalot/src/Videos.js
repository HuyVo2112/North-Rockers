import { useRef, useEffect, useState } from 'react';
import './Videos.css';
import * as faceapi from "face-api.js";
import axios from 'axios';
import {useNavigate, Link} from "react-router-dom";

function Videos() {
    const navigate = useNavigate();
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
            setTimeout(() => {
                navigate('/');
            }, 2000)
        }
      }
    }, 1000)
  }

  return (
    <>
    <header>
          {/* <link rel="preconnect" href="https://fonts.googleapis.com"> 
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> 
          <link href="https://fonts.googleapis.com/css2?family=Acme&display=swap" rel="stylesheet"> */}
            <nav class="navbar navbar-expand-lg navbar-dark p-4 bg-primary">
            <Link class="navbar-brand pl-3" to="/"><h3>Laugh-A-Lot</h3></Link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarText">
              <ul class="navbar-nav mr-auto">
                {/* <li class="nav-item active">
                  <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                </li> */}
                <li class="nav-item">
                  <a class="nav-link text-light" href="">Logout</a>
                </li>
              </ul>
            
            </div>
          </nav>
        </header>
    <div  className="app">
        
      <canvas ref={canvasRef} width="940" height="650" className='app__canvas' />
      <div className='app__video'>
        <video id="camera" crossOrigin='anonymous' ref={videoRef} autoPlay ></video>
      </div>
      {laugh ? <h1 id="challenge-result">You Lost. Your score is {videoIndex}</h1> : null}
      {videos.length > 0 ? <iframe id="video-frame" src={videos[videoIndex].video_id} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe> : <h1>Videos not ready. Please wait</h1>}
      <button id="next-button" class ='btn btn-primary'onClick={nextVideo}>Next</button>
      <div id="score-on-the-side">Score: {videoIndex}</div>
      
    </div>
    </>
  );
}

export default Videos;
