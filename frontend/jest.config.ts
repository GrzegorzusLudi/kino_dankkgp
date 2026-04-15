import { getJestProjectsAsync } from '@nx/jest';
import type { Config } from 'jest';

const jestConfig = async (): Promise<Config> => ({
    projects: await getJestProjectsAsync(),
  });

export default jestConfig;
