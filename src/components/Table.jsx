import React from "react";
import numeral from "numeral";
import "../styles/table.css";
function Table({ countries }) {
  return (
    <div className="tableContainer">
      <table className="table">
        <tbody>
          {countries.map(({ country, cases }) => (
            <tr key={Math.floor(Math.random() * 100) + country}>
              <td>{country}</td>
              <td>
                <strong>{numeral(cases).format("0,0")}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
