import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grow,
} from "@mui/material";

interface TestCardListProps {
  tests: any[];
  passedMap: Record<number, any>;
  onCardClick: (testId: number, testName: string) => void;
  loading?: boolean;
}

const TestCardList: React.FC<TestCardListProps> = ({
  tests,
  passedMap,
  onCardClick,
  loading,
}) => {
  if (loading) {
    return (
      <Grid container justifyContent="center" sx={{ py: 4 }}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      {tests.map((t) => {
        const isPassed = !!passedMap[t.id];
        const author = t.author;
        const userResult = passedMap[t.id];

        return (
          <Grid item xs={12} sm={6} md={4} key={t.id}>
            <Grow in style={{ transformOrigin: "0 0 0" }} timeout={300}>
              <Card
                onClick={() => onCardClick(t.id, t.name)}
                sx={{
                  cursor: isPassed ? "default" : "pointer",
                  backgroundColor: isPassed ? "#e6f4ea" : "white",
                  border: "1px solid transparent",
                  transition:
                    "border 150ms ease, box-shadow 150ms ease, transform 150ms ease",
                  "&:hover": {
                    border: isPassed
                      ? "1px solid #388e3c"
                      : "2px solid #1976d2",
                    boxShadow: isPassed
                      ? "none"
                      : "0 4px 12px rgba(25,118,210,0.12)",
                    transform: isPassed ? "none" : "translateY(-2px)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6">
                    {t.name || `Тест ${t.id}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {t.id}
                  </Typography>
                  <Typography variant="body2">
                    Автор:{" "}
                    {(() => {
                      if (!author) return t.authorId;
                      const hasName = author.lastName || author.firstName;
                      return hasName
                        ? `${author.lastName || ""} ${author.firstName || ""}`.trim()
                        : author.username;
                    })()}
                  </Typography>
                  <Typography variant="body2">
                    Вопросов: {t.questionsCount ?? "-"}
                  </Typography>
                  <Typography variant="body2">
                    Макс. балл: {t.maxPoints}
                  </Typography>
                  {isPassed && (
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                      Ваш балл:{" "}
                      {userResult?.pointsUser ?? userResult?.score ?? "-"}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default TestCardList;
