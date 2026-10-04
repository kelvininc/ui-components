import { afterEach } from 'vitest';
import { resetStencilMocks } from './stencil-mocks';

// Every test starts without the mocks an earlier test rendered, even one that never unmounted them
afterEach(() => resetStencilMocks());
