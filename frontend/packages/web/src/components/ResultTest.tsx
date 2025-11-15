import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ResultTestProps {
  countCorrect: number;
}

const ResultTest = ({ countCorrect }: ResultTestProps) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', textAlign: 'center', mt: 10 }}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        {countCorrect > 0 ? 'Поздравляем!' : 'В следующий раз повезет!'} Верно решено{' '}
        {countCorrect}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <Button
          variant="contained"
          onClick={() => navigate('/solution')}
          sx={{ width: 300 }}
        >
          Перейти к выбору теста
        </Button>
      </Box>
    </Box>
  );
};

export default ResultTest;




