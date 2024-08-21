import moment from "moment";
import React, { Component } from "react";
import Swal from "sweetalert2";

import { apiUrl, key,server,YES } from "../constant";
import { httpClient } from "../utils/HttpClient";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      employee_id: "",
     
    };
  
  }

  autoLogin = async (history) => {
    return () => {
      // alert('autoLogin say : '+localStorage.getItem(key.LOGIN_PASSED))
      console.log(localStorage.getItem(key.USER_LV))


      if (localStorage.getItem(key.LOGIN_PASSED) === YES) {
        setTimeout(() => history.push("/home"), 100);
      }
    };
  };


  componentDidMount = async () => {
    //this.props.autoLogin(this.props.history);
    this.autoLogin();
  };

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // this.props.login(this.props.history, this.state);
      this.doLogin();
    }
  };

  doLogin = async () => {

    try{
      let login_result = await httpClient.post(apiUrl + "api/login", this.state);
      //console.log(login_result.data.result.level_sys);

      if(login_result.data === "invalid_permission"){
        Swal.fire({
          icon: "error",
          title: `ตำแหน่งของคุณไม่มีรับการอนุญาติให้ใช้งานในส่วนนี้`,
          text: "กรุณาลองใหม่อีกครั้ง",
        });
        return
      }else if(login_result.data === "incorrect_username_password" || login_result.data === "failed"){
        Swal.fire({
          icon: "error",
          title: `รหัสผ่านไม่ถูกต้อง`,
          text: "กรุณาลองใหม่อีกครั้ง",
        });
        return
      }
      
      if(localStorage.getItem(key.USER_LV) === "STAFF" && login_result.data.result.level_sys === "STAFF"){
        Swal.fire({
          icon: "error",
          title: `ตำแหน่งของคุณไม่มีรับการอนุญาติให้ใช้งานในส่วนนี้`,
          text: "กรุณาลองใหม่อีกครั้ง",
        });
        return
      }

      switch(login_result.data.result.level_sys){
        case "STAFF":
   
            localStorage.setItem(key.LOGIN_PASSED, YES);
            localStorage.setItem(key.USER_EMP, login_result.data.result.employee_id);
            localStorage.setItem(key.TIME_LOGIN, moment());
            //console.log(login_result.data)
            localStorage.setItem(key.USER_LV, login_result.data.result.level_sys);
            //window.location.href = "/";
            window.location.reload(true)
          

   
     
          break;
        case "ADMIN":
        localStorage.setItem(key.LOGIN_PASSED, YES);
        localStorage.setItem(key.USER_EMP, login_result.data.result.employee_id);
        localStorage.setItem(key.TIME_LOGIN, moment());
        //console.log(login_result.data)
        localStorage.setItem(key.USER_LV, login_result.data.result.level_sys);
        //window.location.href = "/";
        window.location.reload(true)
          break;
        case "OPERATOR":
          Swal.fire({
            icon: "error",
            title: `กรุณากรอกข้อมูลให้ถูกต้อง`,
            text: "กรุณาลองใหม่อีกครั้ง",
          });
          break;
        default:
          console.log("test")
          Swal.fire({
            icon: "error",
            title: `กรุณากรอกข้อมูลให้ถูกต้อง`,
            text: "กรุณาลองใหม่อีกครั้ง",
          });
          break;
      }
    }catch(error){
      console.log(error)
    }

   

    // if (login_result.data.message !== "OK") {
    //   console.log(login_result.data);
    //   Swal.fire({
    //     icon: "error",
    //     title: "Log in Fail",
    //     text: login_result.data.error,
    //   }).catch(error => {
    //     console.log(error)
    //   });

    //   return;
    // } else if (login_result.data.result.levelUser === "Guest") {
    //   // console.log(Login_result.data.result.levelUser);
    //   // return

    //   Swal.fire({
    //     icon: "warning",
    //     title: "Unauthorized User",
    //     text: "Please contact the administrator for permission.",
    //   });

    //   return;
    // } else {
    //   Swal.fire({
    //     icon: "success",
    //     title: "Welcome to the web-site of",
    //     //text: { APP_TITLE }.APP_TITLE,
    //     showConfirmButton: false,
    //     // timer: 100000,
    //   });

    //   localStorage.setItem(key.LOGIN_PASSED, YES);
    //   localStorage.setItem(key.USER_EMP, login_result.data.result.employee_id);
    //   localStorage.setItem(key.TIME_LOGIN, moment());
    // //   console.log(login_result.data)
    //   localStorage.setItem(key.USER_LV, login_result.data.result.level_sys);
    //   window.location.replace("/home");
    // }
  };

  render() {


    return (
      <div className="login-page">
        <div className="login-box">
          <div className="login-logo"></div>
          {/* /.login-logo */}
          <div className="card">
            <div className="card-body login-card-body">
              <h1 className="login-box-msg">Login</h1>
              <p className="login-box-msg">Please Log-in</p>

              <div className="input-group mb-3">
                <input
                  value={this.state.employee_id}
                  type="text"
                  className="form-control"
                  placeholder="Employee ID"
                  onChange={(e) => {
                    this.setState({
                      employee_id: e.target.value.toUpperCase(),
                    });
                  }}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-user" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  value={this.state.password}
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={(e) => {
                    this.setState({ password: e.target.value });
                  }}
                  onKeyPress={this.handleKeyPress}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-8"></div>
                {/* /.col */}
                <div className="col-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={(e) => {
                      e.preventDefault();
                      this.doLogin();
                      // this.props.login(this.props.history, this.state);
                    }}
                  >
                    Log In
                  </button>
                </div>
                {/* /.col */}
              </div>

              <p className="mb-0">
                <a href="/register" className="text-center">
                  Register a new user
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
