import React, { Component } from "react";
import DataTable from "react-data-table-component";
import { httpClient } from "../utils/HttpClient";
import { apiUrl } from "../constant";
import moment from "moment";

export default class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      machine: [],
    };
  }

  componentDidMount() {
    httpClient
      .get(apiUrl + "getData")
      .then((res) => {
        let datas = [];
        try {
          datas = res.data;
        } catch (error) {
          console.log([{ error: error.message }]);
        }

        if (datas !== "error") {
          this.setState({ machine: datas });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { machine } = this.state;
    const columns = [
      {
        name: "ID",
        selector: (row) => row.id,
      },
      {
        name: "Serial No.",
        selector: (row) => row.serial_no,
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
        name: "Status",
        selector: (row) => row.status,
        sortable: true,
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
            <i>Material Stock</i>
          </h1>
          {(() => {
            if (this.state.machine != null) {
              return (
                <div>
                  <DataTable
                    columns={columns}
                    data={machine}
                    pagination
                    defaultSortFieldId={6}
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
    );
  }
}
