import React, { Component } from "react";
import DataTable from "react-data-table-component";
import { httpClient } from "../utils/HttpClient";
import { apiUrl } from "../constant";
import moment from "moment";

import Swal from "sweetalert2";

export default class mastermodel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      machine: [],
      showModal: false,
    };
  }

  handleEdit = async (row) => {
    const { value: formValues } = await Swal.fire({
      title: "<i>Edit Model Detail</i>",
      html: `
  
      <div>Model Name<input type="text" readonly id="myText" value="${row.model_name}" style="color:grey;"></div>
      <div>Width&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="number" style="" min="0" id="myText2" value="${row.width}"></div>
      <div>Thickness&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="number" style="" min="0" id="myText3" value="${row.thickness}"></div>
      
   

      `,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("myText").value,
          document.getElementById("myText2").value,
          document.getElementById("myText3").value,
        ];
      },
      //   showConfirmButton: false,
    });
    if (formValues) {
      await httpClient
        .post(apiUrl + "updateMasterModel", formValues)
        .catch((error) => {
          console.log(error);
        });
      window.location.reload(true);
    }
  };

  handleDelete = async (row) => {
    await httpClient.post(apiUrl + "deleteMasterModel", row).catch((error) => {
      console.log(error);
    });
    //let tableRow = document.getElementById(`row-${row.id}`);
    window.location.reload(true);
    //alert(row.registered_at);
  };

  componentDidMount() {
    httpClient
      .get(apiUrl + "getCurrentMasterModel")
      .then((res) => {
        const datas = res.data;
        if (datas !== "error") {
          this.setState({ machine: datas });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  onClickInsertMasterModel = async () => {
    let modelName = document.getElementById("modelNameInput").value;
    let width = document.getElementById("widthInput").value;
    let thickness = document.getElementById("thicknessInput").value;

    let data = {
      modelName: String(modelName).trim(),
      width: String(width).trim(),
      thickness: String(thickness).trim(),
    };

    let d = await httpClient
      .post(apiUrl + "insertMasterModel", data)
      .catch((error) => {
        console.log(error);
      });

    try {
      if (d.data === false) {
        window.location.reload(true);
      } else {
        console.log(d.data)
        if(d.data === "Model is duplicated. Please try again."){
          Swal.fire({
            icon: "error",
            title: `พบข้อมูลซ้ำในฐานข้อมูล`,
            text: "กรุณาลองใหม่อีกครั้ง",
          });
        }else{
          Swal.fire({
            icon: "error",
            title: `กรุณากรอกข้อมูลให้ถูกต้อง`,
            text: "กรุณาลองใหม่อีกครั้ง",
          });
        }
   
      }
    } catch (error) {
      console.log([{ error: error.message }]);
    }

    //window.location.reload(true)
  };

  render() {
    // const Swal = require('sweetalert2')
    const { machine } = this.state;

    const columns = [
      {
        name: "ID",
        selector: (row) => row.id,
      },
      {
        name: "Die No.",
        selector: (row) => row.model_name,
      },
      {
        name: "Width",
        selector: (row) => row.width,
        sortable: true,
      },
      {
        name: "Thickness",
        selector: (row) => row.thickness,
        sortable: true,
      },
      {
        name: "Registered At",
        selector: (row) => row.registered_at,
        sortable: true,
        format: (row) => moment(row.registered_at).format("lll"),
      },
      {
        name: "Edit",
        cell: (row) => (
          <>
            <button onClick={() => this.handleEdit(row)}>Edit</button>

            <button onClick={() => this.handleDelete(row)}>Delete</button>
          </>
        ),
      },
    ];

    return (
      <div className="content-wrapper">
        <div className="container">
          <h1><i>Register New Die</i></h1>

          <div className="card-body">
            <div className="form-group">
              <label htmlFor="machineNo">Die No.</label>
              <input type="text" className="form-control" id="modelNameInput" />
            </div>
            <div className="form-group">
              <label htmlFor="serialNo">Width</label>
              <input
                type="number"
                min="0"
                className="form-control"
                id="widthInput"
              />
            </div>
            <div className="form-group">
              <label htmlFor="serialNo">Thickness</label>
              <input
                type="number"
                min="0"
                className="form-control"
                id="thicknessInput"
              />
            </div>

            <button
              onClick={this.onClickInsertMasterModel}
              className="btn btn-primary"
            >
              Add New Die
            </button>
          </div>

          <div>
            {" "}
            {(() => {
              if (this.state.machine != null) {
                return (
                  <div>
                    <DataTable
                      columns={columns}
                      data={machine}
                      pagination
                      allowRowEvents
                      defaultSortFieldId={5}
                      defaultSortAsc={false}
                    />
                  </div>
                );
              } else {
                return <div>Loading...</div>;
              }
            })()}{" "}
          </div>
        </div>
      </div>
    );
  }
}
