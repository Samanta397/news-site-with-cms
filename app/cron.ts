import { CronJob } from 'cron';
import express from 'express';
import { importRssSources } from '~/utils/rssSourceCron';

export const cronJob = new CronJob(
  '*/1 * * * *',
  importRssSources,
  null,
  false,
);

const app = express();

cronJob.start();
app.listen(8090, () => {
  console.log('Cron job started on port 8090');
});
