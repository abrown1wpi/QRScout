import { useEvent } from '@/hooks';
import React, { useCallback, useEffect } from 'react';
import { inputSelector, updateValue, useQRScoutState } from '../../store/store';
import { Textarea } from '../ui/textarea';
import { StringInputData } from './BaseInputProps';
import { ConfigurableInputProps } from './ConfigurableInput';
import { Button } from '../ui/button';

export default function TBAInput(props: ConfigurableInputProps) {
  const data = useQRScoutState(
    inputSelector<StringInputData>(props.section, props.code),
  );

  if (!data) {
    return <div>Invalid input</div>;
  }
  const [value, setValue] = React.useState(data.defaultValue);

  const resetState = useCallback(() => {
    if (data.formResetBehavior === 'preserve') {
      return;
    }
    setValue(data.defaultValue);
  }, [data.defaultValue]);

  useEvent('resetFields', resetState);

  useEffect(() => {
    updateValue(props.code, value);
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      console.log(e.currentTarget.value);
      setValue(e.currentTarget.value);
      console.log(value);
      e.preventDefault();
    },
    [],
  );
  const handleSubmit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      console.log('TBA data submited');
      //A lot of this code here is to make TypeScript stop complaining about things possibly being null or not existing. If someone knows of a more efficent way to write it, please do.
      const containerElement = e.currentTarget.parentElement;
      if (containerElement !== null) {
        const textEl: HTMLTextAreaElement | Element = containerElement.children[0];
        const textValue: String = (textEl instanceof HTMLTextAreaElement) ? textEl.value : '';
        if (textValue !== '') {
          fetch(`https://www.thebluealliance.com/api/v3/event/${textValue}/matches`, { headers: { 'X-TBA-Auth-Key': '5bFhdfoXFAs0q29cECiqoKhIL6zUvKvt8R7I0IJRmjiMivI4FGPG7CyYjfEf7pLG', 'Accept': 'application/json' } }).then(() => {
            
          });
        }
      }
    },
    []
  );
  if (!data) {
    return <div>Invalid input</div>;
  }
  //TODO: make submit button to cut down on unnecessary HTTP requests while the user is typing
  return (
    <>
      <Textarea
        disabled={data.disabled}
        name={`${data.title}_input`}
        id={`${data.title}_input`}
        onChange={handleChange}
        value={value}
        maxLength={data.max}
        minLength={data.min}
      />
      <hr></hr>
      <Button variant={'outline'} size={'lg'} onClick={handleSubmit}>Submit</Button>
    </>
  );
}
