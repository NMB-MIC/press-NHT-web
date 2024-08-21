const config = require("./dbConfig"),
  sql = require("mssql");

const createMachine = async (Machine) => {
  try {
    let pool = await sql.connect(config);
    let machine = await pool.request().query(
      `INSERT INTO [dbo].[app_machine_control_stock]
    VALUES(
        '${Machine.delivery_date}',
        '${Machine.vendor}',
        '${Machine.barcode}',
        ${Machine.weight},
        ${Machine.thickness},
        ${Machine.width})`
    );
    return machine;
  } catch (error) {
    console.log(error);
  }
};

const getMachine = async () => {
  try {
    let pool = await sql.connect(config);
    let machine = await pool.request().query(
      `SELECT *
    FROM [machine_control].[dbo].[app_machine_control_stock]`
    );
    //console.log(machine);
    return machine;
  } catch (error) {
    console.log(error);
  }
};

const getCurrentModel = async () => {
  try {
    let pool = await sql.connect(config);
    let machine = await pool.request().query(
      `SELECT *
        FROM [machine_control].[dbo].[app_machine_control_curmodel]`
    );
    //console.log(machine);
    return machine;
  } catch (error) {
    console.log(error);
  }
};

const getMasterModel = async () => {
  try {
    let pool = await sql.connect(config);
    let machine = await pool.request().query(
      `SELECT *
    FROM [machine_control].[dbo].[app_machine_control_mastermodel]`
    );
    //console.log(machine);
    return machine;
  } catch (error) {
    console.log(error);
  }
};

const updateMasterModel = async (model) => {
  try {
    let pool = await sql.connect(config);
    let machine = await pool.request().query(
      `UPDATE [machine_control].[dbo].[app_machine_control_mastermodel]
        SET width =  ${model.width}, thickness = ${model.thickness}
        WHERE model_name = '${model.model_name}'
        `
    );
    console.log("update complete!");
    //console.log(machine);
    //return machine;
  } catch (error) {
    console.log(error);
  }
};

const deleteMasterModel = async (model) => {
  try {
    let pool = await sql.connect(config);
    let machine = await pool.request().query(
      `DELETE [machine_control].[dbo].[app_machine_control_mastermodel]
        WHERE model_name = '${model.model_name}' AND width =  ${model.width} AND thickness = ${model.thickness}
        `
    );
    console.log("delete complete!");
    //console.log(machine);
    //return machine;
  } catch (error) {
    console.log(error);
  }
};

const insertMasterModel = async (model) => {
  try {
    let pool = await sql.connect(config);
    let machine = await pool.request().query(
      `INSERT INTO [dbo].[app_machine_control_mastermodel]
      ([model_name]
      ,[width]
      ,[thickness]
      ,[registered_at])
      VALUES
      ('${model.model_name}',
      ${model.width},
      ${model.thickness},
      GETDATE())
      `
    );
    console.log("insert complete!");
    //console.log(machine);
    //return machine;
  } catch (error) {
    console.log(error);
  }
};

const checkMasterModel = async (model) => {
  try {
    let pool = await sql.connect(config);
    let machine = await pool.request().query(
      `SELECT *
        FROM [machine_control].[dbo].[app_machine_control_mastermodel]
        WHERE model_name = '${model.model_name}'
        `
    );
    //console.log("insert complete!");
    //console.log(machine);
    return machine;
  } catch (error) {
    console.log(error);
  }
};

const insertCurrentModel = async (machine_no, modelName) => {
  try {
    let pool = await sql.connect(config);
    let machine = await pool.request().query(
      `INSERT INTO [dbo].[app_machine_control_curmodel]
      ([machine_no_id]
      ,[registered_at]
      ,[model_name_id])
VALUES
      ('${machine_no}',
      GETDATE(),
      '${modelName}')`
    );
    console.log("insert current model complete!");
    //console.log(machine);
    //return machine;
  } catch (error) {
    console.log(error);
  }
};

const checkIfStockFinished = async (serial_no) => {
  try {
    let pool = await sql.connect(config);
    let machine = await pool
      .request()
      .query(
        `select * from app_machine_control_stock where serial_no = '${serial_no}' and status = 'finish'`
      );
    return machine;
  } catch (error) {
    console.log(error);
  }
};

const getAllMatchingWidthAndThicknessInStock = async (
  machine_no,
  serial_no
) => {
  try {
   



    let pool = await sql.connect(config);
    let isMachineFound = await pool
    .request()
    .query(
      `SELECT * from app_machine_control_mastermachine where machine_no = '${machine_no}'`
    );;
    
    if(isMachineFound.recordset[0] === undefined){
      return "This machine number doesn't exist";
    }


    let getMatchingSerialStock = await pool
      .request()
      .query(
        `select * from app_machine_control_stock where serial_no = '${serial_no}'`
      );

    if(getMatchingSerialStock.recordset[0] === undefined){
      return "This serial number doesn't exist";
    }


    let serialNumber = String(getMatchingSerialStock.recordset[0].serial_no);
    let status = String(getMatchingSerialStock.recordset[0].status);

    if (status === "finish") return "finish";


    let checkSize;
    try {
      checkSize = await pool
        .request()
        .query(
          `select * from app_machine_control_mastermodel where width=${getMatchingSerialStock.recordset[0].width} and thickness=${getMatchingSerialStock.recordset[0].thickness}`
        );
      if(checkSize.recordset[0] === undefined){
        return "Can't find matching die size"
      }
    } catch (error) {
      return "Can't find a die number in stock with current serial number";
    }
    let getCurrentModelOnMachine;

    try {
      getCurrentModelOnMachine = await pool
        .request()
        .query(
          `select top 1 * from app_machine_control_curmodel where machine_no_id = '${machine_no}' order by registered_at desc`
        );
      console.log(machine_no);
      console.log(getCurrentModelOnMachine.recordset[0].model_name_id);
    } catch (error) {}
    let currentModelName = "";

    try {
      currentModelName = String(
        getCurrentModelOnMachine.recordset[0].model_name_id
      ).trim();
    } catch (error) {}

    let getMatchingCurrentMasterModel;
    try {
      getMatchingCurrentMasterModel = await pool
        .request()
        .query(
          `select * from app_machine_control_mastermodel where model_name = '${currentModelName}'`
        );
    } catch (error) {}
    //console.log(getMatchingCurrentMasterModel)

    try {
      for (let i = 0; i < checkSize.recordset.length; i++) {
        if (checkSize.recordset[i].model_name == currentModelName) {
          //console.log('pump')
          //return checkSize.recordset[i];

          await pool.request().query(
            `INSERT INTO [dbo].[app_machine_control_checksize]
            ([machine_no]
            ,[serial_no]
            ,[width]
            ,[thickness]
            ,[status]
            ,[registered_at]
            ,[model_name])
      VALUES
      ('${getCurrentModelOnMachine.recordset[0].machine_no_id}',
      '${serialNumber}',
      ${checkSize.recordset[i].width},
      ${checkSize.recordset[i].thickness},
      '${status}',
      GETDATE(),
      '${checkSize.recordset[i].model_name}'
      )`
          );

          let data = [
            {
              id: checkSize.recordset[i].id,
              model_name: checkSize.recordset[i].model_name,
              width: checkSize.recordset[i].width,
              thickness: checkSize.recordset[i].thickness,
              registered_at: checkSize.recordset[i].registered_at,
              machine_no_id:
                getCurrentModelOnMachine.recordset[0].machine_no_id,
              status: status,
              serial_no: serialNumber,
            },
          ];

          return data;
        }
      }
    } catch (error) {
      return "Can't find a matching machine with relevant model";
    }

    //console.log("table create!");
    //return machine
    //console.log(machine);
    //return machine;
  } catch (error) {
    return "Could not connect to SQL server.";
  }
};

const updateStatus = async (status, serial_no) => {
  try {
    let pool = await sql.connect(config);
    let machine = await pool.request().query(
      `update app_machine_control_stock 
      set status = 'out' 
      where serial_no = '${serial_no}'`
    );
    //console.log("ok")

    //return machine;
  } catch (error) {
    console.log(error);
  }
};

const getMasterMachine = async () => {
  try {
    let pool = await sql.connect(config);
    let machine = await pool.request().query(
      `SELECT *
    FROM [machine_control].[dbo].[app_machine_control_mastermachine]`
    );
    //console.log(machine);
    return machine;
  } catch (error) {
    console.log(error);
  }
};

const deleteMasterMachine = async (machineRow) => {
  try {
    let pool = await sql.connect(config);
    let machine = await pool.request().query(
      `DELETE [machine_control].[dbo].[app_machine_control_mastermachine]
        WHERE machine_no = '${machineRow}'
        `
    );
    console.log("delete complete!");
    //console.log(machine);
    //return machine;
  } catch (error) {
    console.log(error);
  }
};

const checkMasterMachine = async (machine_no) => {
  try {
    let pool = await sql.connect(config);
    let machine = await pool.request().query(
      `SELECT * 
      FROM [machine_control].[dbo].[app_machine_control_mastermachine]
      WHERE machine_no  = '${machine_no}'
        `
    );
    //console.log("insert complete!");
    //console.log(machine);
    return machine;
  } catch (error) {
    console.log(error);
  }
};

const insertMasterMachine = async (machine_no) => {
  console.log(machine_no)
  try {
    let pool = await sql.connect(config);
    let machine = await pool.request().query(
      `INSERT INTO [dbo].[app_machine_control_mastermachine]
      ([machine_no]
      ,[registered_at])
      VALUES
      ('${machine_no}',
      GETDATE())`
    );
    console.log("insert complete!");
    //console.log(machine);
    //return machine;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getMachine,
  createMachine,
  getCurrentModel,
  getMasterModel,
  updateMasterModel,
  deleteMasterModel,
  insertMasterModel,
  checkMasterModel,
  insertCurrentModel,
  getAllMatchingWidthAndThicknessInStock,
  updateStatus,
  checkIfStockFinished,
  getMasterMachine,
  deleteMasterMachine,
  checkMasterMachine,
  insertMasterMachine

  // checkSize,
  // getCurrentModelOnMachine,
};
