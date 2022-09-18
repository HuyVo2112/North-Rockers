import logo from './logo.svg';
import './Home.css';
import './index.css';
import {Navigate} from "react-router-dom";

function Home() {

  let isLoggedIn = true;

  if (!isLoggedIn) {
    return <Navigate to='/login'></Navigate>
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
            <nav class="navbar navbar-expand-lg navbar-dark p-4 bg-primary">
            <a class="navbar-brand pl-3" href="#"><h3>Laugh-A-Lot</h3></a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarText">
              <ul class="navbar-nav mr-auto">
                {/* <li class="nav-item active">
                  <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                </li> */}
                <li class="nav-item">
                  <a class="nav-link text-light" href="#">About</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link text-light" href="">Logout</a>
                </li>
              </ul>
            
            </div>
          </nav>
        </header>
        <body class='bg-dark text-white'>
                <div class = "container">
                    
               
                <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
                <div class="col-10 col-sm-8 col-lg-6">
                  <img src="http://localhost:3000/donald.png" class="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes" width="700" height="500" loading="lazy"/>
                </div>
                <div class="col-lg-6">
                  <h1 class="display-5 fw-bold lh-1 mb-3">We want to get better at making you laugh</h1>
                  <p class="lead">When is a person visibly at their happiest? The answer is simple, it is when they laugh. Our service aims to wipe away the emotionless faces of humanity today. We want to make a world where everyone can be happy through the use of AI and technology. Start laughing now to train our AI and aid us in building a happier world.</p>
                  <div class="d-grid gap-2 pl-1 d-md-flex justify-content-md-center">
                    <button type="button" class="btn btn-primary btn-lg px-4 me-md-2">New Streak</button>
                   
                  </div>
                </div>
              </div>
              </div>
          <hr></hr>
        <div class="container  bg-dark text-white pt-5">
          <div class="col-md-6 offset-md-3 pd-5">
          <h2>LEADERBOARDS</h2>
              <table class="table table-dark">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
            
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>Mark Otto</td>
                  
                </tr>
                <tr>
                <th scope="row">2</th>
                  <td>Larry Bird</td>
               
                </tr>
                <tr>
                  <th scope="row">3</th>
                  <td>Larry</td>
                </tr>
              </tbody>
            </table>
               
  
            <div class="col-md-6 offset-md-3 py-5">
            <h2 class='pd-3'>ADD FRIEND</h2>
              
              <div class="input-group">
                <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
                <button type="button" class="btn btn-outline-success">Search</button>
              </div>
              </div>
            </div>
            
          </div>
        
        </body>
      </div>
    </html>
  );
}

export default Home;