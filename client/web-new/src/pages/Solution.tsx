import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ResultTest from "../components/ResultTest";
import SelectCourse from "../components/SelectCourse";
import { API_SUBJECTS } from "../utils/api/apiSubjects";
import { Box } from "@mui/material";
import TestComponent from "../components/SolutionTest";

const Creation = () => {
  const [subjectName, setSubjectName] = useState("");
  const [themeName, setThemeName] = useState("");
  const [countCorrect, setCountCorrect] = useState(0);
  const location = useLocation();
  const { pathname } = location;
  const { subjectId, themeId, testId } = useParams();

  useEffect(() => {
    if (subjectId !== undefined && themeId !== undefined) {
      API_SUBJECTS.subjects
        .get({ id: subjectId })
        .then((res) => {
          setSubjectName(res.data[0].name_subject);
        })
        .catch(() => {
          setSubjectName(subjectId);
        });

      API_SUBJECTS.themes
        .get({ id: themeId })
        .then((res) => {
          setThemeName(res.data[0].name_theme);
        })
        .catch(() => {
          setThemeName(themeId);
        });
    }
  }, [subjectId, themeId]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ alignContent: "center", mx: "auto" }}>
        {!pathname.includes("result") ? (
          <>
            {!subjectId || !themeId || !testId ? (
              <SelectCourse
                path={"solution"}
                isSolution={true}
                goToText={"Перейти к решению теста"}
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
          <ResultTest countCorrect={countCorrect} />
        )}
      </Box>
    </Box>
  );
};

export default Creation;
