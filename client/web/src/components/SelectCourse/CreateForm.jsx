import { API_SUBJECTS } from "@app/utils/api/apiSubjects";
import { useEffect, useState } from "react";

const CreateForm = ({ setState, state, refreshFunc, asyncFunc, payload}) => {
   
  const [value, setValue] = useState("");

 

  const inputStyle = {
    width: "100%",
    border: "1px solid grey",
  };
  const newThemeStyle = {
    border: "1px solid grey",
    borderRadius: '25px',
    cursor: 'pointer',
    width: 'fit-content',
    padding: '0 10px',
    marginBottom: '10px'
  };
  const updComp = () => {
    setState(!state);
    refreshFunc();
    setValue("")
  };

  const addTheme = () => {
    setState(!state);
  };

  const createThemeSubmit = (e) => {
    
    e.preventDefault();
    if (value !== "") {

        const data = 
        payload 
        ? {
            subjectId: payload, theme: value
        }
        : {
            subject: value
        }

      asyncFunc(data)
        .then(() => {
          updComp();
        });
    }
  };

  return (
    <>
      <div style={newThemeStyle} onClick={addTheme}>
        {state ? "-" : "+"}добавить
      </div>
      
      {state && (
        <form onSubmit={createThemeSubmit}>
          <input
            value={value}
            type="text"
            placeholder="Введите тему"
            style={inputStyle}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <button type="submit" onClick={createThemeSubmit}>
            Создать тему
          </button>
        </form>
      )}
    </>
  );
};

export default CreateForm;
