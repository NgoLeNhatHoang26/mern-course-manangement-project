import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LessonList from "./LessonList";

export default function LessonModule({ Module }) {
  const lessons = Module?.lessons ?? [];

  return (
    <Accordion disableGutters elevation={0} sx={{ borderBottom: "1px solid #eee" }}>
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        aria-controls="panel-content"
        id={`module-${Module?.id}-header`}
      >
        <Typography component="span" variant="subtitle1" sx={{ fontWeight: 600 }}>
          {Module?.name || "Module Title"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <LessonList lessons={lessons} />
      </AccordionDetails>
    </Accordion>
  );
}
