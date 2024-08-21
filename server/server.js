const express = require("express");
const Machine = require("./dbFiles/machine");
const dbOperation = require("./dbFiles/dbOperation");
const app = express();
const PORT = 5001;
const cors = require("cors");
const sequelize = require("./instances/instance");
const AppControl = require("./models/app_control_machine");
const Model = require("./dbFiles/model");
const employee = require("./models/employee_model");
const bcrypt = require("bcryptjs");

// const bodyParser = require("body-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(express.json());
app.use(cors());

let dataTest;

app.post("/test", async (req, res) => {
  try {
    let data = await req.body;
    console.log(data);
    res.json({ result: data });
  } catch (error) {
    res.send("error");
  }
});

app.post("/testApp", async (req, res) => {
  let table = req.body;
  //console.log(table);
  try {
    let result = await AppControl.bulkCreate(table);

    res.json({ result: result });
  } catch (error) {
    res.send({ error: error.message });
  }
});

app.get("/getData", async (req, res) => {
  //console.log("called");
  try {
    const result = await dbOperation.getMachine();
    res.send(result.recordset);
  } catch (error) {
    res.send("error");
  }
});

app.get("/getCurrentModel", async (req, res) => {
  try {
    const result = await dbOperation.getCurrentModel();
    res.send(result.recordset);
  } catch (error) {
    res.send("error");
  }
});

app.get("/getCurrentMasterModel", async (req, res) => {
  try {
    const result = await dbOperation.getMasterModel();
    res.send(result.recordset);
  } catch (error) {
    res.send("error");
  }
});
app.post("/updateMasterModel", async (req, res) => {
  try {
    let data = await req.body;
    let newModel = new Model(data[0], data[1], data[2]);
    await dbOperation.updateMasterModel(newModel);

    res.send("ok");
  } catch (error) {
    res.send("error");
  }
});




app.post("/deleteMasterModel", async (req, res) => {
  try {
    let data = await req.body;

    let newModel = new Model(data.model_name, data.width, data.thickness);

    await dbOperation.deleteMasterModel(newModel);
    res.send("ok");
  } catch (error) {
    res.send("error");
  }
});


app.post("/insertMasterModel", async (req, res) => {
  try {
    let data = await req.body;
    let newModel = new Model(data.modelName, data.width, data.thickness);
    // console.log(newModel)
    if (data.modelName == "" || data.width == "" || data.thickness == "") {
      res.send("Please type input correctly.");
      return;
    }
    // const result = await dbOperation.getCurrentModel();
    //let recordSet = result.recordset;
    // let newModel = new Model(data[0],data[1],data[2])

    let resultObj = await dbOperation.checkMasterModel(newModel);

    console.log(resultObj.recordset.length ? "have one" : "don't have");

    resultObj.recordset.length
      ? "already had one"
      : await dbOperation.insertMasterModel(newModel);

    if (resultObj.recordset.length == 0) {
      res.send(false);
    } else {
      //if(resultObj.recordset.length < 3 && resultObj.recordset.length > 0)
      res.send("Model is duplicated. Please try again.");
    }
  } catch (error) {
    res.send("error");
  }
});

app.post("/setCurrentModel", async (req, res) => {
  try {
    let data = await req.body;
    //console.log(data)

    if (data.machineNumber == "" || data.serialNo == "") {
      res.send("Please type input correctly.");
      return;
    }

    //console.log(data.machineNumber + " : " + data.serialNo)
    await dbOperation.insertCurrentModel(data.machineNumber, data.serialNo);

    res.send("ok");
  } catch (error) {
    res.send("error");
  }
});

app.post("/checkMaterialSize", async (req, res) => {
  try {
    let data = await req.body;
    let model = await dbOperation.getAllMatchingWidthAndThicknessInStock(
      String(data.machineNumber).trim(),
      String(data.serialNo).trim()
    );
    res.send(model);
  } catch (error) {
    res.send("error");
  }
});

app.post("/updateStatus", async (req, res) => {
  let str = await req.body;
  console.log(str.status + " : " + str.serial_no);
  //await dbOperation.updateStatus(str.status, str.serial_no)
  res.send("ok");
  //let operation = await dbOperation.updateStatus()
});


app.get("/getMasterMachine", async (req, res) => {
  //console.log("called");
  try {
    const result = await dbOperation.getMasterMachine();
    res.send(result.recordset);
  } catch (error) {
    res.send("error");
  }
});

app.post("/deleteMasterMachine", async (req, res) => {
  try {
    let data = await req.body;

    let newModel = data.machine_no;

    await dbOperation.deleteMasterMachine(newModel);
    res.send("ok");
  } catch (error) {
    res.send("error");
  }
});

app.post("/insertMasterMachine", async (req,res) =>{
  let data = await req.body;
  //console.log(data.machine_no)
  if(data.machine_no == ""){
    res.send("Please type input correctly.")
    return
  }
  let checkResult = await dbOperation.checkMasterMachine(data.machine_no)
  //console.log(checkResult.recordset.length ? "have one" : "don't have");
 
  if(checkResult.recordset.length != 0){//data is duped as it checked and found some length
    res.send("duped")  
    return
  }else{
    await dbOperation.insertMasterMachine(data.machine_no)
  
  }


  res.send("ok")
})


app.post("/api/register", async(req,res) =>{
  try {
    const {
      employee_id,
      name_eng,
      password,
      position,
      section,
      department,
      level_sys,
      
    } = req.body;

    //console.log(req.body)

    const result = await employee.create({
      employee_id: employee_id,
      name_eng: name_eng,
      position: position,
      section: section,
      department: department,
      level_sys: level_sys,
      password: bcrypt.hashSync(password, 8),
     
     
    });
    res.send("ok")
  } catch (error) {
    res.send("error")
  }

 // console.log(data)

})

app.post("/api/login", async (req, res) => {
  try{
    let { employee_id, password } = req.body;
    //console.log(req.body)
    let result = await employee.findOne({ where: { employee_id: employee_id } });
    console.log(result.name_eng);
  
    if(result != null){
  
      if( result.level_sys == "ADMIN" ||
          result.level_sys == "SUPERVISOR" ||
          result.level_sys == "STAFF"){
            
        
    
        if(bcrypt.compareSync(password, result.password)){
          res.send({ result, message: "OK" })
 
        }else{
          res.send("incorrect_username_password")

        }
  
      }else{

        if(bcrypt.compareSync(password, result.password)){
          res.send("invalid_permission")
        }else{
          res.send("incorrect_username_password")
        }

    
  
      }
  
    }else{
      res.send("incorrect_username_password")

    }
  }catch(error){
    res.send("failed")

  }
  

})


app.use("/api/authen", require("./api/api_login"));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
