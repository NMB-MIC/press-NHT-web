import React, { Component } from "react";
import DataTable from "react-data-table-component";
import { httpClient } from "../utils/HttpClient";
import { apiUrl, mqttURL, mqttWebSocketPort } from "../constant";
import mqtt from "precompiled-mqtt";
import moment from "moment";
import Swal from "sweetalert2";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      machine: [],
      serial_no_check: [],
    };
  }
  componentDidMount() {
    // httpClient.get(apiUrl + "getCurrentModel").then((res) => {
    //   const datas = res.data;
    //   this.setState({ machine: datas });
    // });
    // this.subscribeMessage();
  }

  handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      //await setTimeout(1000)
      //let scannedCode = document.getElementById("serialNo").value
      this.onClickCurModel(e);
      //alert(scannedCode)
    }
  };

  onClickCurModel = async (e) => {
    e.preventDefault();
    //alert("submit")
    let machineNumber = document.getElementById("machinenumber").value;
    let serialNo = document.getElementById("serialNo").value;
    let data = {
      machineNumber: machineNumber,
      serialNo: serialNo,
    };
    if(data.machineNumber === "" || data.serialNo === ""){
      Swal.fire({
        icon: "error",
        title: `กรุณากรอกข้อมูลให้ถูกต้อง`,
        text: "กรุณาลองใหม่อีกครั้ง",
      });
      return;
    }

    let post = await httpClient
      .post(apiUrl + "checkMaterialSize", data)
      .catch((error) => {
        console.log(error);
      });

    try {
      console.log(post.data)

      if (post.data === "finish") {
  
        Swal.fire({
          icon: "error",
          title: `ม้วนคอยล์ดังกล่าวถูกใช้งานเสร็จสิ้นไม่สามารถดำเนินการต่อได้`,
          text: "เกิดข้อผิดพลาด",
        });
        return;
      }else if(post.data ==="Can't find matching die size"){
        Swal.fire({
          icon: "error",
          title: `เครื่อง ${data.machineNumber} ใช้ขนาดคอยล์ไม่ตรงกับขนาดคอยล์จากบาร์โค้ด`,
          text: "เกิดข้อผิดพลาด",
        });
        return;
      }else if(post.data === "This machine number doesn't exist"){
        Swal.fire({
          icon: "error",
          title: `ไม่พบหมายเลขเครื่อง ${data.machineNumber} ในฐานข้อมูล`,
          text: "เกิดข้อผิดพลาด",
        });
        return;
      }else if(post.data === "This serial number doesn't exist"){
        Swal.fire({
          icon: "error",
          title: `ไม่พบบาร์โค้ด ${data.serialNo} ในฐานข้อมูล`,
          text: "เกิดข้อผิดพลาด",
        });
        return;
      }
    } catch (error) {
      console.log({ error: error.message });
    }

    //this.setState({ machine: post });
    //console.log(post.data[0].status);
    let postData = [];
    try {
      postData = [
        {
          id: post.data[0].id,
          model_name: post.data[0].model_name,
          registered_at: post.data[0].registered_at,
          thickness: post.data[0].thickness,
          width: post.data[0].width,
          machine_no_id: post.data[0].machine_no_id,
          status: post.data[0].status,
        },
      ];
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: `ไม่พบรหัสบาร์โค้ดจากการใช้งานเครื่องจักรดังกล่าวในฐานข้อมูล`,
        text: "กรุณาลองใหม่อีกครั้ง",
      });
      return;
    }

    try {
      if (postData[0].id === undefined) {
        Swal.fire({
          icon: "error",
          title: `ไม่พบรหัสบาร์โค้ดจากการใช้งานเครื่องจักรดังกล่าวในฐานข้อมูล`,
          text: "กรุณาลองใหม่อีกครั้ง",
        });
        return;
      }
    } catch (error) {
      console.log([{ error: error.message }]);
    }

    if (postData) {
      //console.log(postData[0].status)
      //console.log("HasData")
      //this.publishMessage(postData)
      try {
        this.publishMessage(postData[0].machine_no_id, postData[0].serial_no);

        Swal.fire(
          "รหัสเครื่องจักรและรหัสบาร์โค้ดตรงกัน",
          "สามารถเริ่มการทำงานของเครื่องจักรได้",
          "success"
        );
      } catch (error) {
        console.log([{ error: error.message }]);
      }
    }
    this.setState({ machine: postData });
    //let post = httpClient.post(apiUrl+ "setCurrentModel",data)
  };

  publishMessage = async (machine_no, serial_no) => {
    //let client = mqtt.connect("mqtt://192.168.100.50:1885");

    let client = mqtt.connect(mqttURL);

    client.on("connect", () => {
      //console.log("connected");
      //console.log(machine_no)
      //console.log(`${machine_no}`)
      const topic = `${machine_no}/checkstatus`; // Replace with your desired MQTT topic
      const message = "1";
      console.log(topic);
      client.publish(topic, message, (err) => {
        if (err) {
          console.error("Error publishing message:", err);
        } else {
          //console.log(message);
          this.setState({ serial_no_check: serial_no });
        }

        client.end(); // Close the MQTT connection
      });
    });
  };

  // subscribeMessage = async () => {
  //   // console.log("TEST")
  //   // const topic = 'test'; // Replace with your MQTT topic
  //   // const message = 'Hello, MQTT!';
  //   let client = mqtt.connect(mqttURL);
  //   client.on("connect", () => {
  //     console.log("connected");
  //     client.subscribe("A01/material");
  //   });
  //   client.on("message", (topic, message) => {
  //     console.log(message.toString())
  //     httpClient
  //       .post(apiUrl + "updateStatus", {
  //         status: message.toString(),
  //         serial_no: this.state.serial_no_check,
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });

  //     //console.log(message.toString())
  //     // if(topic === "test2"){
  //     //     console.log(message.toString())
  //     //     this.setState({msg2 : message.toString()})
  //     // }
  //   });
  // };

  render() {
    const { machine } = this.state;

    const columns = [
      {
        name: "id",
        selector: (row) => row.id,
      },
      {
        name: "model_name",
        selector: (row) => row.model_name,
      },
      {
        name: "registered_at",
        selector: (row) => row.registered_at,
        sortable: true,
        format: (row) => moment(row.registered_at).format("lll"),
      },
      {
        name: "width",
        selector: (row) => row.width,
      },
      {
        name: "thickness",
        selector: (row) => row.thickness,
      },
    ];

    return (
      <div className="content-wrapper">
        <div className="container">
          <h1>
            <i>Check Material Size</i>
          </h1>
          {/* <form onSubmit={this.onClickCurModel}> */}
          <form>
            <div className="card-body">
              <div className="form-group">
                <label>Machine No.</label>
                <input
                  type="text"
                  className="form-control"
                  id="machinenumber"
                />
              </div>
              <div className="form-group">
                <label>Serial No.</label>
                <input
                  type="text"
                  className="form-control"
                  id="serialNo"
                  onKeyPress={this.handleKeyPress}
                />
              </div>

              {/* <button type="submit" className="btn btn-primary">
                {" "}
                Check Matching Model{" "}
              </button> */}

              {/* <button onClick={this.onClickCurModel} className="btn btn-primary"> Check Matching Model </button> */}
            </div>
          </form>

          <div>
            {(() => {
              if (this.state.machine.length !== 0) {
                return (
                  <div>
                    {/* <DataTable columns={columns} data={machine} pagination /> */}
                  </div>
                );
              } else {
              }
            })()}
          </div>
        </div>
      </div>
    );
  }
}
