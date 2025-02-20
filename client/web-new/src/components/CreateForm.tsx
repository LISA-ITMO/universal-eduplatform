import { Button } from "@chakra-ui/react";
import { FormEvent, useState } from "react";

export const CreateForm = ({
  setState,
  state,
  refreshFunc,
  asyncFunc,
  payload,
}) => {
  const [value, setValue] = useState("");

  const inputStyle = {
    width: "100%",
    border: "1px solid grey",
  };
  const updComp = () => {
    setState(!state);
    refreshFunc();
    setValue("");
  };

  const addTheme = () => {
    setState(!state);
  };

  const createThemeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value !== "") {
      const data = payload
        ? {
            subjectId: payload,
            theme: value,
          }
        : {
            subject: value,
          };

      asyncFunc(data).then(() => {
        updComp();
      });
    }
  };

  return (
    <>
      <Button colorScheme="gray" size="xs" onClick={addTheme}>
        {state ? "-" : "+"}добавить
      </Button>

      {state && (
        <form>
          <input
            value={value}
            type="text"
            placeholder="Введите название"
            style={inputStyle}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <Button
            colorScheme="teal"
            size="xs"
            onClick={(e) => createThemeSubmit(e)}
            type="submit"
          >
            Создать
          </Button>
        </form>
      )}
    </>
  );
};

export default CreateForm;
