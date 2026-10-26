import { afterEach } from 'vitest';
import { resetStencilMocks } from './stencil-mocks';

// Tells React these tests run inside act(), so it warns about updates that happen outside one
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// Every test starts without the mocks an earlier test rendered, even one that never unmounted them
afterEach(() => resetStencilMocks());
