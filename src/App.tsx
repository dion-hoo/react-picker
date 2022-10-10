import { useState } from 'react';

import { Wheels } from '~/pages/wheels/Wheels';

import './App.scss';

function App() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();

  const list1 = Array.from({ length: 31 }).map((_, index) => `${index + 1}일`);

  const list2 = Array.from({ length: 10 }).map((_, index) => `아이템${index + 1}`);
  const list3 = Array.from({ length: 18 }).map((_, index) => `리스트${index + 1}`);

  const [list, setList] = useState(list1);
  const [value, setValue] = useState(`${day}일`);

  return (
    <div className="App">
      <Wheels
        wheelsData={[
          {
            list: Array.from({ length: 30 }).map((_, index) => `20${`${index + 1}`.padStart(2, '0')}년`),
            selected: `${year}년`,
            onSelected(value) {
              if (value === '2010년') {
                setList(list2);
                setValue('아이템7');
              }
            },
          },
          {
            list: Array.from({ length: 12 }).map((_, index) => `${index + 1}월`),
            selected: `${month}월`,
            onSelected(value) {
              if (value === '5월') {
                setList(list3);
                setValue('리스트12');
              }
            },
          },
          {
            list: list,
            selected: value,
          },
        ]}
      />
    </div>
  );
}

export default App;
