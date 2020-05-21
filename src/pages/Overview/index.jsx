import React, {useState, useEffect} from 'react';
import * as ReactDOM from "react-dom";
import firestore from "../../Firestore";

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

import {DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import EmployeeTransactions from "./EmployeTransactions";

const Overview = (props) => {

    const db = firestore.firestore();

    const [dayMoneySum, setDayMoneySum] = useState(0); 
    const [selectedDate, setSelectedDate] = useState(new Date()); 
    const [tableRows, setTableRows] = useState([]); 
    const [tableHead, setTableHead] = useState([]); 
    const [tableSums, setTableSums] = useState([]);  
    const [table, setTable] = useState({});  



  useEffect(() => {
    // Update the document title using the browser API
    //setSelectedDate(new Date())
    if(Object.keys(table).length == 0){
      getData(selectedDate);    
    }
    console.log("deje se")
  });

   const get24hourRangeOnDay = (monthDay,month) =>{

    let starDate = new Date();
    starDate.setMonth(month);
    starDate.setDate(monthDay);
    starDate.setHours(7);
    starDate.setMinutes(0);
    starDate.setSeconds(0);

    let endDate = new Date();
    endDate.setMonth(month);
    endDate.setDate(monthDay);
    endDate.setHours(24);
    endDate.setMinutes(0);
    endDate.setSeconds(0);

    return {"start":starDate,"end":endDate};
  }


  const getData = (inputDate) => {
    //let db = firestore.firestore();


    //let pickeddate = selecteddate;
    let pickedDate = inputDate;

    var today = pickedDate.getDate();
    var month = pickedDate.getMonth();
    var year = pickedDate.getFullYear();

    var rangeDate = get24hourRangeOnDay(today,month);
    var dayMoneySum = 0;

    const employeeTransactionsRecords = {
      "201" :[],
      "202" :[],
      "203" :[],
      "204" :[],
      "205" :[],
      "206" :[],
      "207" :[],
      "208" :[],
      "209" :[],
      "210" :[],
      "211" :[],
      "212" :[],
      "213" :[],
      "214" :[],
      "215" :[],
      "216" :[],
    };

    const employeeNames = {
      "201" : "Dong",
      "202" : "Quang",
      "203" : "Van",
      "204" : "Quynh Anh",
      "205" : "Ngan",
      "206" : "Mai",
      "207" : "Diem",
      "208" : "Hong",
      "209" : "Thu",
      "210" : "Lan",
      "211" : "Thuy",
      "212" : "Lich",
      "213" : "Nhung",
      "214" : "Chi",
      "215" : "Hang",
      "216" : "Nhung2",
    };

    db.collection("nailsfloraprod").where("timestamp",">=",rangeDate.start).where("timestamp","<=",rangeDate.end).get().then((querySnapshot) => {

          let tmpMoney = 0;

          querySnapshot.forEach((doc) => {
              var tmp = doc.data().timestamp.seconds;
              console.log(employeeNames[doc.data().employeeId] + doc.data().price + " " + new Date(doc.data().timestamp.seconds * 1000))
              dayMoneySum += doc.data().price

              //console.log(doc.data().price + " " + doc.data().employeeId)
              tmpMoney = tmpMoney + doc.data().price;
              tmpMoney = tmpMoney * 1;

              if (doc.data().employeeId in employeeTransactionsRecords) {
                employeeTransactionsRecords[doc.data().employeeId].push(doc.data().price)
              }
          });

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

          setDayMoneySum(tmpMoney)
          //setTableRows(tableRows)
          //setTableHead(tableHeadNames)
          //setTableSums(tableSums)
          setTable({tableRows:tableRows, tableHead: tableHeadNames,tableSums: tableSums});
    });
    return {}
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

    console.log("calling render")

    if (!table.tableHead) return ("ahoj"); 

    return (
     <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Container maxWidth="sm">

        <DatePicker value={selectedDate} onChange={handleDateChange} />

      </Container>

      <h1>
       {dayMoneySum}
      </h1>
      </MuiPickersUtilsProvider>

      <EmployeeTransactions name="" tableSums={table.tableSums} tableRows={table.tableRows} tableHead={table.tableHead}></EmployeeTransactions>

     </div>



        );

    }

export default Overview;

