import logo from './logo.svg';
import './Signup.css';
import './index.css';

function Signup() {
  return (
    <html>
      <link rel="stylesheet" href='Signup.css'></link>
      <link rel="stylesheet" href='index.css'></link>
      <div className="Signup">
        <body class='colorClass pb-5'>
        <div class="comtainer py-5"></div>
        <div class="container h-100 align-middle opactiy-75 pb-5">
            <div class ='col-md-4 offset-md-4 p-4 opactiy-75 rounded bg-light text-dark'>
                <h1>Laughalot Signup</h1>
                <form class="pd-3">
                    <div class="form-group py-2">
                        <label for="exampleInputEmail1">Username</label>
                        <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="usernameHelp" placeholder="Enter username"/>
                      
                    </div>
                    <div class="form-group py-2">
                        <label for="exampleInputPassword1">Password</label>
                        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"/>
                    </div>
   
                    <button type="submit" class="btn my-2 btn-lg btn-block btn-primary">Submit</button>
                    </form>
                 
            </div>
        </div>
        </body>
      </div>
    </html>
  );
}

export default Signup;
