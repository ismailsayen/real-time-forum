import { Login } from "./login.js";
import { Register } from "./register.js";

export function DisplayLoginForm() {
  const container = document.querySelector(".container");
  const div = document.createElement("div");
  div.innerHTML = `
     <div class="wrapper">
           <div class="title-text">
              <div class="title login">
                 Login Form
              </div>
              <div class="title signup">
                 Signup Form
              </div>
           </div>
           <div class="form-container">
              <div class="slide-controls">
                 <input type="radio" name="slide" id="login" checked>
                 <input type="radio" name="slide" id="signup">
                 <label for="login" class="slide login">Login</label>
                 <label for="signup" class="slide signup">Signup</label>
                 <div class="slider-tab"></div>
              </div>
              <div class="form-inner">
                 <form action="#" class="login">
                    <div class="field">
                       <input type="text" placeholder="Email Address" required>
                    </div>
                      
  
                    <div class="field">
                       <input type="password" placeholder="Password" required>
                       
  
                    </div>
                    <div class="error login-error"></div>
                    <div class="field btn">
                       <div class="btn-layer"></div>
                    <input type="button" value="Login" id="btnlogin">
                    </div>
                    <div class="signup-link">
                       Not a member? <a href="">Signup now</a>
                    </div>
                 </form>
                 <form class="signup-form" method="post">
                 <div class="field">
                      <input type="text" name="nickname" placeholder="Nickname" required>
                    <div class="error nickname-error"></div>
                      
                  </div>
                  <div class="field bouth ">
                      <input type="text" name="firstName" placeholder="First Name" required>
                    
  
                      <input type="text" name="lastName" placeholder="Last Name" required>
                      </div>
                      <div class="error lastname-error"></div>
                      <div class="error firstname-error"></div>
                  
                  <div class="field">
                        <input type="number" name="age" placeholder="Age" min="18" required>
                    <div class="error age-error"></div>
  
                  </div>  
                  <div class="slide-controls">
                  <input type="radio" name="gender" id="Male"class="slide" value="Male" checked></input>
                  <input type="radio" name="gender" id="Female" class="slide" value="Female"  style=" color: #999;"></input>
                   <label for="Male" class="slide Male">Male</label>
                 <label for="Female" class="slide Female ">Female</label>
                 <div class="slider-tab"></div>
                 
                 </div>
                 <div class="error gender-error"></div>
  
                  <div class="field">
                  <input type="email" name="email" placeholder="Email Address" required>
                    <div class="error email-error"></div>
  
                </div>
                <div class="field">
                  <input type="password" name="password" placeholder="Password" required>
                  
                  </div>
                  <div class="error field password-error">errror rrjja</div>
                <div class="field btn">
                 <div class="btn-layer"></div>
                    <input type="button" value="Register" id="register">
                </div>
              </form>
  
              </div>
           </div>
        </div>
    `;
  container.appendChild(div);
  const loginText = document.querySelector(".title-text .login");
  const loginForm = document.querySelector("form.login");
  const SignupForm = document.querySelector(".signup-form");

  const loginBtn = document.querySelector("label.login");
  const signupBtn = document.querySelector("label.signup");
  const signupLink = document.querySelector("form .signup-link a");
  const btnRegister = document.getElementById("register");
  const btnLogin = document.getElementById("btnlogin");
  signupBtn.onclick = () => {
    loginForm.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
    SignupForm.style.display = "block";
  };
  loginBtn.onclick = () => {
    loginForm.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
    SignupForm.style.display = "none";
  };
  signupLink.onclick = () => {
    signupBtn.click();
    return false;
  };
  btnRegister.addEventListener("click", Register);
  btnLogin.addEventListener("click", Login);
}



