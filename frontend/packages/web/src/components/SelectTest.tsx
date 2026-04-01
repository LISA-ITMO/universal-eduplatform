import { useState, useMemo, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Divider,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useQuery } from "@apollo/client";
import {
  SUBJECTS_QUERY,
  THEMES_BY_SUBJECT_QUERY,
  TESTS_LIST_QUERY,
} from "@quiz-platform/ui";
import { MY_RESULTS_QUERY } from "@quiz-platform/ui";
import TestCardList from "./TestCardList";
import { useAuth } from "@quiz-platform/ui";

interface SelectCourseProps {
  onSelect: (
    subjectId: string,
    themeId: string,
    testId: string,
    testName: string,
  ) => void;
}

const SelectTest = ({ onSelect }: SelectCourseProps) => {
  const [subject, setSubject] = useState("");
  const [theme, setTheme] = useState("");

  const { user } = useAuth();

  const { data: subjectsData } = useQuery(SUBJECTS_QUERY);
  const { data: themesData } = useQuery(THEMES_BY_SUBJECT_QUERY, {
    variables: { subjectId: parseInt(subject) },
    skip: !subject,
  });
  const {
    data: testsData,
    refetch: refetchTests,
    loading: testsLoading,
  } = useQuery(TESTS_LIST_QUERY, {
    variables: {
      subjectId: parseInt(subject || "0"),
      themeId: parseInt(theme || "0"),
    },
    skip: !subject || !theme,
    fetchPolicy: "network-only",
  });

  const subjects = subjectsData?.subjects || [];
  const themes = themesData?.themesBySubject || [];
  const tests = testsData?.testsBySubjectAndTheme || [];
  const { data: myResultsData } = useQuery(MY_RESULTS_QUERY as any);
  const myResults = myResultsData?.myResults || [];

  const [hidePassed, setHidePassed] = useState(false);

  const passedMap = useMemo(() => {
    const m: Record<number, any> = {};
    (myResults || []).forEach((r: any) => {
      if (r.testId) m[r.testId] = r;
    });
    return m;
  }, [myResults]);

  const handleCardClick = (testId: number, testName: string) => {
    if (passedMap[testId]) return;
    onSelect(subject, theme, String(testId), testName);
  };

  const sortedFilteredTests = useMemo(() => {
    if (!subject || !theme) return [];

    let list = (tests || []).filter((t: any) => t.authorId !== user?.id);
    if (hidePassed) list = list.filter((t: any) => !passedMap[t.id]);

    list.sort((a: any, b: any) => {
      const aPassed = !!passedMap[a.id];
      const bPassed = !!passedMap[b.id];
      if (aPassed && !bPassed) return -1;
      if (!aPassed && bPassed) return 1;
      return a.id - b.id;
    });

    return list;
  }, [tests, subject, theme, hidePassed, passedMap, user]);

  useEffect(() => {
    if (subject && theme) {
      try {
        if (typeof refetchTests === "function") refetchTests();
      } catch (e) {
        // ignore
      }
    }
  }, [subject, theme]);

  return (
    <Box sx={{ width: "100%", px: 3, mt: 5 }}>
      <Box sx={{ pt: 3, fontSize: 24, fontWeight: 600 }}>
        Выбор предмета и темы
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mt: 5,
        }}
      >
        <FormControl sx={{ width: 240 }}>
          <InputLabel sx={{ top: -7 }}>Предмет</InputLabel>
          <Select
            size="small"
            value={subject}
            onChange={(e: SelectChangeEvent) => {
              setSubject(e.target.value);
              setTheme("");
            }}
            label="Предмет"
          >
            {subjects.map((item: any) => (
              <MenuItem key={item.id} value={item.id.toString()}>
                {item.nameSubject}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: 240 }}>
          <InputLabel sx={{ top: -7 }}>Тема</InputLabel>
          <Select
            size="small"
            value={theme}
            onChange={(e: SelectChangeEvent) => setTheme(e.target.value)}
            label="Тема"
            disabled={!subject}
          >
            {themes.map((item: any) => (
              <MenuItem key={item.id} value={item.id.toString()}>
                {item.nameTheme}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mt: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={hidePassed}
              onChange={(e) => setHidePassed(e.target.checked)}
            />
          }
          label="Скрыть пройденные тесты"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {!subject || !theme ? (
        <Typography sx={{ textAlign: "center", mt: 2 }}>
          Выберите предмет и тему
        </Typography>
      ) : sortedFilteredTests.length === 0 ? (
        <Typography sx={{ textAlign: "center", mt: 2 }}>
          Тесты отсутствуют
        </Typography>
      ) : (
        <TestCardList
          tests={sortedFilteredTests}
          passedMap={passedMap}
          onCardClick={handleCardClick}
          loading={testsLoading}
        />
      )}
    </Box>
  );
};

export default SelectTest;
