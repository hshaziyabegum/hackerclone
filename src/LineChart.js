import React from 'react';
import {Line} from 'react-chartjs-2';

export default class LineChart extends React.Component {
  render() {
    var lab =[],
    datavote = []
    this.props.chartData && this.props.chartData.map( voteid => 
       { lab.push(voteid.objectID)
        datavote.push(voteid.vote)
       }
    
    )
    const state = {
      labels: lab,
      datasets: [
        {
          label: 'Votes',
          fill: false,
          lineTension: 0.5,
          backgroundColor: 'dodgerblue',
          borderColor: 'dodgerblue',
          borderWidth: 2,
          data: datavote
        }
      ]
    }
    return (
      <div>
        <Line
          data={state}
          options={{
             legend:{
              display:false,
            
            }
          }}
        />
      </div>
    );
  }
}