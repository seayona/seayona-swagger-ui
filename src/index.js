import dva from 'dva';
import { createLogger } from 'redux-logger';
import createLoading from 'dva-loading';

import '@root/index.css';

// 1. Initialize
const app = dva({
    onAction: [createLogger()],
    onError(e) {
        console.error(e.message);
    }
});

// 2. Plugins
app.use(createLoading())

// 3. Model
app.model(require('@models/document').default);

// 4. Router
app.router(require('@root/router').default);

// 5. Start
app.start('#root');
