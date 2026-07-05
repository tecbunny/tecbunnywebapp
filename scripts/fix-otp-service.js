const fs = require('fs');
let content = fs.readFileSync('packages/core/src/otp-service.ts', 'utf8');

const replacement = `import { createServiceClient, isSupabaseServiceConfigured } from "@tecbunny/core";
/**
 * OTP Verification Service for Agent Orders and Customer Verification
 * Handles OTP generation, validation, and management
 */

import type { OtpType } from '@tecbunny/core';
import { improvedEmailService } from './improved-email-service';
import crypto from 'crypto';
import { rateLimit } from './rate-limit';

import { logger } from '@tecbunny/core';

export interface OtpRequest {`;

content = content.replace(/^.*?(?=export interface OtpRequest \{)/s, replacement + '\n');
content = content.replace(/await emailClient\.sendOtpEmail\(([^,]+), ([^\)]+)\);/g, 'await improvedEmailService.sendOTPEmail($1, $2);');
fs.writeFileSync('packages/core/src/otp-service.ts', content);
