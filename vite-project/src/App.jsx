import React, { useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import 'rc-picker/assets/index.css';
import Picker, { PickerPanel } from 'rc-picker';
import moment from 'moment';
import ruRU from '../src/locale/ru_RU'
import momentGenerateConfig from '../src/moment';
function App() {
  const defaultValue = moment('2000-01-01', 'YYYY-MM-DD')
  const [open, setOpen] = useState(false)
  const [value, setValue] = React.useState(defaultValue);

  const onSelect = (newValue) => {
    console.log('Select:', newValue);
    setValue(newValue);
  };

  const onChange = (newValue , formatString) => {
    console.log('Change:', newValue, formatString);
    setValue(newValue);
  };
  const sharedProps = {
    generateConfig: momentGenerateConfig,
    value,
    onSelect,
    onChange,
  };
  const handleSetTime = (event) => {
    const {id} = event.target 
    console.log(+id);
    const minutesToAdd = +id;
    const newTime = moment(value).add(minutesToAdd, 'minutes');
    setValue(newTime);

  }
  const handleSetCurrentTime = (event) => {
    setValue(moment());
  }
  const handleTimePickerClick = () => {
    setOpen(p=>!p)
  };

console.log(`\x1b[36m defaultValue \x1b[0m`,`: `,defaultValue)
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        
      </div>
      <h1>{String(new Date(value).getHours()).padStart(2, '0')}:{String(new Date(value).getMinutes()).padStart(2, '0')}</h1>
      <div>
        <input
          type="time"
          value={moment(value).format('HH:mm')}
          onChange={(e) => {
            const newValue = moment(e.target.value, 'HH:mm');
            setValue(newValue);
          }}
          // ref={in}
          onClick={e=>{
            // e.preventDefault()
            // e.target.
          }}
          // style={{ pointerEvents: 'none' }} 
          tabIndex="0" 
        />
        <span className="clock-icon" onClick={handleTimePickerClick}>
          ⏰
        </span>
      </div>
    {open &&    <div className='PickerContainer'>
        <div>
      <PickerPanel
        {...sharedProps} 
        locale={ruRU}
        mode="time" 
        onHover={(p)=>{
          console.log('test',p)
        }}
        showTime={{
          use12Hours: false,
          showSecond: false,
          format: 'hh:mm A',
        }}
        />
        <div className='BottomButton'> 
          <button id="1440" onClick={handleSetCurrentTime}>Текущее время</button>
        </div>
        </div>
        <div className='ActionButtons'>
        <button id="1" onClick={handleSetTime}>+ 1 мин</button>
        <button id="5" onClick={handleSetTime}>+ 5 мин</button>
        <button id="15" onClick={handleSetTime}>+ 15 мин</button>
        <button id="60" onClick={handleSetTime}>+ 60 мин</button>
        <button id="240" onClick={handleSetTime}>+ 4 часа</button>
        <button id="1440" onClick={handleSetTime}>+ 24 часа</button>
        </div>
        </div>}
    </>
  )
}

export default App
