import * as R from 'ramda';
const webApp = {
   luckyNumbers: [3, 7, 21, 777],
   setup() {
      const elem = globalThis.document.getElementById('lucky-num');
      elem.innerText = R.last(webApp.luckyNumbers);
      },
   };
export { webApp };
