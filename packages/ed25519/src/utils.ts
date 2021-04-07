import nacl from "@toruslabs/tweetnacl-js";

export type SECP256K1KeyType = "secp256k1";
export type ED25519KeyType = "ed25519";

export type SECP256K1Key = Buffer;
export type ED25519Key = Buffer;

const l = (nacl as any).lowlevel;

export function getED25519Key(
  privateKey: string | Buffer
): {
  sk: Buffer;
  pk: Buffer;
} {
  let privKey: Buffer;
  if (typeof privateKey === "string") {
    privKey = Buffer.from(privateKey, "hex");
  } else {
    privKey = privateKey;
  }
  // Implementation copied from tweetnacl

  const d = new Uint8Array(64);
  const sk = new Uint8Array([...new Uint8Array(privKey), ...new Uint8Array(32)]);
  const pk = new Uint8Array(32);
  const p = [l.gf(), l.gf(), l.gf(), l.gf()];
  for (let i = 0; i < 32; i += 1) d[i] = sk[i];
  // eslint-disable-next-line no-bitwise
  d[0] &= 248;
  // eslint-disable-next-line no-bitwise
  d[31] &= 127;
  // eslint-disable-next-line no-bitwise
  d[31] |= 64;
  l.scalarbase(p, d);
  l.pack(pk, p);
  for (let i = 0; i < 32; i += 1) sk[i + 32] = pk[i];

  return { sk: Buffer.from(sk), pk: Buffer.from(pk) };
}
