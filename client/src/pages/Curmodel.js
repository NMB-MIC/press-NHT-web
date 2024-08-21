import React, { Component } from "react";
import DataTable from "react-data-table-component";
import { httpClient } from "../utils/HttpClient";
import { apiUrl } from "../constant";
import moment from "moment";
import Swal from "sweetalert2";

export default class Curmodel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      machine: [],
      masterModel: [],
      masterMachine: [],
    };
  }
  componentDidMount() {
    httpClient
      .get(apiUrl + "getCurrentModel")
      .then((res) => {
        const datas = res.data;

        if (datas !== "error") {
          this.setState({ machine: datas });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    httpClient
      .get(apiUrl + "getCurrentMasterModel")
      .then((res) => {
        const datas = res.data;
        //console.log(datas)
        if (datas !== "error") {
          this.setState({ masterModel: datas });
        }
      })
      .catch((error) => {
        console.log(error);
      });

      httpClient
      .get(apiUrl + "getMasterMachine")
      .then((res) => {
        const datas = res.data;
        //console.log(datas)
        if (datas !== "error") {
          this.setState({ masterMachine: datas });
        }
       
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onClickCurModel() {
    let machineNumber = document.getElementById("machinenumber").value;
    let serialNo = document.getElementById("modelname").value;
    //let serialNo = document.getElementById("modelname").value;
    let data = {
      machineNumber: machineNumber,
      serialNo: serialNo,
    };

    httpClient
      .post(apiUrl + "setCurrentModel", data)
      .then(function (result) {
        //console.log(result.data)
        if (result.data === "Please type input correctly.") {
          Swal.fire({
            icon: "error",
            title: `กรุณากรอกข้อมูลให้ถูกต้อง`,
            text: "กรุณาลองใหม่อีกครั้ง",
          });
        } else {
          window.location.reload(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    //console.log(post)
  }

  render() {
    const { machine } = this.state;
    
    const columns = [
      {
        name: "ID",
        selector: (row) => row.id,
      },
      {
        name: "Machine No.",
        selector: (row) => row.machine_no_id,
      },
      {
        name: "Die No.",
        selector: (row) => row.model_name_id,
      },
      {
        name: "Registered At",
        selector: (row) => row.registered_at,
        sortable: true,
        format: (row) => moment(row.registered_at).format("lll"),
      },
    ];

    return (
      <div className="content-wrapper">
        <div className="container">
          <h1>
            <i>Set Machine Current Die</i>
          </h1>

          <div className="card-body">
            <div className="form-group">
              <label htmlFor="machineNo">Machine No.</label>
              <select id="machinenumber" className="border rounded w-100 p-2">
                 {this.state.masterMachine.map((machine) => (
                  <option key={machine.id} value={machine.machine_no}>
                    {machine.machine_no}
                  </option>
                ))} *
              </select>
              {/* <input type="text" className="form-control" id="machinenumber" /> */}
            </div>

            <div className="form-group">
              <label htmlFor="serialNo">Die No.</label>
              <select id="modelname" className="border rounded w-100 p-2">
                {this.state.masterModel.map((die) => (
                  <option key={die.id} value={die.model_name}>
                    {die.model_name}
                  </option>
                ))}
              </select>

              {/* <input type="text" className="form-control" id="modelname" /> */}
            </div>

            <button onClick={this.onClickCurModel} className="btn btn-primary">
              Set Current Die
            </button>
          </div>

          <div>
            {(() => {
              if (this.state.machine != null) {
                return (
                  <div>
                    <DataTable
                      columns={columns}
                      data={machine}
                      pagination
                      defaultSortFieldId={4}
                      defaultSortAsc={false}
                    />
                  </div>
                );
              } else {
                return <div>Loading...</div>;
              }
            })()}
          </div>
        </div>
      </div>
    );
  }
}
