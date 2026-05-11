/**
 * Usage Tracking and Paywall Enforcement
 * Manages free tier limits and subscription checks
 */

import { getUserAnalysisCount, checkSubscriptionStatus } from './supabase';
import { createClient } from '@supabase/supabase-js';

// Free tier limit
const FREE_TIER_LIMIT = 2;

// Type definitions
export interface UsageLimit {
  canAnalyse: boolean;
  count: number;
  limit: number;
}

/**
 * Check if a user can perform an analysis
 * @param userId - The user's ID
 * @param client - Optional authenticated Supabase client (for server-side use with RLS)
 * @returns Object with canAnalyse flag, current count, and limit
 */
export async function checkUsageLimit(
  userId: string,
  client?: any
): Promise<UsageLimit> {
  try {
    // Get current analysis count
    const count = await getUserAnalysisCount(userId, client);

    // Check if user has active subscription
    const isPaid = await checkSubscriptionStatus(userId, client);

    // Paid users have unlimited analyses
    if (isPaid) {
      return {
        canAnalyse: true,
        count,
        limit: Infinity,
      };
    }

    // Free users have a limit
    const canAnalyse = count < FREE_TIER_LIMIT;

    return {
      canAnalyse,
      count,
      limit: FREE_TIER_LIMIT,
    };
  } catch (error) {
    console.error('Error checking usage limit:', error);
    throw new Error('Failed to check usage limit. Please try again.');
  }
}

/**
 * Increment the analysis count for a user
 * This should be called after a successful analysis
 * @param userId - The user's ID
 */
export async function incrementUsageCount(userId: string): Promise<void> {
  try {
    // The count is automatically incremented when a new analysis is created
    // This function is a placeholder for future use (e.g., if we need to track
    // additional metrics or perform other operations after an analysis)
    console.log(`Usage count incremented for user ${userId}`);
  } catch (error) {
    console.error('Error incrementing usage count:', error);
    throw new Error('Failed to increment usage count. Please try again.');
  }
}

export { FREE_TIER_LIMIT };
