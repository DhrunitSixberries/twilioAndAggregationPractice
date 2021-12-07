import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

function App() {
  const [persons, setPersons] = useState([]);
  const [dataFetchingOptions, setDataFetchingOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  useEffect(() => {
    getData();
  }, [page]);

  const getData = async (filter = false, options) => {
    setLoading(true);
    let url;
    if (filter) {
      url = `http://localhost:8000/users?page=${page}&filters=${options}`;
    } else {
      url = `http://localhost:8000/users?page=${page}`;
    }
    let result = await axios.get(url);
    setPersons(result.data);
    setLoading(false);
  };

  const setOptions = (evt) => {
    if (!dataFetchingOptions.includes(evt.target.name)) {
      setDataFetchingOptions((oldArray) => [...oldArray, evt.target.name]);
    } else if (dataFetchingOptions.includes(evt.target.name)) {
      let array = [...dataFetchingOptions];
      let newArray = removeItemOnce(array, evt.target.name);
      setDataFetchingOptions(newArray);
    }
  };
  const removeItemOnce = (arr, value) => {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  };
  return (
    <>
      <div style={{ width: "95vw", height: "100vh" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {loading ? (
            <div>Loading</div>
          ) : (
            persons.map((person) => (
              <div className="card" key={Math.random()}>
                <div>{person.fullName}</div>
                <img
                  style={{ width: "100px" }}
                  src={person.pictureUrl}
                  alt="test"
                />
                <div>
                  {person.gender && <div>{person.gender}</div>}
                  {person.phone && <div>{person.phone}</div>}
                  {person.dob && <div>{person.dob.age}</div>}
                  {person.dob && (
                    <div>{new Date(person.dob.date).toLocaleString()}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <>
          <h3>Which fields you want to display ?</h3>
          <input
            type="checkbox"
            name="gender"
            value="gender"
            checked={dataFetchingOptions.includes("gender")}
            onChange={(evt) => setOptions(evt)}
          />
          <label htmlFor="gender">gender</label>
          <input
            type="checkbox"
            name="dob"
            value="dob"
            checked={dataFetchingOptions.includes("dob")}
            onChange={(evt) => setOptions(evt)}
          />
          <label htmlFor="dob">dob</label>
          <input
            type="checkbox"
            name="phone"
            value="phone"
            checked={dataFetchingOptions.includes("phone")}
            onChange={(evt) => setOptions(evt)}
          />
          <label htmlFor="phone">phone</label>
          <button
            onClick={() => getData(true, dataFetchingOptions)}
            style={{ margin: "1rem" }}
          >
            Fetch Users
          </button>
        </>
        <br></br>
        <div style={{ textAlign: "center", margin: "1rem" }}>
          <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
    </>
  );
}

export default App;
