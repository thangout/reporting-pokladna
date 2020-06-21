import React, {useState, useEffect} from 'react';
import {DatePicker} from '@material-ui/pickers';
import Container from '@material-ui/core/Container';
import EmployeeTransactions from "../Overview/EmployeTransactions";
import {EmployeeNames, EmployeeTransactionsRecords} from "../Enums/Employees"
import firestore from "../../Firestore";


const Pay = () => {

  const db = firestore.firestore();
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [table, setTable] = useState({});  
  const employeeNames = EmployeeNames;
  const employeeTransactionsRecords = EmployeeTransactionsRecords;
 
  const dayEmployeeSums = []; 

  useEffect(() => {
    // Update the document title using the browser API
    //setSelectedDate(new Date())
    if(Object.keys(table).length == 0){
      getMonthSalary(selectedDate);
    }
  });


    const getMonthSalary = (date) =>{
        //generate dates
        let pickedDate = date;
        let month = pickedDate.getMonth();
        let year = pickedDate.getFullYear();
        const dayInMonths = getDaysInMonthUTC(month,year);

        const lastDate = dayInMonths[dayInMonths.length-1];

        for(let currentDate of dayInMonths){
            getData(currentDate, lastDate);
        }
    }

    const getDaysInMonthUTC = (month, year) =>{
        var date = new Date(Date.UTC(year, month, 1));
        //let date = new Date(year, month, 1);
        var days = [];
        while (date.getUTCMonth() === month) {
            days.push(new Date(date));
            date.setUTCDate(date.getUTCDate() + 1);
        }
        return days;
    }

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

  const getDividedByTenDays = (tableSums) =>{
    let newTableSums = [];

    let middleSums = [];

    
    for (let i = 0; i < tableSums.length; i++) {
        let row = tableSums[i];
        newTableSums.push(row)
        console.log(row);


        for (let j = 0; j < row.length; j++) {
            if(middleSums[j] === undefined){
                //initializing first rowt
                middleSums.push(0);
                middleSums[j] += row[j]
            }else{
                if(row[j] === undefined){
                    middleSums[j]+= 0; 
                }else{
                    middleSums[j] += row[j];
                }
            }
        } 

        if(i==9 || i==19 || i==tableSums.length-1){
            let halfEmployeeMidSum = [];
            for(let employeeMidSum of middleSums){
                halfEmployeeMidSum.push(employeeMidSum/2);
            }

            newTableSums.push(middleSums)
            newTableSums.push(halfEmployeeMidSum)

            middleSums = [];
        }
    }
    return newTableSums;
  }

  const getData = (inputDate, lastDate) => {
    //let db = firestore.firestore();

    //let pickeddate = selecteddate;
    let pickedDate = inputDate;

    var today = pickedDate.getDate();
    var month = pickedDate.getMonth();
    var year = pickedDate.getFullYear();

    var rangeDate = get24hourRangeOnDay(today,month);
    var dayMoneySum = 0;


    db.collection("nailsfloraprod").where("timestamp",">=",rangeDate.start).where("timestamp","<=",rangeDate.end).get().then((querySnapshot) => {


          querySnapshot.forEach((doc) => {
              var tmp = doc.data().timestamp.seconds;
              //console.log(employeeNames[doc.data().employeeId] + doc.data().price + " " + new Date(doc.data().timestamp.seconds * 1000))
              dayMoneySum += doc.data().price

              if (doc.data().employeeId in employeeTransactionsRecords) {
                employeeTransactionsRecords[doc.data().employeeId].push(doc.data().price)
              }
          });

          //find max length
          let maxRows = 0;


          //zde se pocitaji sumy
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

          //setDayMoneySum(tmpMoney)
          //setTableRows(tableRows)
          //setTableHead(tableHeadNames)
          //setTableSums(tableSums)
          //setTable({tableRows:tableRows, tableHead: tableHeadNames,tableSums: tableSums});
          dayEmployeeSums.push(tableSums)

          if(inputDate === lastDate){

            let tmpEmpployeeSums = getDividedByTenDays(dayEmployeeSums)
            //add numbers to rows
            /*
            let rowNum = 1;
            for (let i=0; i < tmpEmpployeeSums.length; i++){
                tmpEmpployeeSums[i].unshift(rowNum);
                rowNum++;
            }
            tableHeadNames.unshift("Day")
            */
            setTable({tableRows: tmpEmpployeeSums, tableHead: tableHeadNames,tableSums: tableSums});
          }

    });
    return {}
  }


  const handleDateChange = (date) => {
    //getData(date);
    setSelectedDate(date);
  }


   if (!table.tableHead) return ("loading"); 

   return (
       <>
       <h1>Mzdy</h1>
      <Container maxWidth="sm">

        <DatePicker value={selectedDate} onChange={handleDateChange} />

      </Container>

      <EmployeeTransactions name="" tableSums={table.tableSums} tableRows={table.tableRows} tableHead={table.tableHead}></EmployeeTransactions>
       </>
   ) 
}

export default Pay;