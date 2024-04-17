import React, { useEffect, useState } from "react";
import data from "../sample-data.json";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import annotationPlugin from "chartjs-plugin-annotation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  TimeScale,
  annotationPlugin,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: "x",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: "false",
    },
    title: {
      display: true,
      text: "Chart.js Horizontal Bar Chart",
    },
  },
};

// const chartData = {
//   labels: timestamps,
//   datasets: [
//     {
//       data: new Array(timestamps.length).fill(1), // Set all bars to the same height
//       backgroundColor: colors,
//     },
//   ],
// };

const TimeBar = () => {
  // Extract timestamps, machine status, and colors from the data
  const timestamps = data.map((entry) => entry.machine_status);
  const [timeData, setTimeData] = useState([]);
  const colors = data.map((entry) => {
    if (entry.machine_status === 0)
      return "yellow"; // yellow for machine status 0
    else if (entry.machine_status === 1)
      return "green"; // green for machine status 1
    else return "red"; // red for missing timestamps
  });
  // Define the chart data
  const chartData = {
    //labels: timestamps,
    datasets: [
      {
        data: timeData, // Set all bars to the same height
        backgroundColor: colors,
      },
    ],
  };

  // Define options for the chart
  const chartOptions = {
    indexAxis: "x", // Set the index axis to 'x' for horizontal bar chart
    elements: {
      bar: {
        borderWidth: 0,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      title: {
        display: true,
        text: "Horizontal Bar Chart", // Adjust chart title as needed
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
        },
        title: {
          display: true,
          text: "Time",
        },
        min: timeData[0],
      },
      y: {
        min: 0,
        max: 1,
        ticks: {
          stepSize: 1,
        },
      },
    },
    onBeforeInit: function (chart) {
      const {
        ctx,
        chartArea: { left, top, width, height },
      } = chart;
      ctx.fillStyle = "rgba(251, 85, 85)";
      ctx.fillRect(left, top, width, height);
    },
  };

  useEffect(() => {
    let temp = [];
    Array.isArray(data) &&
      data.length > 0 &&
      data.map((each) => {
        temp.push({ x: Date.parse(each.ts), y: 1 });
      });
    console.log(temp);
    setTimeData(temp);
    console.log(data);
  }, []);

  return <Bar options={chartOptions} data={chartData} />;
};

export default TimeBar;
