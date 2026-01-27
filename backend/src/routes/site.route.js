import { Router } from 'express';
import { getSite } from '../controller/site.controller.js'

const router  = Router();

router.get('/', getSite)