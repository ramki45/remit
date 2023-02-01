import SelectEmployee from "./SelectEmployee";

const Table = ({ employees, shifts, onEmployeeChange, type }) => {
  return (
    <>
      {shifts &&
        Object.keys(shifts).map((parentKey, i) => {
          return (
            <tr>
              <td>{parentKey}</td>
              {Object.keys(shifts[parentKey]).map((childKey, j) => {
                return (
                  <td>
                    <SelectEmployee
                      employees={employees}
                      currentValue={shifts[parentKey][childKey]}
                      shift={parentKey}
                      weekDay={childKey}
                      onEmployeeChange={onEmployeeChange}
                      type={type}
                    />
                  </td>
                );
              })}

            </tr>

          );
        })}

      <br />
    </>
  );
};

export default Table;