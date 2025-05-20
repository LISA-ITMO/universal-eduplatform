import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SelectCourse from "../components/SelectCourse";
import { API_SUBJECTS } from "../utils/api/apiSubjects";
import { TestCreationPage } from "../components/CreateTest";
import { Box } from "@mui/material";

const Creation = () => {
  const [subjectName, setSubjectName] = useState("");
  const [themeName, setThemeName] = useState("");
  const { subjectId, themeId } = useParams();

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
        {!subjectId || !themeId ? (
          <SelectCourse
            path={"creation"}
            goToText={"Перейти к созданию теста"}
          />
        ) : (
          <TestCreationPage
            subjectName={subjectName}
            themeName={themeName}
            subjectId={subjectId}
            themeId={themeId}
          />
        )}
      </Box>
    </Box>
  );
};

export default Creation;
