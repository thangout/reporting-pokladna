import React from 'react';
import * as ReactDOM from "react-dom";
import firestore from "./Firestore";


interface OverviewProps {name: string; }
interface OverviewState {
  pilot: string;
  dayMoneySum: number;
}


class Overview extends React.Component<OverviewProps, OverviewState> {

  constructor(props: OverviewProps) {
    super(props);
    this.state = {
      pilot: "Tomas",
      dayMoneySum: 0,

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

    var today = new Date().getDate();
    var month = new Date().getMonth();
    var year = new Date().getFullYear();

    var rangeDate = this.get24hourRangeOnDay(today,month);
    console.log(rangeDate)
    var dayMoneySum = 0;

    console.log("calling")
    db.collection("nailsfloraprod").where("timestamp",">=",rangeDate.start).where("timestamp","<=",rangeDate.end).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              var tmp = doc.data().timestamp.seconds;
              dayMoneySum += doc.data().price

              console.log(doc.data().price + " " + doc.data().employeeId)
              let tmpMoney = this.state.dayMoneySum;
              tmpMoney = tmpMoney + doc.data().price;
              tmpMoney = tmpMoney * 1;
              this.setState({dayMoneySum: tmpMoney});
          });
          console.log("calling dbs")
    });
    return {}
  }

  componentDidMount(){
    console.log("mounted");
    this.getData();
  }

  render() {
    return (
      <div>
      <h1>KUKU</h1>
      {this.props.name}
      {this.state.pilot}
      <br/>
      {this.state.dayMoneySum}
      </div>

        );
      }
   }

export default Overview;

