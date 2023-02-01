import { useEffect, useState } from "react";
import Table from "./Remit";

const initialValues = {
  employees: Array.from(Array(7).keys()).map((i) => `X${i + 1}`),
  weekDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  morningShifts: [
    "Morning Up Stairs",
    "Morning Down Stairs",
    "Morning Parking Lot",
  ],
  afternoonShifts: [
    "Afternoon Up Stairs",
    "Afternoon Down Stairs",
    "Afternoon Parking Lot",
  ],
  lunches: ["Lunch A", "Lunch B", "Lunch C", "Lunch D"],
};

const Schedule = () => {
  const [monrningShiftSchedule, setMorningShiftSchedule] = useState();
  const [afternoonShiftSchedule, setAfternoonShiftSchedule] = useState();
  const [lunchSchedule, setLunchSchedule] = useState();
  const [employeeLoad, setEmployeeLoad] = useState();
  const [employees, setEmployees] = useState(initialValues.employees);
  const [weekDays, setWeekDays] = useState(initialValues.weekDays);
  const [errorMessage, setErrorMessage] = useState();

  const initializeSchedule = ({ entities, initializer, isLoad }) => {
    let schedule = {};
    entities.forEach((shift) => {
      if (!schedule[shift]) schedule[shift] = {};
      weekDays.forEach((day) => {
        schedule[shift][day] = isLoad ? 0 : "NA";
      });
      if (isLoad) schedule[shift]["Total"] = 0;
    });
    initializer(schedule);
  };

  const initializeTable = () => {

    initializeSchedule({
      entities: initialValues.morningShifts,
      initializer: setMorningShiftSchedule,
      isLoad: false,
    });
    initializeSchedule({
      entities: initialValues.afternoonShifts,
      initializer: setAfternoonShiftSchedule,
      isLoad: false,
    });
    initializeSchedule({
      entities: initialValues.lunches,
      initializer: setLunchSchedule,
      isLoad: false,
    });
    initializeSchedule({
      entities: employees,
      initializer: setEmployeeLoad,
      isLoad: true,
    });
    setErrorMessage();
  };

  useEffect(() => {
    initializeTable();
  }, []);

  useEffect(() => {
    console.log("monrningShiftSchedule ", monrningShiftSchedule);
    localStorage.setItem(
      "shiftSchedule",
      JSON.stringify(monrningShiftSchedule)
    );
  }, [monrningShiftSchedule]);


  const randomShits = () => {
    initialValues.morningShifts.forEach((shift) => {
      employees.forEach((employee) => {
        weekDays.forEach((day) => {
          if (monrningShiftSchedule[shift][day] === "NA") {
            onEmployeeChange({
              shift,
              weekDay: day,
              employee,
              type: "morningShifts",
            });
          }
        });
      });
    });
    initialValues.afternoonShifts.forEach((shift) => {
      employees.forEach((employee) => {
        weekDays.forEach((day) => {
          if (afternoonShiftSchedule[shift][day] === "NA") {
            onEmployeeChange({
              shift,
              weekDay: day,
              employee,
              type: "afternoonShifts",
            });
          }
        });
      });
    });
    let totalEmployees = 0;
    employees.forEach((employee) => {
      Object.keys(employeeLoad[employee]).forEach((weekDay) => {
        if (weekDay === "Total" && +employeeLoad[employee][weekDay])
          totalEmployees++;
      });
    });
    setErrorMessage(`Total ${totalEmployees} employees are needed.`);
  };

  const updateEmployeeTotal = () => {
    employees.forEach((employee) => {
      let totalLoad = 0;
      Object.keys(employeeLoad[employee]).forEach((weekDay) => {
        if (weekDay !== "Total") totalLoad += employeeLoad[employee][weekDay];
      });
      let currentEmployeeLoad = employeeLoad;
      currentEmployeeLoad[employee]["Total"] = totalLoad;
      setEmployeeLoad({ ...currentEmployeeLoad });
    });
  };

  const updateEmployeeLoad = ({ employee, weekDay, existingEmployee }) => {
    let currenctEmployeeLoad = employeeLoad;
    currenctEmployeeLoad[employee][weekDay] = currenctEmployeeLoad[employee][
      weekDay
    ]
      ? currenctEmployeeLoad[employee][weekDay] + 1
      : 1;

    if (
      existingEmployee !== "NA" &&
      +currenctEmployeeLoad[existingEmployee][weekDay]
    )
      currenctEmployeeLoad[existingEmployee][weekDay] = +currenctEmployeeLoad[
        existingEmployee
      ][weekDay]
        ? +currenctEmployeeLoad[existingEmployee][weekDay] - 1
        : 0;
    setEmployeeLoad({ ...currenctEmployeeLoad });
    updateEmployeeTotal();
  };

  const onEmployeeChange = ({ shift, weekDay, employee, type }) => {
    setErrorMessage();
    let currentSchedule,
      setScheduler,
      currentValues = [];
    switch (type) {
      case "morningShifts":
        currentSchedule = monrningShiftSchedule;
        setScheduler = setMorningShiftSchedule;
        break;
      case "afternoonShifts":
        currentSchedule = afternoonShiftSchedule;
        setScheduler = setAfternoonShiftSchedule;
        break;
      case "lunches":
        currentSchedule = lunchSchedule;
        setScheduler = setLunchSchedule;
        break;
      default:
        break;
    }

    // Total shifts in a week
    if (type !== "lunches") {
      const totalLoad = employeeLoad[employee]["Total"];
      if (totalLoad === 7) {
        setErrorMessage(
          `7 Shifts quota already scheduled in a week for ${employee}`
        );
        return;
      }
    }

    // Duplicate in the current Session
    Object.keys(currentSchedule).forEach((parentKey, i) => {
      currentValues.push(currentSchedule[parentKey][weekDay]);
    });
    const numberOfShifts = currentValues.reduce(
      (counter, currentNumber) =>
        employee === currentNumber ? counter + 1 : counter,
      0
    );
    // Duplicate in the current day
    if (numberOfShifts === 1) {
      setErrorMessage("Shift already present for a selected Session.");
      return;
    }

    const existingEmployee = currentSchedule[shift][weekDay];
    console.log("existingEmployee", existingEmployee);
    currentSchedule[shift][weekDay] = employee;
    setScheduler({ ...currentSchedule });
    updateEmployeeLoad({ employee, weekDay, existingEmployee });
  };

  return (
    <div>
      <div>

        <h3>Schedule</h3>

      </div>
      <table border="1" style={{ width: "100%" }}>
        <tbody>



          <tr>
            <th></th>
            {weekDays.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
          <tr></tr>
          {monrningShiftSchedule && (
            <Table
              onEmployeeChange={onEmployeeChange}
              employees={employees}
              shifts={monrningShiftSchedule}
              type="morningShifts"
            />
          )}

          {lunchSchedule && (
            <Table
              onEmployeeChange={onEmployeeChange}
              employees={employees}
              shifts={lunchSchedule}
              type="lunches"
            />
          )}


          {afternoonShiftSchedule && (
            <Table
              onEmployeeChange={onEmployeeChange}
              employees={employees}
              shifts={afternoonShiftSchedule}
              type="afternoonShifts"
            />

          )}


        </tbody>
      </table>
      <h2>Load </h2>
      <table border="1" style={{ width: "100%" }}>
        <tbody>
          <tr>
            <th></th>
            {weekDays.map((day) => (
              <th key={day}>{day}</th>
            ))}
            <th>Totals</th>
          </tr>
          {employeeLoad && <Table shifts={employeeLoad} />}
        </tbody>
      </table>

      <br />
      <span style={{ color: "red" }}>{errorMessage}</span>
      <br />
      <button type="button" className="btn btn-success mr-3" onClick={randomShits}>Randomize</button>

      <button type="button" className="btn btn-success"
        style={{ color: "green", backgroundColor: "#99ECD3" }}
        onClick={initializeTable}>
        Reset
      </button>

      <br />

    </div>
  );
};

export default Schedule;