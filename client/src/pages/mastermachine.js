import React, { Component } from "react";
import DataTable from "react-data-table-component";
import { httpClient } from "../utils/HttpClient";
import { apiUrl } from "../constant";
import moment from "moment";

import Swal from "sweetalert2";

export default class mastermachine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      machine: [],
      showModal: false,
    };
  }

  componentDidMount() {
    httpClient
      .get(apiUrl + "getMasterMachine")
      .then((res) => {
        const datas = res.data;
        //console.log(datas)
        if (datas !== "error") {
          this.setState({ machine: datas });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleDelete = async (row) => {
    await httpClient
      .post(apiUrl + "deleteMasterMachine", row)
      .catch((error) => {
        console.log(error);
      });
    //let tableRow = document.getElementById(`row-${row.id}`);
    window.location.reload(true);
    //alert(row.registered_at);
  };

  onClickInsertMasterMachine = async () => {
    let machineNumber = document.getElementById("modelNameInput").value;
    let data = {
      machine_no: String(machineNumber).trim(),
    };
    let insert = await httpClient.post(apiUrl + "insertMasterMachine", data).catch((error) => {
      console.log(error);
    });

    try {
      if (insert.data === false) {
        window.location.reload(true);
      } else {
        // console.log(insert.data)
        switch(insert.data){
          case "duped":
            Swal.fire({
              icon: "error",
              title: `พบข้อมูลซ้ำในฐานข้อมูล`,
              text: "กรุณาลองใหม่อีกครั้ง",
            });
            break;
          case "ok":
            window.location.reload(true);
            // Swal.fire(
            //   "ข้อมูลหมายเลขเครื่องถูกต้อง",
            //   "ข้อมูลได้ถูกบันทึกลงไปยังฐานข้อมูล",
            //   "success"
            // ).then(function(){
            //   window.location.reload(true);
            // });
        
            
            break;
            default:
              Swal.fire({
                icon: "error",
                title: `กรุณากรอกข้อมูลให้ถูกต้อง`,
                text: "กรุณาลองใหม่อีกครั้ง",
              });
              break;
        }

      }
    } catch (error) {
      console.log([{ error: error.message }]);
    }
  };

  render() {
    const { machine } = this.state;

    const columns = [
      {
        name: "ID",
        selector: (row) => row.id,
      },
      {
        name: "Machine No.",
        selector: (row) => row.machine_no,
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
            <button onClick={() => this.handleDelete(row)}>Delete</button>
          </>
        ),
      },
    ];

    return (
      <div className="content-wrapper">
        <div className="container">
          <h1>
            <i>Register New Machine</i>
          </h1>

          <div className="card-body">
            <div className="form-group">
              <label htmlFor="machineNo">Machine No.</label>
              <input type="text" className="form-control" id="modelNameInput" />
            </div>

            <button
              onClick={this.onClickInsertMasterMachine}
              className="btn btn-primary"
            >
              Add New Machine
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
                      defaultSortFieldId={3}
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
