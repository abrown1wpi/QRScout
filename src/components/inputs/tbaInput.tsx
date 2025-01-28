import { useEvent } from '@/hooks';
import React, { useCallback, useEffect } from 'react';
import { inputSelector, updateValue, useQRScoutState } from '../../store/store';
import { Textarea } from '../ui/textarea';
import { StringInputData } from './BaseInputProps';
import { ConfigurableInputProps } from './ConfigurableInput';

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
      setValue(e.currentTarget.value);
      e.preventDefault();
      if(e.currentTarget.value !== '') {
        console.log(fetch(`http://www.thebluealliance.com/api/v3/event/${e.currentTarget.value}/matches`, {headers: {'X-TBA-Auth-Key': '5bFhdfoXFAs0q29cECiqoKhIL6zUvKvt8R7I0IJRmjiMivI4FGPG7CyYjfEf7pLG', 'Accept': 'application/json'}}));
        //Note: it isn't critical that this is sent over HTTPS- it's not confidental information, and is publicly avalable on TBA's website
      }
    },
    [],
  );

  if (!data) {
    return <div>Invalid input</div>;
  }
  //I was going to try to make a submit button, but I don't know enough TypeScript and possibly React to know how to do that. If it were just HTML I could, but this isn't jut HTML. -Owen
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
    </>
  );
}
