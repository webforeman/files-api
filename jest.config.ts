import type { Config } from '@jest/types'
import { pathsToModuleNameMapper } from 'ts-jest'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './',
  moduleNameMapper: pathsToModuleNameMapper(
    {
      '@/*': ['src/*'],
    },
    {
      prefix: '<rootDir>/',
    }
  ),
}

export default config
