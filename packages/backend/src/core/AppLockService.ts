import { promisify } from 'node:util';
import { Inject, Injectable } from '@nestjs/common';
import redisLock from 'redis-lock';
import Redis from 'ioredis';
import { DI } from '@/di-symbols.js';

/**
 * Retry delay (ms) for lock acquisition
 */
const retryDelay = 100;
import { bindThis } from '@/decorators.js';

@Injectable()
export class AppLockService {
	private lock: (key: string, timeout?: number) => Promise<() => void>;

	constructor(
		@Inject(DI.redis)
		private redisClient: Redis.Redis,
	) {
		this.lock = promisify(redisLock(this.redisClient, retryDelay));
	}

	/**
	 * Get AP Object lock
	 * @param uri AP object ID
	 * @param timeout Lock timeout (ms), The timeout releases previous lock.
	 * @returns Unlock function
	 */
	@bindThis
	public getApLock(uri: string, timeout = 30 * 1000): Promise<() => void> {
		return this.lock(`ap-object:${uri}`, timeout);
	}

	@bindThis
	public getFetchInstanceMetadataLock(host: string, timeout = 30 * 1000): Promise<() => void> {
		return this.lock(`instance:${host}`, timeout);
	}

	@bindThis
	public getChartInsertLock(lockKey: string, timeout = 30 * 1000): Promise<() => void> {
		return this.lock(`chart-insert:${lockKey}`, timeout);
	}
}
