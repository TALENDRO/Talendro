import { generateEmulatorAccount, Emulator } from "@lucid-evolution/lucid";

export const Admin = generateEmulatorAccount({ lovelace: 10_000_000_000n });
export const UserA = generateEmulatorAccount({ lovelace: 10_000_000_000n });
export const UserB = generateEmulatorAccount({ lovelace: 10_000_000_000n });
export const UserC = generateEmulatorAccount({ lovelace: 10_000_000_000n });

export const emulator = new Emulator([UserA, UserB, UserC, Admin]);
