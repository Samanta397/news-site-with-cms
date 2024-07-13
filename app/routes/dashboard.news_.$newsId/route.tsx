import { Card } from '~/components/Card';
import { Button } from '~/components/Button';
import { FormField } from '~/components/FormField';
import { useState } from 'react';
import { Select } from '~/components/Select';
import { Dropdown } from '~/components/Dropdown';

export default function New() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags = ['Sport', 'Polics', 'USA', 'Elect'];

  console.log('selectedTags', selectedTags);

  return (
    <div className={'flex flex-col gap-10'}>
      <div className={'flex justify-end'}>
        <Button label={'Publish'} onClick={() => console.log('Pubslish')} />
      </div>

      <div className={'flex gap-10'}>
        <Card width={'w-3/4'} gap>
          <FormField
            name="title"
            htmlFor="title"
            label="Title"
            value={title}
            required
            onChange={setTitle}
          />
          <FormField
            name="content"
            htmlFor="content"
            label="Content"
            value={content}
            required
            onChange={setContent}
          />
        </Card>

        <Card width={'w-1/4'} gap>
          <FormField
            name="author"
            htmlFor="author"
            label="Author"
            value={author}
            required
            onChange={setAuthor}
          />

          <Select
            label={'Tags'}
            name={'tag'}
            options={tags}
            value={selectedTags}
            onSelect={setSelectedTags}
            // multiple={true}
          />
          {/*<Dropdown />*/}
        </Card>
      </div>

      <div className={'flex justify-between'}>
        <Button
          label={'Move to trash'}
          onClick={() => handleDelete(userId)}
          tone={'critical'}
          // disabled={!isAdmin}
        />
        <Button type={'submit'} label={'Save as draft'} />
      </div>
    </div>
  );
}
