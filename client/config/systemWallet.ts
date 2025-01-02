import { TransactionWitnesses, TxSignBuilder } from "@lucid-evolution/lucid";

export async function SystemWallet(tx: TxSignBuilder) {
    const privateKey = process.env.NEXT_PUBLIC_SYSTEM_WALLET as string
    // const txSystemSigned: TransactionWitnesses = await tx.partialSign.withPrivateKey(privateKey)
    const txSystemSigned = await tx.sign.withPrivateKey(privateKey)
    return txSystemSigned
}