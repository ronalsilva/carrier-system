// Configuração do Jest para testes unitários foi gerada pela IA - Nao queria perder tempo com isso na parte de setup
require('dotenv').config();

process.env.NODE_ENV = 'TEST';

module.exports = {
	preset: 'ts-jest',
	transform: {
		'^.+\\.(t|j)sx?$': 'ts-jest',
	},
	roots: [
		'<rootDir>/src/test/modules',
	],
	testMatch: [
		'**/*.test.ts',
		'**/*.spec.ts',
	],
	testEnvironment: 'node',
	testPathIgnorePatterns: ['/node_modules/', '/prisma/'],
	coveragePathIgnorePatterns: ['/src/utils/', '/src/test/'],
	collectCoverageFrom: [
		'src/modules/**/*.ts',
		'!src/modules/**/*.schemas.ts',
		'!src/modules/**/*.routes.ts',
	],
	coverageThreshold: {
		global: {
			statements: 70,
			branches: 70,
			functions: 70,
			lines: 70,
		},
	},
	moduleFileExtensions: [
		'ts',
		'tsx',
		'js',
		'jsx',
		'json',
		'node',
	],
	moduleNameMapper: {
		'^@utils/(.*)$': '<rootDir>/src/utils/$1',
		'^@modules/(.*)$': '<rootDir>/src/modules/$1',
		'^@db/(.*)$': '<rootDir>/src/database/$1',
		'^@schemas/(.*)$': '<rootDir>/src/schemas/$1',
	},
	verbose: true,
	globals: {
		'ts-jest': {
			disableSourceMapSupport: true,
			tsconfig: {
				baseUrl: './src',
				paths: {
					'@utils/*': ['utils/*'],
					'@modules/*': ['modules/*'],
					'@db/*': ['database/*'],
					'@schemas/*': ['schemas/*'],
				},
			},
		},
	},
};
