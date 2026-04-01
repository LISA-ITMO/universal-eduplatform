import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useQuery } from "@apollo/client";
import SelectCourse from "../components/SelectCourse";
import { TestCreationPage } from "../components/CreateTest";
import { SUBJECT_QUERY, THEMES_BY_SUBJECT_QUERY } from "@quiz-platform/ui";

const Creation = () => {
  const [subjectName, setSubjectName] = useState("");
  const [themeName, setThemeName] = useState("");
  const [subjectId, setSubjectId] = useState<string>("");
  const [themeId, setThemeId] = useState<string>("");

  const { data: subjectData } = useQuery(SUBJECT_QUERY, {
    variables: { id: parseInt(subjectId || "0") },
    skip: !subjectId,
  });

  const { data: themeData } = useQuery(THEMES_BY_SUBJECT_QUERY, {
    variables: { subjectId: parseInt(subjectId || "0") },
    skip: !subjectId,
  });

  const onSelect = (subjectId: string, themeId: string) => {
    setSubjectId(subjectId);
    setThemeId(themeId);
  };

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
        {!subjectId || !themeId ? (
          <SelectCourse onSelect={onSelect} />
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
