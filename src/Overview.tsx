import React, {useState} from 'react';
import * as ReactDOM from "react-dom";
import firestore from "./Firestore";

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

import {DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';



interface OverviewProps {name: string; }

interface OverviewState {
  pilot: string;
  dayMoneySum: number;
  selectedDate: Date;
}


class Overview extends React.Component<OverviewProps, OverviewState> {


  constructor(props: OverviewProps) {


    super(props);
    this.state = {
      pilot: "Tomas",
      dayMoneySum: 0,
      selectedDate: new Date(),
    };

  }


   get24hourRangeOnDay(monthDay: number,month: number){

    var starDate = new Date();
    starDate.setMonth(month);
    starDate.setDate(monthDay);
    starDate.setHours(7);
    starDate.setMinutes(0);
    starDate.setSeconds(0);

    var endDate = new Date();
    endDate.setMonth(month);
    endDate.setDate(monthDay);
    endDate.setHours(24);
    endDate.setMinutes(0);
    endDate.setSeconds(0);

    return {"start":starDate,"end":endDate};
  }

  getData(){
    //let db = firestore.firestore();

    const db = firestore.firestore();

    let pickedDate = this.state.selectedDate;

    var today = pickedDate.getDate();
    var month = pickedDate.getMonth();
    var year = pickedDate.getFullYear();

    var rangeDate = this.get24hourRangeOnDay(today,month);
    console.log(rangeDate)
    var dayMoneySum = 0;

    db.collection("nailsfloraprod").where("timestamp",">=",rangeDate.start).where("timestamp","<=",rangeDate.end).get().then((querySnapshot) => {

          let tmpMoney = 0;

          querySnapshot.forEach((doc) => {
              var tmp = doc.data().timestamp.seconds;
              dayMoneySum += doc.data().price

              //console.log(doc.data().price + " " + doc.data().employeeId)
              tmpMoney = tmpMoney + doc.data().price;
              tmpMoney = tmpMoney * 1;
          });

          this.setState({dayMoneySum: tmpMoney});
    });
    return {}
  }

  handleDateChange = (date: any) =>{
    this.setState({ selectedDate: date }, function(this:any){
      this.getData();
    });
    //console.log("zmenil se cas" + this.state.selecteddate);
    console.log("zmenil se cas" + date);
  }

  componentDidMount(){
    this.getData();
    console.log("mounted");
  }

  render() {

    console.log("calling render")

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Container maxWidth="sm">

        <DatePicker value={this.state.selectedDate} onChange={this.handleDateChange} />

      </Container>

      <h1>
       {this.state.dayMoneySum}
      </h1>
      </MuiPickersUtilsProvider>



        );
      }
   }

export default Overview;

