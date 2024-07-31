import { getActiveNewsSources } from '~/api/rss.server';

import Parser from 'rss-parser';
import { getRssNews } from '~/api/news.server';

const parser = new Parser();

export async function importRssSources() {
  // console.log('Import start');

  const sources = await getActiveNewsSources();

  if (!sources) {
    return;
  }

  for (const source of sources) {
    const isImportTimeValid = source.last_import_time
      ? new Date().getTime() - new Date(source.last_import_time).getTime() >
        source.import_interval * 60 * 1000
      : true;

    // console.log('isImportTimeValid', isImportTimeValid);

    if (!isImportTimeValid) {
      console.log(
        'Import skipped for source ',
        source.url,
        'because of import interval',
      );
      continue;
    }

    const feed = await parser.parseURL(source.url);

    for (const item of feed.items) {
      const rssNews = await getRssNews(item.title, item.guid);

      if (!rssNews) {
        //TODO: create news
      }
      //TODO: update source last and next import time
    }
    //
    feed.items.forEach((item: any) => {
      console.log(item);
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    });

    // console.log(feed.items[0]);
  }
}
