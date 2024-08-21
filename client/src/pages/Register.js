import React, { Component } from "react";
import { httpClient } from "../utils/HttpClient";
import Swal from "sweetalert2";
import { apiUrl, server } from "../constant";

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employee_id: "",
      name_eng: "",
      position: "",
      section: "",
      department: "",
      level_sys: "",
      password: "",
     
    };
  }
  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      //this.props.register(this.props.history, this.state);
      this.doRegister();
    }
  };
  clearData() {
    this.setState({
      employee_id: "",
      password: "",
    confirmpassword:"",
      name_eng: "",
      position: "",
      section: "",
      department: "",
      level_sys: "",
    });
  }

  componentDidMount(){
    this.setState({
      employee_id: "",
      password: "",
    confirmpassword:"",
      name_eng: "",
      position: "",
      section: "",
      department: "",
      level_sys: "OPERATOR",
    });
  }
  doRegister = async () => {
    //console.log(this.state.confirmpassword)
    if (this.state.password !== this.state.confirmpassword) {
      Swal.fire({
        icon: "warning",
        title: "รหัสผ่านกับยืนยันรหัสผ่านไม่ตรงกัน",
        text: "กรุณายืนยันรหัสผ่านอีกครั้ง",
      });

      return;
    }
    let register = await httpClient.post(apiUrl + "api/register", this.state)
    console.log(register)
    if(register.data === "error"){
      Swal.fire({
        icon: "error",
        title: `พบข้อมูลซ้ำในฐานข้อมูล`,
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    }else if(register.data === "ok"){
         Swal.fire(
              "ลงทะเบียนเสร็จสิ้น",
               "ข้อมูลได้ถูกบันทึกลงไปยังฐานข้อมูล",
               "success"
             ).then(function(){
               window.location.href = "/login";
             });
    }
    //console.log(register)
    // let Register_command = await httpClient.post(server.URL_REGIST, this.state);
    // console.log(Register_command.data.api_result);
    // if (Register_command.data.api_result === "OK") {
    //   Swal.fire({
    //     icon: "success",
    //     title: "Welcome",
    //     text: "to the web-site !!!",
    //     showConfirmButton: false,
    //     timer: 1000,
    //   });
    //   window.location.replace("../Home");
    // } else {
    //   console.log(Register_command.data);
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Username is used.",
    //     text: "Plesase confirm your user condition",
    //     // footer:
    //     //   "<a href=/registrule/html-link.htm target=_blank > Why do I have this issue?</a>",
    //   });
    //   return;
    // }
  };

  render() {
    return (
      
        <div className="register-page" style={{ maxHeight: 700 }}>
          <div className="register-box">
            <div className="register-logo"></div>
            {/* /.register-logo */}
            <div className="card">
              <div className="card-body register-card-body">
                <p className="register-box-msg">New User Registration</p>

                {/* xx */}
                <div className="input-group mb-3">
                  <input
                    value={this.state.employee_id || ''}
                    type="text"
                    className="form-control"
                    placeholder="Employee ID"
                    autoFocus
                    onChange={(e) => {
                      this.setState({
                        employee_id: e.target.value.toUpperCase(),
                      });
                    }}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-id-card" />
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input
                    value={this.state.name_eng || ''}
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    autoFocus
                    onChange={(e) => {
                      this.setState({
                        name_eng: e.target.value.toUpperCase(),
                      });
                    }}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-id-card" />
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input
                    value={this.state.password || ''}
                    type="text"
                    className="form-control"
                    placeholder="Password"
                    autoFocus
                    onChange={(e) => {
                      this.setState({
                        password: e.target.value,
                      });
                    }}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-id-card" />
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input
                    value={this.state.confirmpassword || ''}
                    type="text"
                    className="form-control"
                    placeholder="Confirm-Password"
                    autoFocus
                    onChange={(e) => {
                      this.setState({
                        confirmpassword: e.target.value,
                      });
                    }}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-id-card" />
                    </div>
                  </div>
                </div>

                <div className="input-group mb-3">
                  <input
                    value={this.state.position || ''}
                    type="text"
                    className="form-control"
                    placeholder="Position"
                    autoFocus
                    onChange={(e) => {
                      this.setState({
                        position: e.target.value.toUpperCase(),
                      });
                    }}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-id-card" />
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input
                    value={this.state.section || ''}
                    type="text"
                    className="form-control"
                    placeholder="Section"
                    autoFocus
                    onChange={(e) => {
                      this.setState({
                        section: e.target.value.toUpperCase(),
                      });
                    }}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-id-card" />
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input
                    value={this.state.department || ''}
                    type="text"
                    className="form-control"
                    placeholder="Department"
                    autoFocus
                    onChange={(e) => {
                      this.setState({
                        department: e.target.value.toUpperCase(),
                      });
                    }}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-id-card" />
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <select
                    value={this.state.level_sys || ''}
                    type="text"
                    className="form-control"
                    placeholder="Level"
                    autoFocus
                    onChange={(e) => {
                      this.setState({
                        level_sys: e.target.value.toUpperCase(),
                      });
                    }}
                  >
                    <option value="OPERATOR">OPERATOR</option>
                    <option value="STAFF">STAFF</option>
                    {/* <option value="ADMIN">ADMIN</option> */}
                  </select>
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-id-card" />
                    </div>
                  </div>
                </div>
             
                <div className="row">
                  <div className="col-6">
                    <div className="row">
                      <a href="/login">I have an account.</a>
                    </div>
                    {/* </li> */}
                  </div>
                  {/* /.col */}

                  <div className="col-6">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      onClick={(e) => {
                        e.preventDefault();
                        this.doRegister();
                        //this.props.register(this.props.history, this.state);
                      }}
                    >
                      Sign Up
                    </button>
                    <button
                      type="submit"
                      className="btn btn-danger btn-block"
                      onClick={(e) => {
                        e.preventDefault();
                        this.clearData();
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      
    );
  }
}

export default Register;
