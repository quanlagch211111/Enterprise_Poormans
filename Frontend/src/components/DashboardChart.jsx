import React from "react";
import ApexCharts from "react-apexcharts";

const DashboardCharts = ({
  newStudentData,
  newTutorData,
  unassignedStudentData,
  unassignedTutorData,
  totalMessagesData,
}) => {
  // Chart data for New Students and New Tutors in the last 7 days
  const newStudentsAndTutorsChart = {
    series: [
      {
        name: "New Students",
        data: newStudentData, // Data for new students in the last 7 days
      },
      {
        name: "New Tutors",
        data: newTutorData, // Data for new tutors in the last 7 days
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      xaxis: {
        categories: [
          "Day 1",
          "Day 2",
          "Day 3",
          "Day 4",
          "Day 5",
          "Day 6",
          "Day 7",
        ],
      },
      title: {
        text: "New Students and Tutors in the Last 7 Days",
      },
    },
  };

  // Chart data for Unassigned Students and Tutors in the last 7 days
  const unassignedStudentsAndTutorsChart = {
    series: [
      {
        name: "Unassigned Students",
        data: unassignedStudentData, // Data for unassigned students in the last 7 days
      },
      {
        name: "Unassigned Tutors",
        data: unassignedTutorData, // Data for unassigned tutors in the last 7 days
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 350,
      },
      xaxis: {
        categories: [
          "Day 1",
          "Day 2",
          "Day 3",
          "Day 4",
          "Day 5",
          "Day 6",
          "Day 7",
        ],
      },
      title: {
        text: "Unassigned Students and Tutors in the Last 7 Days",
      },
    },
  };

  // Chart data for Total Messages in the last 7 days
  const totalMessagesChart = {
    series: [
      {
        name: "Total Messages",
        data: totalMessagesData, // Data for total messages in the last 7 days
      },
    ],
    options: {
      chart: {
        type: "area",
        height: 350,
      },
      xaxis: {
        categories: [
          "Day 1",
          "Day 2",
          "Day 3",
          "Day 4",
          "Day 5",
          "Day 6",
          "Day 7",
        ],
      },
      title: {
        text: "Total Messages in the Last 7 Days",
      },
    },
  };

  return (
    <div className="dashboard-charts">
      {/* New Students and Tutors Chart */}
      <div className="chart">
        <ApexCharts
          options={newStudentsAndTutorsChart.options}
          series={newStudentsAndTutorsChart.series}
          type="bar"
          height={350}
        />
      </div>

      {/* Unassigned Students and Tutors Chart */}
      <div className="chart">
        <ApexCharts
          options={unassignedStudentsAndTutorsChart.options}
          series={unassignedStudentsAndTutorsChart.series}
          type="line"
          height={350}
        />
      </div>

      {/* Total Messages Chart */}
      <div className="chart">
        <ApexCharts
          options={totalMessagesChart.options}
          series={totalMessagesChart.series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default DashboardCharts;
