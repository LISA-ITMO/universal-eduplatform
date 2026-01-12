import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";
import { useQuery, useLazyQuery } from "@apollo/client";
import {
  SUBJECTS_QUERY,
  THEMES_BY_SUBJECT_QUERY,
  ANALYTICS_BY_THEME_QUERY,
} from "@quiz-platform/ui/src/graphql/queries";
import { useAuth } from "@quiz-platform/ui";

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth() as any;
  const {
    data: subjectsData,
    loading: subjectsLoading,
    refetch: refetchSubjects,
  } = useQuery(SUBJECTS_QUERY as any);

  const [loadThemes, { data: themesData, loading: themesLoading }] =
    useLazyQuery(THEMES_BY_SUBJECT_QUERY as any);
  const [loadAnalytics, { data: analyticsData, loading: analyticsLoading }] =
    useLazyQuery(ANALYTICS_BY_THEME_QUERY as any);

  const subjects = subjectsData?.subjects || [];

  const handleOpenSubject = (subjectId: number) => {
    loadThemes({ variables: { subjectId } });
  };

  const handleOpenTheme = (subjectId: number, themeId: number) => {
    loadAnalytics({ variables: { subjectId, themeId } });
  };

  const exportXlsx = async (rows: any[], filename = "analytics.xlsx") => {
    try {
      const xlsx = await import("xlsx");
      const ws = xlsx.utils.json_to_sheet(
        rows.map((r) => ({
          ФИО: `${r.lastName || ""} ${r.firstName || ""}`.trim(),
          Логин: r.username,
          Аналитичность: r.analyticityTheme,
          Креативность: r.leadershipTheme,
        }))
      );
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Analytics");
      const buf = xlsx.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([buf], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert(
        "Для экспорта в XLSX установите пакет xlsx в frontend (например: pnpm add xlsx в корне frontend)"
      );
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Аналитика
      </Typography>
      {subjectsLoading ? (
        <Typography>Загрузка предметов...</Typography>
      ) : (
        subjects.map((s: any) => (
          <Accordion
            key={s.id}
            sx={{ mb: 1 }}
            onChange={() => handleOpenSubject(s.id)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ flex: 1 }}>{s.nameSubject}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Themes list (lazy-loaded) */}
              {themesLoading ? (
                <Typography>Загрузка тем...</Typography>
              ) : (
                (themesData?.themesBySubject || []).map((t: any) => (
                  <Accordion
                    key={t.id}
                    sx={{ mb: 1 }}
                    onChange={() => handleOpenTheme(s.id, t.id)}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ flex: 1 }}>{t.nameTheme}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {analyticsLoading ? (
                        <Typography>Загрузка аналитики...</Typography>
                      ) : (
                        <AnalyticsTable
                          rows={analyticsData?.analyticsByTheme || []}
                          onExport={() =>
                            exportXlsx(
                              analyticsData?.analyticsByTheme || [],
                              `${s.nameSubject}-${t.nameTheme}.xlsx`
                            )
                          }
                        />
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))
              )}
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

const AnalyticsTable: React.FC<{ rows: any[]; onExport: () => void }> = ({
  rows,
  onExport,
}) => {
  return (
    <Box>
      <Stack direction="row" justifyContent="flex-end" mb={1}>
        <Button startIcon={<DownloadIcon />} onClick={onExport}>
          Экспорт в XLSX
        </Button>
      </Stack>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ФИО</TableCell>
            <TableCell>Логин</TableCell>
            <TableCell>Аналитичность</TableCell>
            <TableCell>Креативность</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.studentId}>
              <TableCell>
                {`${r.lastName || ""} ${r.firstName || ""}`.trim()}
              </TableCell>
              <TableCell>{r.username}</TableCell>
              <TableCell>{r.analyticityTheme}</TableCell>
              <TableCell>{r.leadershipTheme}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default AnalyticsPage;
