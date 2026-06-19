import dns from 'dns/promises';
import net from 'net';

const ALLOWED_REMOTE_IMAGE_PROTOCOLS = new Set(['http:', 'https:']);

export function isBlockedIPv4(ip: string) {
  const octets = ip.split('.').map((part) => Number(part));
  if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return true;
  }

  const [first, second] = octets;
  return first === 0
    || first === 10
    || first === 127
    || first === 169 && second === 254
    || first === 172 && second >= 16 && second <= 31
    || first === 192 && second === 168
    || first === 100 && second >= 64 && second <= 127
    || first >= 224;
}

export function isBlockedIPv6(ip: string) {
  const normalized = ip.toLowerCase();
  return normalized === '::1'
    || normalized === '::'
    || normalized.startsWith('fc')
    || normalized.startsWith('fd')
    || normalized.startsWith('fe80:')
    || normalized.startsWith('ff');
}

export function isBlockedIp(ip: string) {
  const version = net.isIP(ip);
  if (version === 4) return isBlockedIPv4(ip);
  if (version === 6) return isBlockedIPv6(ip);
  return true;
}

export async function validatePublicRemoteUrl(url: URL) {
  if (!ALLOWED_REMOTE_IMAGE_PROTOCOLS.has(url.protocol)) {
    return false;
  }

  if (url.username || url.password) {
    return false;
  }

  const hostname = url.hostname;
  if (!hostname) {
    return false;
  }

  const literalIpVersion = net.isIP(hostname);
  if (literalIpVersion && isBlockedIp(hostname)) {
    return false;
  }

  const records = await dns.lookup(hostname, { all: true, verbatim: true });
  return records.length > 0 && records.every((record) => !isBlockedIp(record.address));
}
