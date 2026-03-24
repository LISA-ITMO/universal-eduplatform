import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { useQuery } from "@apollo/client";
import ResultTest from "../components/ResultTest";
import SelectCourse from "../components/SelectCourse";
import TestComponent from "../components/SolutionTest";
import { SUBJECT_QUERY, THEMES_BY_SUBJECT_QUERY } from "@quiz-platform/ui";

const Solution = () => {
  const [subjectId, setSubjectId] = useState<string>("");
  const [themeId, setThemeId] = useState<string>("");
  const [subjectName, setSubjectName] = useState("");
  const [themeName, setThemeName] = useState("");
  const location = useLocation();
  const { pathname, state } = location as any;
  const resultState = state?.result;
  const [testId, setTestId] = useState<number | null>(null);

  const { data: subjectData } = useQuery(SUBJECT_QUERY, {
    variables: { id: parseInt(subjectId || "0") },
    skip: !subjectId,
  });

  const { data: themeData } = useQuery(THEMES_BY_SUBJECT_QUERY, {
    variables: { subjectId: parseInt(subjectId || "0") },
    skip: !subjectId,
  });

  useEffect(() => {
    if (subjectData?.subject) {
      setSubjectName(subjectData.subject.nameSubject);
    }
  }, [subjectData]);

  useEffect(() => {
    if (themeData?.themesBySubject && themeId) {
      const theme = themeData.themesBySubject.find(
        (t: any) => t.id === parseInt(themeId),
      );
      if (theme) {
        setThemeName(theme.nameTheme);
      }
    }
  }, [themeData, themeId]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ alignContent: "center", mx: "auto" }}>
        {!pathname.includes("result") ? (
          <>
            {!testId ? (
              <SelectCourse
                path="solution"
                isSolution={true}
                goToText="Перейти к решению теста"
                onSelect={(s, t, tst) => {
                  setSubjectId(s);
                  setThemeId(t);
                  if (tst) setTestId(Number(tst));
                }}
              />
            ) : (
              <TestComponent
                subjectName={subjectName}
                themeName={themeName}
                testId={Number(testId)}
              />
            )}
          </>
        ) : (
          <ResultTest
            countCorrect={resultState?.pointsUser ?? 0}
            setTestId={setTestId}
          />
        )}
      </Box>
    </Box>
  );
};

export default Solution;
