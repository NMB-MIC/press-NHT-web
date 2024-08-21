import React, { Component, useState } from "react";
import * as XLSX from "xlsx";
import { httpClient } from "../utils/HttpClient";
import { apiUpload, apiUrl } from "../constant";
import readXlsxFile from "read-excel-file";
import * as moment from "moment";
import Swal from "sweetalert2";

export default class Upload extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      file: "",
    };
  }
  handleClick(e) {
    this.refs.fileUploader.click();
  }

  uploadExcelFile = async (e) => {
    try {
      const input = document.getElementById("file");
      input.addEventListener("change", async () => {});
      const data1 = await readXlsxFile(input.files[0]);
      // console.log(data1);
      const yourDate = new Date();

      let data2 = [];

      for (let i = 1; i < data1.length; i++) {
        data2.push({
          serial_no: data1[i][0],
          thickness: data1[i][1],
          width: data1[i][2],
          status: "new",
          registered_at: moment(yourDate).format("YYYY-MM-DD HH:mm:ss.000"),
        });
      }
      console.log(data2);

      //console.log(JSON.stringify(data2));
      let posttest = await httpClient
        .post(apiUrl + "testApp", data2)
        .catch((error) => {
          console.log(error);
        });

      if (posttest) {
        Swal.fire(
          "อัพโหลดข้อมูลสำเร็จ",
          "ไฟล์ได้ถูกบันทึกลงไปยังฐานข้อมูล",
          "success"
        );
      }

      //console.log(posttest.data)
      if (posttest.data.error) {
        if (posttest.data.error === "Validation error") {
          Swal.fire({
            title: `<strong>พบข้อมูลซ้ำระหว่างไฟล์ที่อัพโหลดและฐานข้อมูลไม่สามารถดำเนินการต่อได้</strong>`,
            html: `เกิดข้อผิดพลาด`,
            icon: "error",
          }).then(function () {
            window.location.reload(true);
          });
        } else {
          Swal.fire({
            // title: `<strong>${posttest.data.error}</strong>`,
            title: `ค่าของข้อมูลไฟล์ที่อัพโหลดไม่ถูกต้อง`,
            html: `เกิดข้อผิดพลาด`,
            icon: "error",
          }).then(function () {
            window.location.reload(true);
          });
        }
      }
    } catch (error) {
      console.log([{ error: error.message }]);
      if (error.message === "invalid zip data") {
        Swal.fire({
          title: `<strong>กรุณาเลือกไฟล์ที่จะอัพโหลด</strong>`,
          html: `เกิดข้อผิดพลาด`,
          icon: "error",
        }).then(function () {
          //window.location.reload(true);
        });
      } else {
        Swal.fire({
          title: `<strong>เกิดข้อผิดพลาดเกี่ยวกับไฟล์ที่อัพโหลด</strong>`,
          html: `เกิดข้อผิดพลาด`,
          icon: "error",
        }).then(function () {
          window.location.reload(true);
        });
      }
    }
  };

  render() {
    return (
      <div className="content-wrapper">
        <div className="container">
          <h1>
            <i>Upload Excel File</i>
          </h1>
          <div className="form-inline ">
            <input
              className="form-control "
              type="file"
              id="file"
              ref="fileUploader"
              
              // onChange={this.filePathset.bind(this)}
            />
            <button
              onClick={() => {
                this.uploadExcelFile();
              }}
             className="btn btn-primary">
              Read File
            </button>
          </div>
        </div>
      </div>
    );
  }
}
