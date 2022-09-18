import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppLockService } from '@/core/AppLockService.js';
import { DI } from '@/di-symbols.js';
import Chart from '../core.js';
import { ChartLoggerService } from '../ChartLoggerService.js';
import { name, schema } from './entities/test-intersection.js';
import type { KVs } from '../core.js';

/**
 * For testing
 */
// eslint-disable-next-line import/no-default-export
@Injectable()
export default class TestIntersectionChart extends Chart<typeof schema> {
	constructor(
		@Inject(DI.db)
		private db: DataSource,

		private appLockService: AppLockService,
		private chartLoggerService: ChartLoggerService,
	) {
		super(db, (k) => appLockService.getChartInsertLock(k), chartLoggerService.logger, name, schema);
	}

	protected async tickMajor(): Promise<Partial<KVs<typeof schema>>> {
		return {};
	}

	protected async tickMinor(): Promise<Partial<KVs<typeof schema>>> {
		return {};
	}

	public async addA(key: string): Promise<void> {
		await this.commit({
			a: [key],
		});
	}

	public async addB(key: string): Promise<void> {
		await this.commit({
			b: [key],
		});
	}
}
