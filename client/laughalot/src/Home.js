import logo from './logo.svg';
import './Home.css';
import './index.css';
import {Navigate} from "react-router-dom";
import * as faceapi from "face-api.js";
import { useRef, useEffect } from 'react';

function Home() {

  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    startVideo();

    videoRef && loadModels();

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
      console.log(resized[0].expressions.happy);

      faceapi.draw.drawFaceExpressions(canvasRef.current, resized);

    }, 1000)
  }
  return (
    <html>
      <link rel="stylesheet" href='Home.css'></link>
      <link rel="stylesheet" href='index.css'></link>
      <div className="Home">
        <header>
          {/* <link rel="preconnect" href="https://fonts.googleapis.com"> 
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> 
          <link href="https://fonts.googleapis.com/css2?family=Acme&display=swap" rel="stylesheet"> */}
            <nav class="navbar navbar-expand-lg navbar-dark p-4 bg-danger">
            <a class="navbar-brand pl-3" href="#">Home</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarText">
              <ul class="navbar-nav mr-auto">
                {/* <li class="nav-item active">
                  <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                </li> */}
                <li class="nav-item">
                  <a class="nav-link" href="#">About</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="">Logout</a>
                </li>
              </ul>
            
            </div>
          </nav>
        </header>
        <body class='colorClass'>
                
  
        <div class="container h-100 colorClass">
          <div class="row bigPadding">
            <div class="col-sm">
              <h2>LEADERBOARDS</h2>
              <ol>
                <li>Arihan</li>
                <li>Dilreet</li>
                <li>Huy</li>
                <li>Ismael</li>
              </ol>
            </div>
            <div class="col-sm">
              <h2 class ="pb-5">LAUGHALOT</h2>
              <button type="button" class="btn btn-lg  btn-danger">New Streak</button>
            </div>
            <div class="col-sm">
              <h2>ADD FRIEND</h2>
              <form class="form-inline">
                <input id="paddingBottomInput" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
                <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
              </form>
            </div>
          </div> 
        </div>
        <div  className="app">
      <div className='app__video'>
        <video id="camera" crossOrigin='anonymous' ref={videoRef} autoPlay ></video>
      </div>
        <canvas ref={canvasRef} width="300" height="200" className='app__canvas' />
      
    </div>
        </body>
      </div>
    </html>
  );
}

export default Home;