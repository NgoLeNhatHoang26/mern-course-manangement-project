import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LessonList from './LessonList'
import { LessonService } from '../../service/lessonService.js';
import { useEffect, useState } from 'react';
export default function LessonModule({Module}) {
    const [lessons, setLesson] = useState([]);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const data = await LessonService.getLessonByModule(Module.id);
                setLesson(data);
            } catch (error) {
                console.error("Error fetching lessons:", error);
            }
        }
        fetchLesson();
    },[Module.id])
    return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">{Module.name}</Typography>
          <ArrowDropDownIcon />
        </AccordionSummary>
        <AccordionDetails>
            <LessonList lessons={lessons} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
