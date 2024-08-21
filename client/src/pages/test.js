import React, { Component } from "react";
import axios from "axios";
import { OK, server, APP_TITLE, key, YES } from "../../constance/contance";
import { httpClient } from "../../utils/HttpClient";
import Swal from "sweetalert2";
import * as moment from "moment";
import readXlsxFile from "read-excel-file";
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Upload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timestamp: "",
      time: "",
      mfgdate: "",
      update_by: "",
      area_validate: "form-control is-invalid",
      area: "",

      process: "Off",
      example: [
        {
          location: "6011",
          plant: "74CH",
          item_no: "10000107526",
          item_name: "OPALUS UDD-767IC13H2-A",
          spec: "-",
          unit: "SQM",
          type: "L",
          ballsize: "MNR15681",
          lot: "KWA-MNR15681 3-6",
          qty: 3022.8,
        },
      ],
      excel_data: [],
      sum_data: [],
    };
  }
  loadingScreen() {
    if (this.state.process === "on") {
      return (
        <div className="overlay">
          <i className="fas fa-3x fa-sync-alt fa-spin" />
          <div className="text-bold pt-2">Loading...</div>
        </div>
      );
    }
  }
  click_check = async () => {
    const input = document.getElementById("input");
    input.addEventListener("change", async () => {});
    const data1 = await readXlsxFile(input.files[0]);
    await this.setState({
      excel_data: data1,
    });

    await this.upload_compare();
  };
  upload_compare = async () => {
    // check by zone,dom,room
    for (let index = 1; index < this.state.excel_data.length; index++) {
      let check_command = await httpClient.post(server.CHECK_MASTER_AREA, {
        area: this.state.area,
        location: this.state.excel_data[index][0],
      });

      console.log(check_command.data.result);
      if (check_command.data.result.length == 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            "Location " +
            this.state.excel_data[index][0] +
            " ไม่มีใน " +
            this.state.area,
        });
        this.setState({ process: "off" });
        return;
      }
      console.log(this.state.excel_data[index][8]);
      if (
        this.state.excel_data[index][8] == "" ||
        this.state.excel_data[index][8] == null
      ) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "กรุณาใส่ lot ให้ครบ",
        });
        this.setState({ process: "off" });
        return;
      }
    }

    // this.upload_command();
  };
  upload_command = async () => {
    // check by zone,dom,room
    for (let index = 1; index < this.state.excel_data.length; index++) {
      const yourDate = new Date();
      const data_1 = {
        timestamp: moment(yourDate).format("YYYY-MM-DD HH:mm:ss.000"),
        time: moment(yourDate).format("HH:mm:ss"),
        mfgdate: moment(yourDate).format("YYYY-MM-DD"),
        update_by: localStorage.getItem(key.USER_EMP),
        area: this.state.area,
        location: this.state.excel_data[index][0],
        plant: this.state.excel_data[index][1],
        item_no: this.state.excel_data[index][2],
        item_name: this.state.excel_data[index][3],
        spec: this.state.excel_data[index][4],
        unit: this.state.excel_data[index][5],
        type: this.state.excel_data[index][6],
        ballsize: this.state.excel_data[index][7],
        lot: this.state.excel_data[index][8],
        qty: this.state.excel_data[index][9],
        operation: "upload",
        mr: "",
      };
      let check_command = await httpClient.post(server.MANUAL_UPLOAD, data_1);
      let up_command = await httpClient.post(server.LOG_UPLOAD, data_1);
    }

    await httpClient.post(server.CLEAR_NULL);
    Swal.fire({
      icon: "success",
      title: "บันทึกข้อมูลสำเร็จ",
      // text: this.state.excel_data[index][0] + " " + this.state.excel_data[index][1],
    });
    window.location.reload(false);
  };
  render() {
    return (
      <div className="content-wrapper">
        <h1 style={{ textAlign: "center" }}>Upload Data</h1>

        <div className="col-md-7" style={{ margin: "auto" }}>
          <div className="card card-primary ">
            <div className="card-header" style={{ backgroundColor: "#f8bbd0" }}>
              <h3 className="card-title">Detail</h3>
            </div>
            <div className="card-body ">
              <div className="overlay-wrapper">
                {this.loadingScreen()}
                <div
                  className="row"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ExcelFile
                    element={
                      <button className="btn btn-info btn-block">
                        Format Download
                      </button>
                    }
                    filename="data_example"
                    // fileExtension="XLSX"
                  >
                    <ExcelSheet data={this.state.example} name="Sheet1">
                      <ExcelColumn label="location" value="location" />
                      <ExcelColumn label="plant" value="plant" />
                      <ExcelColumn label="item_no" value="item_no" />
                      <ExcelColumn label="item_name" value="item_name" />
                      <ExcelColumn label="spec" value="spec" />
                      <ExcelColumn label="unit" value="unit" />
                      <ExcelColumn label="type" value="type" />
                      <ExcelColumn label="ballsize" value="ballsize" />
                      <ExcelColumn label="lot" value="lot" />
                      <ExcelColumn label="qty" value="qty" />
                    </ExcelSheet>
                  </ExcelFile>
                </div>
                <br /> <br />
                <div className="row">
                  <div style={{ width: "5%" }}> </div>
                  <div style={{ width: "20%" }}>
                    <select
                      className={this.state.area_validate}
                      onChange={async (e) => {
                        e.preventDefault();
                        await this.setState({
                          area: e.target.value,
                          area_validate: "form-control is-valid",
                        });
                      }}
                    >
                      <option value="All" selected disabled hidden>
                        Select One.
                      </option>
                      <option value="automate_conventional">
                        Automate Con
                      </option>
                      <option value="automate">Automate</option>
                      <option value="chem1">Chemical 1</option>
                      <option value="chem2">Chemical 2</option>
                      <option value="chem3">Chemical 3</option>
                    </select>
                  </div>
                  <div style={{ width: "5%" }}> </div>
                  <div style={{ width: "65%" }}>
                    <input type="file" id="input" class="form-control" />
                  </div>
                </div>
                <br /> <br />
                <div className="row">
                  <div style={{ width: "20%" }}>
                    <button
                      style={{ width: "100%" }}
                      className="btn btn-primary float-right"
                      onClick={(e) => {
                        // e.preventDefault();
                        console.log(this.state.area);
                        if (this.state.area == "") {
                          Swal.fire({
                            icon: "error",
                            title: "กรุณาเลือก Area",
                          });

                          return;
                        } else {
                          this.setState({ process: "on" });
                          this.click_check();
                        }
                      }}
                    >
                      Upload
                    </button>
                  </div>
                  <div style={{ width: "60%" }}></div>
                  <div style={{ width: "20%" }}>
                    <button
                      style={{ width: "100%" }}
                      className="btn btn-warning float-right"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.reload(false);
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Upload;
