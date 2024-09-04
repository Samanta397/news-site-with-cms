import { getActiveNewsSources, updateNewsSource } from '~/api/rss.server';

import Parser from 'rss-parser';
import { createNew, getRssNews } from '~/api/news.server';

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
        await createNew({
          title: item.title || source.name,
          content: source.has_content ? item.content : null,
          author: source.has_author ? item.author : null,
          pubDate:
            source.has_pub_date && item.pubDate ? new Date(item.pubDate) : null,
          link: source.has_content ? item.content : null,
          source_guid: item.guid || null,
        });
      }
    }

    await updateNewsSource(source.id, {
      last_import_time: new Date(),
      next_import_time: new Date(
        new Date().getTime() + source.import_interval * 60 * 1000,
      ),
    });
    console.log('Source Updated');
  }
}
