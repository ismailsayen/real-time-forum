import { Login } from "./login.js";
import { Register } from "./register.js";

export function DisplayLoginForm() {
  const container = document.querySelector(".container");
  const div = document.createElement("div");
  div.className = "auth-container";
  div.innerHTML = /*html*/ `
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
                 ${LoginForm()}
                 
                  ${RegisterForm()}
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
  Register();
  btnLogin.addEventListener("click", Login);
}
function LoginForm() {
  return /*html*/ `
      <form class="login" method="POST">
                    <div class="field">
                       <input type="text" id="nickname" placeholder="Email Address" required>
                    </div>
                      
  
                    <div class="field">
                       <input type="password" id="loginPassword" placeholder="Password" required>
                       
  
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
   `;
}

function RegisterForm() {
  return /*html*/ `
      <form class="signup-form" method="post" id="signup-form">
                 <div class="field">
                      <input type="text" name="nickname" placeholder="Nickname" required>
                     </div>
                     <div class="error Errnickname"></div>     
                  <div class="field bouth ">
                      <input type="text" name="firstName" placeholder="First Name" required>
                      <input type="text" name="lastName" placeholder="Last Name" required>
                  </div>
                      <div class="error ErrfirstName"></div>
                      <div class="error ErrlastName"></div>
                  
                  <div class="field">
                        <input type="number" name="age" placeholder="Age" min="18" required>
                    <div class="error Errage"></div>
  
                  </div>  
                  <div class="slide-controls">
                  <input type="radio" name="gender" id="Male"class="slide" value="Male" checked/>
                  <input type="radio" name="gender" id="Female" class="slide" value="Female"  style=" color: #999;"/>
                   <label for="Male" class="slide Male">Male</label>
                 <label for="Female" class="slide Female ">Female</label>
                 <div class="slider-tab"></div>
                 
                 </div>
                 <div class="error Errgender"></div>
  
                  <div class="field">
                  <input type="email" name="email" placeholder="Email Address" required>
                    <div class="error Erremail"></div>
  
                </div>
                <div class="field">
                  <input type="password" name="password" placeholder="Password" required>   
               </div>
                  <div class="error field Errpassword">errror rrjja</div>
                <div class="field btn">
                 <div class="btn-layer"></div>
                    <input  value="Register" id="register" type="submit">
                </div>
              </form>
   `;
}
