import { Button, TextField, Box } from '@mui/material';
import { useState, MouseEvent } from 'react';

interface CreateFormProps {
  setState: (value: boolean) => void;
  state: boolean;
  refreshFunc: () => void;
  asyncFunc: (name: string) => Promise<void>;
}

const CreateForm = ({ setState, state, refreshFunc, asyncFunc }: CreateFormProps) => {
  const [value, setValue] = useState('');

  const toggleForm = () => {
    setState(!state);
    refreshFunc();
    setValue('');
  };

  const createItem = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!value) return;

    try {
      await asyncFunc(value);
      toggleForm();
    } catch (error) {
      console.error('Ошибка при создании', error);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Button variant="outlined" size="small" onClick={toggleForm}>
        {state ? '-' : '+'} Добавить
      </Button>

      {state && (
        <Box sx={{ mt: 1 }}>
          <TextField
            fullWidth
            size="small"
            label="Введите название"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button onClick={(e) => createItem(e)} variant="contained" size="small" sx={{ mt: 1 }}>
            Создать
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CreateForm;




