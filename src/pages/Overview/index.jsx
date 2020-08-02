import React, {useState, useEffect} from 'react';
import firestore from "../../Firestore";

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

import {DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import EmployeeTransactions from "./EmployeTransactions";
import FraudTransactions from "./FraudTransactions";
import {EmployeeNames, EmployeeTransactionsRecords, EmployeeTransactionsTimes} from "../Enums/Employees"
import moment from 'moment';

const Overview = (props) => {

    const db = firestore.firestore();

    const [dayMoneySum, setDayMoneySum] = useState(0); 
    const [selectedDate, setSelectedDate] = useState(new Date("2020/7/28")); 
    const [tableRows, setTableRows] = useState([]); 
    const [tableHead, setTableHead] = useState([]); 
    const [tableSums, setTableSums] = useState([]);  
    const [fraudTransactions, setFraudTransactions] = useState([]);  
    const [table, setTable] = useState({});  

    const employeeNames = EmployeeNames;
    const employeeTransactionsRecords = EmployeeTransactionsRecords;
    const employeeTransactionsTimes = EmployeeTransactionsTimes;

    // let migrateObjects = []
    const [migratedObjects, setMigrateObject] = useState([])
    const [isMigrated, setMigrate] = useState(false)



  useEffect(() => {
    // Update the document title using the browser API
    //setSelectedDate(new Date())
    if(Object.keys(table).length == 0){
      getData(selectedDate);    
    }
    //console.log("deje se")
  });

   const get24hourRangeOnDay = (monthDay,month,year) =>{

    let starDate = new Date();
    starDate.setMonth(month);
    starDate.setDate(monthDay);
    starDate.setHours(7);
    starDate.setMinutes(0);
    starDate.setSeconds(0);
    starDate.setFullYear(year);

    let endDate = new Date();
    endDate.setMonth(month);
    endDate.setDate(monthDay);
    endDate.setHours(24);
    endDate.setMinutes(0);
    endDate.setSeconds(0);
    endDate.setFullYear(year);

    return {"start":starDate,"end":endDate};
  }

  const handleMigrate = () =>{
    console.log("migruju")
    //console.log(migratedObjects)
    let i = 0;
    migratedObjects.map(item=>{
    //  if (i > 5 ) return 
    // let setDate = new Date(item.timestamp.seconds * 1000);
    let setDate = item.timestamp
    console.log(setDate)
      //db.collection("nailsfloraprod").add(item)
      i++;
    })

  }

  const getData = (inputDate) => {

    //let db = firestore.firestore();


    //let pickeddate = selecteddate;
    let pickedDate = inputDate;

    var today = pickedDate.getDate();
    var month = pickedDate.getMonth();
    var year = pickedDate.getFullYear();

    var rangeDate = get24hourRangeOnDay(today,month, year);
    var dayMoneySum = 0;

    db.collection("nailsfloraprod").where("timestamp",">=",rangeDate.start).where("timestamp","<=",rangeDate.end).get().then((querySnapshot) => {

          //let TMPemployeeTransactionsTimes = Object.assign({},employeeTransactionsTimes);

          for (let [key, value] of Object.entries(employeeTransactionsTimes)) {
            employeeTransactionsTimes[key] = [];
          }

          let tmpMoney = 0;
          console.log("volam sa")
          let migrateArray = []; 


          querySnapshot.forEach((doc) => {
              let migrateContainer = {}
              //console.log(doc.data())
              var tmp = doc.data().timestamp.seconds;
              let setDate = new Date(doc.data().timestamp.seconds * 1000);
              //console.log(employeeNames[doc.data().employeeId] + doc.data().price + " " + new Date(doc.data().timestamp.seconds * 1000))
              dayMoneySum += doc.data().price

              //console.log(doc.data()["timestamp"])
              setDate.setFullYear(2020)
              setDate.setMonth(6)
              setDate.setDate(29)
              setDate.setHours(setDate.getHours() + 3)
              console.log(setDate.toString())
              
              Object.assign(migrateContainer, doc.data())
              migrateContainer["timestamp"] = setDate;
              migrateArray.push(migrateContainer)

              //console.log(doc.data().price + " " + doc.data().employeeId)
              tmpMoney = tmpMoney + doc.data().price;
              tmpMoney = tmpMoney * 1;

              if (doc.data().employeeId in employeeTransactionsRecords) {
                employeeTransactionsRecords[doc.data().employeeId].push(doc.data().price)

                //check for duplicates
                let isDuplicate = false;
                employeeTransactionsTimes[doc.data().employeeId].map(item => {
                  if (item.date.getTime() == setDate.getTime()) {
                    isDuplicate = true
                  }; 
                })

                if(!isDuplicate){
                  employeeTransactionsTimes[doc.data().employeeId].push({money:doc.data().price,date: setDate });
                }
              }

          });

          if(!isMigrated){
            setMigrate(true);
            setMigrateObject(migrateArray)
            // migrateObjects = migrateArray;
          }

          //find max length
          let maxRows = 0;

          let tableSums = [];

          for (let [key, value] of Object.entries(employeeTransactionsRecords)) {

            let employeeSum = 0;

            for (let money of value){
              employeeSum += parseInt(money);
            }

            tableSums.push(employeeSum);

            if (value.length > maxRows ) {
              maxRows = value.length
            }
          }

          // creating rows
          let tableRows = [];
          let records = Object.assign({}, employeeTransactionsRecords);

          for (var i = 0; i < maxRows ; i++) {

            let newRow = [];

            for (let [key, value] of Object.entries(records)) {
              //remove the first element
              let money = value.shift();

              if (money) {
                newRow.push(money);
              }else{
                newRow.push(0);
              }
            }

            tableRows.push(newRow);
          }


          const tableHead = Object.keys(employeeTransactionsRecords);

          let tableHeadNames = [];

          tableHead.map(val => tableHeadNames.push(employeeNames[val]));

          let fraudTransactions = findFraudTransactions(employeeTransactionsTimes);

          setDayMoneySum(tmpMoney)
          //setTableRows(tableRows)
          //setTableHead(tableHeadNames)
          //setTableSums(tableSums)
          //setFraudTransactions(fraudTransactions);
          setTable({tableRows:tableRows, tableHead: tableHeadNames,tableSums: tableSums, fraudTransactions:fraudTransactions});
    });
    return {}
  }

  const findFraudTransactions = (trns) => {

    let records = Object.assign({}, trns);
    let frauds = [];

    for (let [key, value] of Object.entries(records)) {
      //console.log(value)
      for (let i = 0; i < value.length -1; i++){
        let current = value[i].date;
        let next = value[i+1].date;
        let nextMoney = value[i+1].money;
        let difference = next.getTime() - current.getTime(); // This will give difference in milliseconds
        var resultSeconds = Math.abs(difference / 1000);

        //check the difference if it was less than 30min it is a possible fraud
        if (resultSeconds < 2700){
          let formatedFirst = moment(current).format('MMMM Do YYYY, h:mm:ss a')
          let formatedSecond = moment(next).format('MMMM Do YYYY, h:mm:ss a')
          frauds.push({id:employeeNames[key] , firstDate: formatedFirst, secondDate: formatedSecond, diff: resultSeconds/60, money: nextMoney})
        }
      }
    }


      //console.log(frauds)
    return frauds;
  }

  const handleDateChange = (date) => {

    getData(date);
    setSelectedDate(date);

    /*
    this.setState({ selectedDate: date }, function(this){
      getData();
    });
    */
  }

    //console.log("calling render")

    if (!table.tableHead) return ("ahoj"); 

    return (
     <div>

       <Button onClick={()=>handleMigrate()}>Migrate</Button>
      <Container maxWidth="sm">

        <DatePicker value={selectedDate} onChange={handleDateChange} />

      </Container>

      <h1>
       {dayMoneySum}
      </h1>

      <EmployeeTransactions name="" tableSums={table.tableSums} tableRows={table.tableRows} tableHead={table.tableHead}></EmployeeTransactions>
      <FraudTransactions transactions={table.fraudTransactions}></FraudTransactions>

     </div>



        );

    }

export default Overview;

