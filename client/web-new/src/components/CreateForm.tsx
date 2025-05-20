import { Button, TextField, Box } from "@mui/material";
import { FormEvent, useState } from "react";

export const CreateForm = ({
  setState,
  state,
  refreshFunc,
  asyncFunc,
  payload,
}) => {
  const [value, setValue] = useState("");

  const toggleForm = () => {
    setState(!state);
    refreshFunc();
    setValue("");
  };

  const createItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value) return;

    const data = payload
      ? { subjectId: payload, theme: value }
      : { subject: value };

    try {
      await asyncFunc(data);
      toggleForm();
    } catch {
      console.error("Ошибка при создании");
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Button variant="outlined" size="small" onClick={toggleForm}>
        {state ? "-" : "+"} Добавить
      </Button>

      {state && (
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            fullWidth
            size="small"
            label="Введите название"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            type="submit"
            onClick={(e) => createItem(e)}
            variant="contained"
            size="small"
            sx={{ mt: 1 }}
          >
            Создать
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CreateForm;
