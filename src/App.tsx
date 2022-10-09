import { Wheels } from '~/pages/wheels/Wheels';

function App() {
  return (
    <div className="App">
      <Wheels
        list={[]}
        wheelsData={[
          {
            list: list1,
            rows: 7,
            selected: '2011',
            onSelected(value, index) {},
          },
          {
            list: list1,
            rows: 7,
            selected: '2012',
            onSelected(value, index) {},
          },
          {
            list: list1,
            rows: 7,
            selected: '2020',
            onSelected(value, index) {},
          },
        ]}
      />
    </div>
  );
}

export default App;

const list1 = Array.from({ length: 30 }).map((_, index) =>
  `20${index}`.padStart(2, '0')
);
