import { coinFamiliesMap } from '@cypherock/coins';
import { IAccount } from '@cypherock/db-interfaces';
import { keyDb } from '@/db';
import { getDB } from '@/utils';
import logger from './logger';

const solanaCheckpointFixKey = 'preflight_solana_checkpoint_fix_v1';

/**
 Resets the Solana checkpoint to ensure all transactions are fetched, preventing stale data from desktop sync.
 */
async function runSolanaCheckpointFix() {
  try {
    const db = getDB();
    if (!db) return;

    const solanaAccounts = await db.account.getAll({
      familyId: coinFamiliesMap.solana,
    });

    if (solanaAccounts.length === 0) {
      return;
    }

    logger.info(
      `Pre-flight check: Found ${solanaAccounts.length} Solana accounts to fix.`,
    );

    const updates = solanaAccounts.map(account => {
      if (account.extraData?.latestTransactionHash) {
        const updatedAccount: IAccount = JSON.parse(JSON.stringify(account));
        if (updatedAccount.extraData) {
          updatedAccount.extraData.latestTransactionHash = undefined;
        }
        return db.account.update({ __id: updatedAccount.__id }, updatedAccount);
      }
      return Promise.resolve();
    });

    await Promise.all(updates);
    logger.info(
      'Pre-flight check: Successfully reset Solana transaction checkpoints.',
    );
  } catch (error) {
    logger.error('Pre-flight check: Failed to apply Solana fix.', error as any);
    throw error;
  }
}

/**
 * To be used when migrations successfully implemented
 */
async function cleanupOldSolanaFixFlag() {
  try {
    await keyDb.removeItem(solanaCheckpointFixKey);
    logger.info('Cleaned up old pre-flight check flag.');
  } catch (error) {
    logger.warn('Could not clean up old pre-flight check flag.', error as any);
  }
}

// TODO: Implement migrations and then do cleanup
export async function runPreflightChecks() {
  const hasFixBeenApplied = await keyDb.getItem(solanaCheckpointFixKey);
  if (!hasFixBeenApplied) {
    try {
      await runSolanaCheckpointFix();
      await keyDb.setItem(solanaCheckpointFixKey, 'true');
    } catch (e) {}
  }
}
