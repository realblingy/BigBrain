import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import { Bar } from 'react-chartjs-2';
import { getSessionResults } from '../api';
import TokenContext from '../TokenContext';

const useStyles = makeStyles({
  barChart: {
    height: 500,
    width: 1000,
  },
});

function Results() {
  const classes = useStyles();
  const { id } = useParams();
  const { token } = useContext(TokenContext);
  const [results, setResults] = React.useState([]);
  const [barChartData, setBarChartData] = React.useState(null);
  const [topFive, setTopFive] = React.useState([]);
  const [responseChartData, setResponseChartData] = React.useState(null);

  React.useEffect(() => {
    getSessionResults(token, id).then((r) => setResults(r.results));
  }, []); //eslint-disable-line

  const getCorrectAnsPercentages = (r) => {
    const correctAnsPercentages = [];
    r.forEach((individual) => {
      // [no. correct, no. incorrect ]
      individual.answers.forEach((answer, indx) => {
        if (correctAnsPercentages[indx] === undefined) {
          correctAnsPercentages.push([0, 0]);
        }
        const ans = correctAnsPercentages[indx];
        if (answer.correct === true) {
          ans[0] += 1;
        } else {
          ans[1] += 1;
        }
      });
    });
    const percentages = correctAnsPercentages
      .map((question) => Math.round((question[0] / (question[0] + question[1])) * 100));

    const data = {
      labels: percentages.map((_, indx) => `Question ${indx + 1}`),
      datasets: [
        {
          label: 'Percentage of correct answers',
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: percentages,
        },
      ],
    };
    return data;
  };

  const getTopFive = (r) => { //eslint-disable-line
    // get the scores for each individual
    const scores = [];
    r.forEach((individual) => {
      let sum = 0;
      let score = {
        name: individual.name,
      };
      individual.answers.forEach((answer) => {
        if (answer.correct === true) {
          sum += 1;
        }
      });
      score = {
        ...score,
        score: sum,
      };
      scores.push(score);
    });
    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, 5);
  };

  const getResponseTimesChart = (r) => {
    const responseTimes = [];
    r.forEach((individual) => {
      individual.answers.forEach((answer, indx) => {
        if (answer.questionStartedAt === null || answer.answeredAt === null) {
          return;
        }
        if (responseTimes[indx] === undefined) {
          responseTimes.push([0, 0]);
        }
        const startTime = new Date(answer.questionStartedAt);
        const answeredTime = new Date(answer.answeredAt);
        responseTimes[indx][0] += Math.round((answeredTime.getTime() - startTime.getTime()) / 1000);
        responseTimes[indx][1] += 1;
      });
    });
    const response = responseTimes.map((question) => Math.round(question[0] / question[1]));

    const data = {
      labels: response.map((_, indx) => `Question ${indx + 1}`),
      datasets: [
        {
          label: 'Average Response Times For Each Question',
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: response,
        },
      ],
    };
    return data;
  };

  const options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          min: 0,
        },
      }],
    },
    maintainAspectRatio: false,
  };

  React.useEffect(() => {
    if (results.length > 0) {
      setTopFive(getTopFive(results));
      setBarChartData(getCorrectAnsPercentages(results));
      setResponseChartData(getResponseTimesChart(results));
    }
  }, [results]);

  return (
    <div>
      <Typography variant="h1">RESULTS</Typography>
      <Typography variant="h2">TOP 5 USERS</Typography>
      {topFive !== [] && topFive.map((person) => <div>{`${person.name} got a score of ${person.score}`}</div>)}
      <Typography variant="h2">BAR CHART OF CORRECT ANSWER PERCENTAGES</Typography>
      <div className={classes.barChart}>
        {barChartData
        && (
        <Bar
          data={barChartData}
          options={options}
        />
        )}
      </div>
      <Typography variant="h2">AVERAGE RESPONSE TIME PER QUESTION</Typography>
      <div className={classes.barChart}>
        {responseChartData
        && (
        <Bar
          data={responseChartData}
          options={options}
        />
        )}
      </div>
    </div>
  );
}

export default Results;
